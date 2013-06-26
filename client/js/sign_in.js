/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
(function() {
  "use strict";

  if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g,'');
    };
  }

  navigator.id.beginAuthentication(function(email) {
    var tel = email.replace('@sendmypin.org', '');
    $("#phone_number").val(tel);

    $("#form_authenticate").slideDown();
  });

  $("#form_authenticate").on("submit", function(event) {
    event.preventDefault();

    var tel = $('#phone_number').val().trim();
    submitTel(tel);
  });

  $("#form_pin").on("submit", function(event) {
    event.preventDefault();

    var pin = $('#pin').val().trim();
    submitPin(pin);
  });

  function submitTel(tel, done) {
    $("#phone_number").attr("disabled", "disabled");
    sendTel(tel, function(status) {
      var success = status.success;

      if (success) {
        $("#form_pin").slideDown();
        done && done(data);
      }
      else {
        $("#phone_number").removeAttr("disabled");
      }
    });
  }

  function sendTel(tel, done) {
    $.ajax({
      type: "POST",
      url: "/tel",
      data: {
        tel: tel
      },
      success: done
    });
  }

  function submitPin(pin, done) {
    $("#pin").attr("disabled", "disabled");

    sendPin(pin, function(status) {
      var success = status.success;

      if (success) {
        $("#success").slideDown(function() {
          navigator.id.completeAuthentication();
        });
        done && done(data);
      }
      else {
        $("#pin").removeAttr("disabled");
      }
    });
  }

  function sendPin(pin, done) {
    $.ajax({
      type: "POST",
      url: "/pin",
      data: {
        pin: pin
      },
      success: done
    });
  }
}());

