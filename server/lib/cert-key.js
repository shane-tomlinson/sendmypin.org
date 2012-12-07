/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
certify = require('./certify.js'),

module.exports = function(config) {
  return function(req, res, next) {
    // validate optional 'duration' parameter
    if (!req.body.duration) {
      req.body.duration = config.get('certificate_validity_ms');
    } else if (typeof req.body.duration !== 'number') {
      return res.json({
        success: false,
        reason: 'duration argument must be a number when present'
      }, 400);
    }

    // validate required 'pubkey' parameter
    if (typeof req.body.pubkey != 'string') {
      return res.json({
        success: false,
        reason: 'pubkey argument is required and must be a string'
      }, 400);
    }

    // validate required 'email' parameter
    if (typeof req.body.email != 'string') {
      return res.json({
        success: false,
        reason: 'email argument is required and must be a string'
      }, 400);
    }

    certify({
      email: req.body.email,
      pubkey: req.body.pubkey,
      duration: req.body.duration,
      hostname: config.issuer_hostname
    }, function(err, certificate) {
      var ro = { };
      if (err) {
        ro.success = false;
        ro.reason = err.toString();
      } else {
        ro.success = true;
        ro.certificate = certificate;
      }

      res.json(ro, ro.success ? 200 : 400);
    });
  };
};

