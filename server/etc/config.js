/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const path        = require("path");

exports.port = process.env.PORT || 3000;
exports.ip_address = process.env.IP_ADDRESS || "127.0.0.1";
exports.hostname = "sendmypin.org";

// PIN info.
exports.pin_length = 6;
exports.pin_message = "Your PIN is %s";

// Twilio creds.
exports.twilio = {
  sid: process.env.TWILIO_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  incoming: process.env.TWILIO_INCOMING_ID,
  outgoing: process.env.TWILIO_OUTGOING_ID,
  hostname: "sendmypin.org"
};


// The path to the public/private keypair used to sign certificates.
exports.pub_key_path = path.join(__dirname, "..", "..", "idp-cert", "key.publickey");
exports.priv_key_path = path.join(__dirname, "..", "..", "idp-cert", "key.secretkey");
exports.pub_key_ttl = 120;

// Maximum number of processes to use for key-signing
exports.max_compute_processes = 20;

// Default certificate duration in ms
exports.certificat_validity_ms = 3600;

// The browserid host. Javascript includes come from here.
exports.browserid_host = "https://login.persona.org";

exports.get = function(name) {
  return exports[name];
};
