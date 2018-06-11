var request = require('google-oauth-jwt').requestWithJWT();
var util = require('util');

module.exports = Verifier;
function Verifier(options) {
  this.options = options || {};
}

Verifier.prototype.verifyINAPP = function(receipt, cb) {
  var urlPattern = "https://www.googleapis.com/androidpublisher/v3/applications/%s/purchases/products/%s/tokens/%s";
  var finalUrl = util.format(urlPattern, encodeURIComponent(receipt.packageName), encodeURIComponent(receipt.productId), encodeURIComponent(receipt.purchaseToken));
  request({
    url: finalUrl,
    jwt: {
      email: this.options.email,
      key: this.options.key,
      keyFile: undefined,
      scopes: ['https://www.googleapis.com/auth/androidpublisher']
    }
  }, function (err, res, body) {
    if (err) {
      return cb(err);
    }
    var obj = JSON.parse(body);
    if ("error" in obj) {
      cb(new Error(obj.error.message));
    }else {
      cb(null, obj);
    }
  });
};

Verifier.prototype.verifySub = function(receipt, cb) {
  var urlPattern = "https://www.googleapis.com/androidpublisher/v3/applications/%s/purchases/subscriptions/%s/tokens/%s";
  var finalUrl = util.format(urlPattern, encodeURIComponent(receipt.packageName), encodeURIComponent(receipt.productId), encodeURIComponent(receipt.purchaseToken));
  request({
    url: finalUrl,
    jwt: {
      email: this.options.email,
      key: this.options.key,
      keyFile: undefined,
      scopes: ['https://www.googleapis.com/auth/androidpublisher']
    }
  }, function (err, res, body) {
    if (err) {
      return cb(err);
    }
    var obj = JSON.parse(body);
    if ("error" in obj) {
      cb(new Error(obj.error.message));
    }else if ("expiryTimeMillis" in obj && "startTimeMillis" in obj) {
      cb(null, obj);
    } else {
      cb(new Error("body did not contain expected json object"));
    }
  });
};
