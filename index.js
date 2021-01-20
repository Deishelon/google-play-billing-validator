const request = require('google-oauth-jwt').requestWithJWT();
const util = require('util');

module.exports = Verifier;

// Allow default import syntax from TypeScript
module.exports.default = Verifier;

function Verifier(options) {
  this.options = options || {};
}

Verifier.prototype.verifyINAPP = function (receipt) {
  this.options.method = 'get';
  this.options.body = "";
  this.options.json = false;
  
  let urlPattern = "https://www.googleapis.com/androidpublisher/v3/applications/%s/purchases/products/%s/tokens/%s";
  if ("developerPayload" in receipt) {
    urlPattern += ":acknowledge";
    this.options.body = {
      "developerPayload": receipt.developerPayload
    }
    this.options.method = 'post';
    this.options.json = true;
  }
  let finalUrl = util.format(urlPattern, encodeURIComponent(receipt.packageName), encodeURIComponent(receipt.productId), encodeURIComponent(receipt.purchaseToken));
  
  return this.verify(finalUrl)
};

Verifier.prototype.verifySub = function (receipt) {
  this.options.method = 'get';
  this.options.body = "";
  this.options.json = false;
  
  let urlPattern = "https://www.googleapis.com/androidpublisher/v3/applications/%s/purchases/subscriptions/%s/tokens/%s";
  if ("developerPayload" in receipt) {
    urlPattern += ":acknowledge";
    this.options.body = {
      "developerPayload": receipt.developerPayload
    }
    this.options.method = 'post';
    this.options.json = true;
  }
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
    method: this.options.method,
    body: this.options.body,
    json: this.options.json,
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
            "code": res.statusCode,
            "message": "Invalid response, please check 'Verifier' configuration or the statusCode above"
          }
        };
        if (res.statusCode === 204) {
          obj = {
            "code": res.statusCode,
            "message": "Acknowledged Purchase Successfully"
          };
        }

        if (isValidJson(body)) {
          obj = JSON.parse(body);
        }

        if (res.statusCode === 200 || res.statusCode === 204) {
          // All Good

          resultInfo.isSuccessful = true;
          resultInfo.errorMessage = null;

          resultInfo.payload = obj;

          resolve(resultInfo);

        } else {
          // Error
          let errorMessage = obj.error.message;
          let errorCode = obj.error.code;

          resultInfo.isSuccessful = false;
          resultInfo.errorCode = errorCode;
          resultInfo.errorMessage = errorMessage;

          reject(resultInfo);
        }

      }
    });

  })
};
