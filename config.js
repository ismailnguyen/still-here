if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    dotenv.config();
}

module.exports = {
    DAYS_INTERVAL_BETWEEN_NOTIFICATIONS: parseInt(process.env.DAYS_INTERVAL_BETWEEN_NOTIFICATIONS) || 90,
    MAX_RETRY: parseInt(process.env.MAX_RETRY) || 3,
    DAYS_INTERVAL_BETWEEN_RETRY: parseInt(process.env.DAYS_INTERVAL_BETWEEN_RETRY) || 1,

    DATABASE_URL: process.env.DATABASE_URL,
    DB_SSL_MODE: process.env.DB_SSL_MODE || 'require',
    DB_SSL_REJECT_UNAUTHORIZED: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true' || false,

    EXPEDITOR_EMAIL: process.env.EXPEDITOR_EMAIL,
    EXPEDITOR_PASSWORD: process.env.EXPEDITOR_PASSWORD,
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    SMTP_PORT: parseInt(process.env.SMTP_PORT) || 587,
    NOTIFY_EMAIL_SUBJECT: process.env.EMAIL_SUBJECT || '[still-here] Are you still alive ?',
    FINAL_RECIPIENT_RECIPIENT_EMAIL: process.env.FINAL_RECIPIENT_RECIPIENT_EMAIL,
    FINAL_RECIPIENT_EMAIL_SUBJECT: process.env.FINAL_RECIPIENT_EMAIL_SUBJECT,
    FINAL_RECIPIENT_EMAIL_HTML_BODY: process.env.FINAL_RECIPIENT_EMAIL_HTML_BODY,

    PORT: parseInt(process.env.PORT) || 3000,
    BASE_URL: process.env.BASE_URL
}
