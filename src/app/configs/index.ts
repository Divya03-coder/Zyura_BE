import "dotenv/config";

export const configs = {
    port: process.env.PORT,
    env: process.env.NODE_ENV,
    jwt: {
        access_token: process.env.ACCESS_TOKEN,
        refresh_token: process.env.REFRESH_TOKEN,
        access_expires: process.env.ACCESS_EXPIRES,
        refresh_expires: process.env.REFRESH_EXPIRES, 
        reset_secret: process.env.RESET_SECRET,
        reset_expires: process.env.RESET_EXPIRES,
        front_end_url: process.env.FRONT_END_URL,
        verified_token: process.env.VERIFIED_TOKEN

    },
    db_url: process.env.DB_URL,
    email: {
        app_email: process.env.APP_USER,
        app_password: process.env.APP_PASSWORD,
        sg_api_key: process.env.SENDGRID_API_KEY
    },
    cloudinary: {
        cloud_name: process.env.CLOUD_NAME,
        cloud_api_key: process.env.CLOUD_API_KEY,
        cloud_api_secret: process.env.CLOUD_API_SECRET
    },
    admin: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD
    },
    aws: {
        access_key_id: process.env.AWS_ACCESS_KEY_ID,
        secret_access_key: process.env.AWS_ACCESS_KEY_SECRET,
        region: process.env.AWS_REGION_NAME,
        bucket: process.env.AWS_BUCKET_NAME
    },
    ai_api: process.env.AI_API,
    gateway: {
        afs: {
            afs_gateway_url: process.env.AFS_GATEWAY_URL,
            afs_merchant_id: process.env.AFS_MERCHANT_ID,
            afs_api_password: process.env.AFS_API_PASSWORD,
            afs_merchant_name: process.env.MERCHANT_NAME
        },
        frontend_config: {
            mastercard_url: process.env.MASTERCARD_GATEWAY_URL,
            mastercard_merchant_id: process.env.MASTERCARD_MERCHANT_ID,
            mastercard_api_password: process.env.MASTERCARD_API_PASSWORD,
            mastercard_api_version: process.env.MASTERCARD_API_VERSION,
        },
        merchant: {
            merchant_id: process.env.MERCHANT_ID,
            merchant_password: process.env.MERCHANT_PASSWORD,
            merchant_name: process.env.MERCHANT_NAME,
            merchant_url: process.env.MERCHANT_URL,
            default_currency: process.env.DEFAULT_CURRENCY,
            checkout_return_url: process.env.CHECKOUT_RETURN_URL,
            redirect_merchant_url: process.env.REDIRECT_MERCHANT_URL,
            retry_attempt_count: process.env.RETRY_ATTEMPT_COUNT
        }
    },
    mailgun: {
        smtp_host: process.env.SMTP_HOST,
        smtp_port: process.env.SMTP_PORT,
        smtp_user: process.env.SMTP_USER,
        smtp_pass: process.env.SMTP_PASSWORD,
        from: process.env.SMTP_FROM
    }
}