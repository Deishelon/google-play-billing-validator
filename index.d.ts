export interface Options {
  email: string;
  key: string;
}

export interface Receipt {
  packageName: string;
  productId: string;
  purchaseToken: string;
}

export interface SubscriptionReceipt extends Receipt {
  developerPayload: any;
}

export interface Response {
  isSuccessful: boolean;
  errorMessage: any;
  payload: any;
}

export interface VerificationResponse {
  isSuccessful: boolean;
  errorMessage: null | string;
  payload: InAppPurchasePayloadResponse;
}

export interface InAppPurchasePayloadResponse {
  kind: "androidpublisher#productPurchase";
  purchaseTimeMillis: number;
  acknowledgementState: number;
  purchaseState: number;
  consumptionState: number;
  developerPayload: number;
  orderId: string;
  purchaseType: number;
}

export interface IVerifier {
  verifyINAPP(receipt: Receipt): Promise<any>;
  verifySub(receipt: Receipt): Promise<any>;
}
declare const Verifier: {
  new (options: Options): IVerifier;
};

export default Verifier;
