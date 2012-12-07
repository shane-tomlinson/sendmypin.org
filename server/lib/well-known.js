/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const fs          = require("fs"),
      winston     = require("winston"),
      config      = require("../etc/config"),
      pubkey      = JSON.parse(fs.readFileSync(config.pub_key_path, "utf8"));

module.exports = function() {
  var well_known_last_mod = new Date().getTime();

  return function(req, res, next) {
    var start = new Date(),
        timeout = config.pub_key_ttl;

    if (req.headers["if-modified-since"] !== undefined) {
      var since = new Date(req.headers["if-modified-since"]);
      if (isNaN(since.getTime())) {
        winston.error("======== Bad date in If-Modified-Since header");
      } else {
        // Does the client already have the latest copy?
        if (since >= well_known_last_mod) {
          // TODO move above?
          res.setHeader("Cache-Control", "max-age=" + timeout);
          return res.send(304);
        }
      }
    }

    res.setHeader("Cache-Control", "max-age=" + timeout);
    res.setHeader("Last-Modified", new Date(well_known_last_mod).toUTCString());
    res.json({
      "public-key": pubkey,
      "authentication": "/sign_in",
      "provisioning": "/provision"
    });
  };
}
