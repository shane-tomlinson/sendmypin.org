/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const express     = require("express"),
      path        = require("path"),
      winston     = require("winston"),
      connect_fonts
                  = require('connect-fonts'),
      font_merriweather_sans
                  = require('connect-fonts-merriweathersans'),
      helmet      = require('helmet'),
      p3p         = require("./lib/p3p"),
      send_sms    = require("./lib/send-sms"),
      well_known  = require("./lib/well-known"),
      cert_key    = require("./lib/cert-key"),
      config      = require("./etc/config");

const browserid_host = config.get("browserid_host");

// Cache fonts for 180 days.
const MAX_FONT_AGE_MS = 1000 * 60 * 60 * 24 * 180;

send_sms.init({}, function(err) {
  if (err) {
    winston.error(String(err));
    process.exit(1);
  }

  var app = express();

  app.set("view engine", "jade");
  app.set("views", path.join(__dirname, "views"));
  app.use(express.bodyParser())
     .use(express.cookieParser())
     .use(express.session({
       secret: "mysecret"
     }))
     .use(express.static(path.join(__dirname, "..", "client")));

  helmet.defaults(app, { xframe: false, cacheControl: false });
  app.use(helmet.xframe('allow-from', browserid_host));
  helmet.csp.policy({
    defaultPolicy: {
      'default-src': ["'self'"],
      'script-src': ["'self'", browserid_host]
    }
  });

  app.use(connect_fonts.setup({
    fonts: [ font_merriweather_sans ],
    allow_origin: "*",
    ua: 'all',
    maxage: MAX_FONT_AGE_MS
  }));

  app.use(p3p.setup());

  app.get("/", function(req, res, next) {
    res.render("index", {});
  });

  app.get("/index.html", function(req, res, next) {
    res.redirect("/");
  });

  app.get("/signout", function(req, res, next) {
    req.session.authenticated = false;
    req.session.tel = req.session.pin = null;
    res.redirect(301, "/sign_in");
  });

  app.get("/sign_in", function(req, res, next) {
    req.session.authenticated = false;
    req.session.tel = req.session.pin = null;

    res.render("sign_in", {
      browserid_host: browserid_host
    });
  });

  app.get("/provision", function(req, res, next) {
    res.render("provision", {
      browserid_host: browserid_host
    });
  });

  app.get("/.well-known/browserid", well_known());

  function noCache(res) {
    res.on('header', function() {
      console.log("disabling headers");
      // explicitly disallow caching - IE8 aggressively caches GET requests
      res.setHeader('Cache-Control', 'no-cache, max-age=0');
    });
  }

  // Below here are API calls
  app.get("/tel", function(req, res, next) {
    noCache(res);

    var tel = req.query.tel.trim().replace(/[\+\s]/g, "");
    winston.info("attempting to authenticate: " + tel);
    winston.info("session.tel: " + req.session.tel);
    winston.info("session.authenticated: " + req.session.authenticated);

    if (req.session.authenticated && tel === req.session.tel) {
      winston.info("authenticated: true");
      res.json({ success: true });
    }
    else {
      winston.info("authenticated: false");
      res.json({ success: false });
    }
  });

  app.post("/tel", function(req, res, next) {
    var tel = req.body.tel.trim().replace(/[\+\s]/g, "");
    winston.info("received telephone number: " + tel);

    send_sms.sendSMS(tel, function(err, pin) {
      if (err) return res.json({ success: false });

      req.session.tel = tel;
      req.session.pin = pin;
      res.json({ success: true });
    });
  });

  app.post("/pin", function(req, res, next) {
    var pin = req.body.pin.trim();
    winston.info("received PIN: " + pin);

    if (req.session.pin === pin) {
      req.session.authenticated = true;
      res.json({ success: true });
    }
    else {
      // TODO - add a lockout.
      req.session.authenticated = false;
      res.json({ success: false });
    }
  });

  app.post("/cert_key", cert_key({
    issuer_hostname: config.hostname
  }));


  winston.log("info", "starting server on " + config.ip_address + ":" + config.port);
  app.listen(config.port, config.ip_address);
});
