/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const winston         = require("winston"),
      TwilioClient    = require("twilio").Client,
      config          = require("../etc/config"),
      twilioConfig    = config.twilio;


var phone;

exports.init = function(config, done) {
  if (config.phone) {
    phone = config.phone;
    done && done(null);
  } else {
    try {
      var client = new TwilioClient(twilioConfig.sid,
                       twilioConfig.authToken, twilioConfig.hostname);
      phone = client.getPhoneNumber(twilioConfig.outgoing);
      phone.setup(function(err) {
        done && done(err || null);
      });
    } catch(e) {
      done && done(e);
    }
  }
};

/*
 * send an sms to the given phone number
 * @method sendSMS
 * @param {string} phoneNumber
 * @param {function} done - called with two parameters, err and PIN
 */
exports.sendSMS = function(phoneNumber, done) {
  var pin = exports.generatePIN(),
      message = config.pin_message.replace(/%s/, pin);

  winston.info("sending sms: " + message + " to " + phoneNumber);
  phone.sendSms(phoneNumber, message, null, function(sms) {
    done && done(null, pin);
  });
};

exports.generatePIN = function() {
  var pin = "";

  for(var i = 0; i < config.pin_length; ++i) {
    pin += Math.floor(Math.random() * 10);
  }

  return pin;
};

