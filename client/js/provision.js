/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
  "use strict";
  navigator.id.beginProvisioning(function(email, certDuration) {
    var tel = email.replace("@sendmypin.org", "");
    isAuthenticated(tel, function(authenticated) {
      if (authenticated) {
        navigator.id.genKeyPair(function(pubKey) {
          certifyKey(email, pubKey, certDuration, function(cert) {
            navigator.id.registerCertificate(certificate);
          });
        });
      }
      else {
        navigator.id.raiseProvisioningFailure("user is not authenticated as target user");
      }
    });
  });

  function isAuthenticated(tel, done) {
    $.ajax({
      type: "GET",
      url: "/tel",
      data: {
        tel: tel
      },
      success: function(resp, code) {
        done && done(resp.success);
      }
    });
  }

  function certifyKey(key, duration, done) {
    $.ajax({
      type: "POST",
      url: "/cert_key",
      data: {
        key: key,
        duration: duration
      },
      success: function(resp) {
      }
    });
  }
}());
