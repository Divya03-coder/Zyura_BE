
import "dotenv/config";
export const checkoutConfig = {
  baseUrl: process.env.AFS_GATEWAY_URL!,
  apiVersion: process.env.MASTERCARD_API_VERSION || "100",

  merchantId: process.env.AFS_MERCHANT_ID!,
  merchantPassword: process.env.AFS_API_PASSWORD!, // ✅ FIX

  merchantName: process.env.MERCHANT_NAME || "My Store",
  merchantUrl: process.env.MERCHANT_URL as string,

  returnUrl:
    process.env.CHECKOUT_RETURN_URL as string,
};

// 🔐 Basic Auth
export const getAuthHeader = () => {
  const credentials = `merchant.${checkoutConfig.merchantId}:${checkoutConfig.merchantPassword}`;
  return `Basic ${Buffer.from(credentials).toString("base64")}`;
};

// 🔗 Endpoint builder
export const getApiEndpoint = (path: string) => {
  return `${checkoutConfig.baseUrl}/api/rest/version/${checkoutConfig.apiVersion}/merchant/${checkoutConfig.merchantId}${path}`;
};
