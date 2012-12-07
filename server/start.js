/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const express     = require("express"),
      path        = require("path"),
      winston     = require("winston"),
      twilio      = require("twilio"),
      config      = require("./etc/config");

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
  res.render("sign_in");
});

app.post("/tel", function(req, res, next) {
  winston.info("received telephone number");
  res.json({ success: true });
});

app.post("/pin", function(req, res, next) {
  winston.info("received PIN");
  res.json({ success: true });
});

winston.log("info", "starting server on " + config.ip_address + ":" + config.port);
app.listen(config.port, config.ip_address);

