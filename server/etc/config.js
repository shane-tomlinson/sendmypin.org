/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

exports.port = process.env.PORT || 3000;
exports.ip_address = process.env.IP_ADDRESS || "127.0.0.1";
exports.hostname = "sendmypin.org";
exports.twilio = {
  sid: process.env.TWILIO_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  incoming: process.env.TWILIO_INCOMING_ID,
  outgoing: process.env.TWILIO_OUTGOING_ID,
  hostname: "sendmypin.org"
};
exports.pin_length = 6;
exports.pin_message = "Your PIN is %s";
exports.pub_key_path = "";
exports.priv_key_path = "";
