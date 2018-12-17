var request = require('google-oauth-jwt').requestWithJWT();
var util = require('util');

module.exports = Verifier;

function Verifier(options) {
  this.options = options || {};
}

Verifier.prototype.verifyINAPP = function(receipt) {
  let urlPattern = "https://www.googleapis.com/androidpublisher/v3/applications/%s/purchases/products/%s/tokens/%s";
  let finalUrl = util.format(urlPattern, encodeURIComponent(receipt.packageName), encodeURIComponent(receipt.productId), encodeURIComponent(receipt.purchaseToken));

  return this.verify(finalUrl)
};

Verifier.prototype.verifySub = function(receipt) {
  var urlPattern = "https://www.googleapis.com/androidpublisher/v3/applications/%s/purchases/subscriptions/%s/tokens/%s";
  var finalUrl = util.format(urlPattern, encodeURIComponent(receipt.packageName), encodeURIComponent(receipt.productId), encodeURIComponent(receipt.purchaseToken));

  return this.verify(finalUrl)
};


Verifier.prototype.verify = function(finalUrl){
  let options = {
    uri: finalUrl,
    jwt: {
      email: this.options.email,
      key: this.options.key,
      scopes: ['https://www.googleapis.com/auth/androidpublisher']
    }
  }

  return new Promise(function(resolve, reject) {
    request(options, function(err, res, body) {
      let resultInfo = {}

      if (err) {
        // Google Auth Errors returns here
        let errorMessage = err.body.error_description
        resultInfo.isSuccessful = false
        resultInfo.errorMessage = errorMessage

        reject(resultInfo);
      } else {
        let obj = JSON.parse(body);

        let statusCode = res.statusCode
        //console.log("statusCode: " + statusCode);

        if (res.statusCode === 200) {
          // All Good
          //console.log("All good!");

          resultInfo.isSuccessful = true
          resultInfo.errorMessage = null

          resultInfo.payload = obj

          resolve(resultInfo);

        } else {
          // Error
          let errorMessage = obj.error.message

          resultInfo.isSuccessful = false
          resultInfo.errorMessage = errorMessage

          //console.log(resultInfo);
          reject(resultInfo);
        }

      }
    });

  })
}
