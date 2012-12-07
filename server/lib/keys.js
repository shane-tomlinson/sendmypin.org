var logger = require('winston'),
  jwcrypto = require('jwcrypto'),
      cert = jwcrypto.cert,
   winston = require('winston'),
        fs = require('fs'),
    config = require('../etc/config.js');

require("jwcrypto/lib/algs/rs");
require("jwcrypto/lib/algs/ds");

var kp;

function readKeys(cb) {
  if (kp) return process.nextTick(function() { cb(null, kp); });
  fs.readFile(config.get('pub_key_path'), function(err, content) {
    try {
      if (err) throw err;
      var pk = jwcrypto.loadPublicKey(content);
      kp = { publicKey: pk };
      fs.readFile(config.get('priv_key_path'), function(err, content) {
        try {
          if (err) throw err;
          kp.secretKey = jwcrypto.loadSecretKey(content.toString());
          cb(null, kp);
        } catch(e) {
          winston.error('can\'t read pub key: ' + e);
          process.exit(1);
        }
      });
    } catch(e) {
      winston.error('can\'t read pub key: ' + e);
      process.exit(1);
    }
  });
}

module.exports.pubkey = function(cb) {
  readKeys(function(err, kp) {
    cb(err, kp ? kp.publicKey : null);
  });
};

module.exports.privkey = function(cb) {
  readKeys(function(err, kp) {
    cb(err, kp ? kp.secretKey : null);
  });
};
