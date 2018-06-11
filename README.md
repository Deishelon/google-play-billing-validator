# Node.js Google Play Validator (In-app purchases and Subscriptions)

Npm module for Node.js to validate In-app purchases and Subscriptions on your backend

## Install

Install using npm
```javascript
npm i google-play-billing-validator
```

## Usage (Set-up)

1. Go to [Developer Console](https://play.google.com/apps/publish/ "Developer Console")
1. Settings (in the left side menu)
1. Select API access
1. Link your Google Cloud Project to your developer account (If you have not created one yet, go to [Google API Console](https://console.developers.google.com/iam-admin/projects "API Console") and create one then come back here and link it )
1. In Google API Console, in the left side menu click on service account
1. Then create a service account (Don't forget to save private key)
1. Go back to Developer Console, and grand asses to the newly created account (the permission has to be **View financial data**)
1. All done

## Usage

- Get Verifier
```javascript
var Verifier = require('google-play-billing-validator');
```
-  Add your private key and service account email
```javascript
var options = {
  email: 'INSERT SERVICE ACCOUNT EMAIL HERE',
	"key": "INSERT YOUR PRIVATE KEY HERE",
};
```
-  Create verifier object
```javascript
var verifier = new Verifier(options);
```

####  *Somewhere in your code, where you need to validate purchase or subscription**

##### Create a receipt object

```javascript
	var receipt = {
  	packageName: "YOUR APP PKG",
  	productId: "sku / subscribtion id",
  	purchaseToken: "token"
	};
```
##### Validate In-app purchase

```javascript
verifier.verifyINAPP(receipt, function cb(err, response) {
  if (err) {
    console.log("there was an error validating the receipt");
    //console.log(err);
  }else {
  	console.log("sucessfully validated the receipt");
  }
});
```

##### Validate Subscribtion

```javascript
verifier.verifySub(receipt, function cb(err, response) {
  if (err) {
    console.log("there was an error validating the receipt");
    //console.log(err);
  }else {
  	console.log("sucessfully validated the receipt");
	// More Subscribtion info avalible in response variable
	// Response schema is:
	  /*
		{
  			"kind": "androidpublisher#subscriptionPurchase",
  			"startTimeMillis": "long",
  			"expiryTimeMillis": "long",
  			"autoRenewing": boolean
		}
  	*/
  }
});
```

### Links
[GitHub](https://github.com/Deishelon/google-play-billing-validator "GitHub")
[npmjs](https://www.npmjs.com/package/google-play-billing-validator "npmjs")


### Credits
[google-play-purchase-validator](https://www.npmjs.com/package/google-play-purchase-validator "google-play-purchase-validator") - Forked from here, at the moment of writing supported only Subscriptions, used old v2 google API schema. Moved to v3, Added In-App purchases
