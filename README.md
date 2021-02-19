# Node.js Google Play Validator (In-app purchases and Subscriptions)

Or How to check if in-app purchase/subscription is valid?

## Tutorial

In-depth tutorial on medium: [How to check if in-app purchase / subscription is valid?](https://medium.com/androidhub/how-to-validate-in-app-purchase-subscription-on-your-node-js-backend-a2b823470034)

## Install

Install using npm

```javascript
npm i google-play-billing-validator
```

## Usage (Set-up)

1.  Go to [Developer Console](https://play.google.com/apps/publish/ "Developer Console")
2.  Settings (in the left side menu)
3.  Select API access
4.  Link your Google Cloud Project to your developer account (If you have not created one yet, go to [Google API Console](https://console.developers.google.com/iam-admin/projects "API Console") and create one then come back here and link it )
5.  In Google API Console, in the left side menu click on service account
6.  Then create a service account (Don't forget to save private key)
7.  Go back to Developer Console, and grand asses to the newly created account (the permission has to be **View financial data**)
8.  All done

## Usage

-   Get Verifier

```javascript
var Verifier = require('google-play-billing-validator');
```

-   Add your private key and service account email

```javascript
var options = {
  "email": 'INSERT SERVICE ACCOUNT EMAIL HERE',
  "key": "INSERT YOUR PRIVATE KEY HERE",
};
```

-   Create verifier object

```javascript
var verifier = new Verifier(options);
```

#### \*Somewhere in your code, where you need to validate purchase or subscription\*\*

##### Create a receipt object

```javascript
let receipt = {
  packageName: "your app package name",
  productId: "sku / subscription id",
  purchaseToken: "purchase token"
};
```

##### Validate In-app purchase

```javascript
let promiseData = verifier.verifyINAPP(receipt)

promiseData.then(function(response) {
  // Yay! Purchase is valid
  // See response structure below
})
.then(function(response) {
  // Here for example you can chain your work if purchase is valid
  // eg. add coins to the user profile, etc
  // If you are new to promises API
  // Awesome docs: https://developers.google.com/web/fundamentals/primers/promises
})
.catch(function(error) {
  // Purchase is not valid or API error
  // See possible error messages below
})
```

##### Validate Subscription

```javascript
let promiseData = verifier.verifySub(receipt)

promiseData.then(function(response) {
  // Yay! Subscription is valid
  // See response structure below
})
.then(function(response) {
  // Here for example you can chain your work if subscription is valid
  // eg. add coins to the user profile, etc
  // If you are new to promises API
  // Awesome docs: https://developers.google.com/web/fundamentals/primers/promises
})
.catch(function(error) {
  // Subscription is not valid or API error
  // See possible error messages below
})
```

##### Acknowledge Purchase / Subscription
To acknowledge a purchase or a subscription, simple add `developerPayload: <String>` to the `receipt` object
eg:
```javascript
let receipt = {
  packageName: "<packageName>",
  productId: "<productId>",
  purchaseToken: "<purchaseToken>",
  developerPayload: "YOUR PAYLOAD"
};

```

If successful, the result will be
```javascript
{
   isSuccessful:true,
   errorMessage:null,
   payload:{
      code:204,
      message:'Acknowledged Purchase Successfully'
   }
}
```

##### Successful Response (In-app)
[
Purchases.products @ Google Documentation](https://developers.google.com/android-publisher/api-ref/purchases/products#resource)

```javascript
{
	"isSuccessful": boolean ,
	"errorMessage": null / string,
	"payload": {
		"kind": "androidpublisher#productPurchase",
		"purchaseTimeMillis": long,
		"purchaseState": integer,
		"consumptionState": integer,
		"developerPayload": string,
		"orderId": string,
		"purchaseType": integer
	}
}
```

##### Successful Response (Subscription)
[Purchases.subscriptions @ Google Documentation](https://developers.google.com/android-publisher/api-ref/purchases/subscriptions#resource)

```javascript
{
  "isSuccessful": boolean ,
	"errorMessage": null / string,
	"payload": {
		{
			"kind": "androidpublisher#subscriptionPurchase",
			"startTimeMillis": long,
			"expiryTimeMillis": long,
			"autoRenewing": boolean,
			"priceCurrencyCode": string,
			"priceAmountMicros": long,
			"countryCode": string,
			"developerPayload": string,
			"paymentState": integer,
			"cancelReason": integer,
			"userCancellationTimeMillis": long,
			"cancelSurveyResult": {
				"cancelSurveyReason": integer,
				"userInputCancelReason": string
			},
			"orderId": string,
			"linkedPurchaseToken": string,
			"purchaseType": integer,
			"profileName": string,
			"emailAddress": string,
			"givenName": string,
			"familyName": string,
			"profileId": string
		}
	}
}
```

##### Failed Response

```javascript
{
  "isSuccessful": false,
  "errorMessage": "The purchase token does not match the product ID."
}
```

    "Wrong productId (sku)" -> "The purchase token does not match the product ID."
    "Wrong purchase token" -> "The purchase token was not found."
    "Wrong package name" -> "No application was found for the given package name."

    "Wrong service email" -> "Not a valid email or user ID."
    "Wrong key" -> "Invalid JWT Signature."
    "Wrong service account permissions" -> "The current user has insufficient permissions to perform the requested operation."

## Migration from v1 to v2

v1 was a callback based, where v2 is fully promise based.
If you are unfamiliar with promises, read [this](https://developers.google.com/web/fundamentals/primers/promises)

The migration is very simple:
1. Remove the callback parameter to `verifyINAPP()` and/or `verifySub()` functions
2. Get result in a `promise`
3. See example usage (above)

### Links

[GitHub](https://github.com/Deishelon/google-play-billing-validator "GitHub")  
[npmjs](https://www.npmjs.com/package/google-play-billing-validator "npmjs")


### Changelog

##### 2.1.3
- Allow default import syntax from TypeScript
Thanks [@unpollito](https://github.com/unpollito)

##### 2.1.1
- Fixed and improved type script support  
Thanks [@YogiBear52](https://github.com/YogiBear52)

##### 2.1.0
- Added TypeScript support
