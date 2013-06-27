/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*const useragent = require('useragent');*/
const policy = 'CP="This is not a P3P policy, we neither store nor share any information about you"';

// add 'P3P' headers so that IE8, with default security settings, will allow
// us to set third-party cookies. Only add the headers in that case, saving
// bytes for all the other browsers. #2340
exports.setup = function() {
  return function(req, res, next) {
    res.on('header', function() {
      res.setHeader('P3P', policy);
    });
    next();
  };
};

