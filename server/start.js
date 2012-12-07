/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const express     = require("express"),
      path        = require("path"),
      winston     = require("winston"),
      send_sms    = require("./lib/send-sms"),
      config      = require("./etc/config");

send_sms.init({}, function(err) {
  var app = express();

  app.set("view engine", "jade");
  app.set("views", path.join(__dirname, "views"));
  app.use(express.bodyParser())
     .use(express.cookieParser())
     .use(express.session({
       secret: "mysecret"
     }))
     .use(express.static(path.join(__dirname, "..", "client")));

  app.get("/sign_in", function(req, res, next) {
    req.session.authenticated = false;
    req.session.tel = req.session.pin = null;

    res.render("sign_in");
  });

  app.get("/provision", function(req, res, next) {
    res.render("provision");
  });

  app.get("/tel", function(req, res, next) {
    var tel = req.query.tel.trim().replace(/[\+\s]/g, '');

    if (req.session.authenticated && tel === req.session.tel) {
      res.json({ success: true });
    }
    else {
      res.json({ success: false });
    }
  });

  app.post("/tel", function(req, res, next) {
    var tel = req.body.tel.trim().replace(/[\+\s]/g, '');
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

  app.post("/cert_key", function(req, res, next) {
  });


  winston.log("info", "starting server on " + config.ip_address + ":" + config.port);
  app.listen(config.port, config.ip_address);
});
