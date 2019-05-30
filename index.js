const request = require('google-oauth-jwt').requestWithJWT();
const util = require('util');

module.exports = Verifier;

function Verifier(options) {
  this.options = options || {};
}

Verifier.prototype.verifyINAPP = function (receipt) {
  let urlPattern = "https://www.googleapis.com/androidpublisher/v3/applications/%s/purchases/products/%s/tokens/%s";
  let finalUrl = util.format(urlPattern, encodeURIComponent(receipt.packageName), encodeURIComponent(receipt.productId), encodeURIComponent(receipt.purchaseToken));

  return this.verify(finalUrl)
};

Verifier.prototype.verifySub = function (receipt) {
  let urlPattern = "https://www.googleapis.com/androidpublisher/v3/applications/%s/purchases/subscriptions/%s/tokens/%s";
  let finalUrl = util.format(urlPattern, encodeURIComponent(receipt.packageName), encodeURIComponent(receipt.productId), encodeURIComponent(receipt.purchaseToken));

  return this.verify(finalUrl)
};

function isValidJson(string) {
  try {
    JSON.parse(string);
  } catch (e) {
    return false;
  }
  return true;
}

Verifier.prototype.verify = function (finalUrl) {
  let options = {
    uri: finalUrl,
    jwt: {
      email: this.options.email,
      key: this.options.key,
      scopes: ['https://www.googleapis.com/auth/androidpublisher']
    }
  };

  return new Promise(function (resolve, reject) {
    request(options, function (err, res, body) {
      let resultInfo = {};

      if (err) {
        // Google Auth Errors returns here
        let errBody = err.body;
        let errorMessage;
        if (errBody) {
          errorMessage = err.body.error_description;
        } else {
          errorMessage = err;
        }
        resultInfo.isSuccessful = false;
        resultInfo.errorMessage = errorMessage;

        reject(resultInfo);
      } else {

        let obj = {
          "error": {
            "code": 404,
            "message": "Invalid response, please check 'Verifier' configuration"
          }
        };

        if (isValidJson(body)) {
          obj = JSON.parse(body);
        }

        if (res.statusCode === 200) {
          // All Good

          resultInfo.isSuccessful = true;
          resultInfo.errorMessage = null;

          resultInfo.payload = obj;

          resolve(resultInfo);

        } else {
          // Error
          let errorMessage = obj.error.message;

          resultInfo.isSuccessful = false;
          resultInfo.errorMessage = errorMessage;

          reject(resultInfo);
        }

      }
    });

  })
};
