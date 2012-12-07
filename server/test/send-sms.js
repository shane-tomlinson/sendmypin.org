/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const send_sms      = require("../lib/send-sms")
      config        = require("../etc/config").twilio,
      assert        = require("assert");


describe("send-sms", function() {
  describe("generatePIN", function() {
    it("should return a PIN", function() {
      var pin = send_sms.generatePIN();
      assert.ok(pin.length);
    });
  });

  describe("sendSMS", function() {
    it("should send an SMS to a phone number and return a PIN", function(done) {
      var phoneMock = {
        sendSms: function(to, body, opts, done) {
          this.to = to;
          this.body = body;
          this.opts = opts;
          done && done();
        }
      };

      send_sms.init({ phone: phoneMock }, function(err) {
        assert.equal(err, null);

        var telToSMS = config.incoming;
        send_sms.sendSMS(telToSMS, function(err, pin) {
          assert.equal(err, null);
          assert.ok(pin.length);

          assert.equal(phoneMock.to, telToSMS);
          assert.ok(phoneMock.body.length);

          done();
        });
      });
    });
  });
});

