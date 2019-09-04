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
export interface Verifier {
  new (options: Options): any;

  verifyINAPP(receipt: Receipt): Promise<any>;
  verifySub(receipt: Receipt): Promise<any>;
}
export const Verifier: {
  new (options: Options): Verifier;
};
