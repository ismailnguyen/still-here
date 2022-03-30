if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    dotenv.config();
}

module.exports = {
    DAYS_INTERVAL_BETWEEN_NOTIFICATIONS: process.env.DAYS_INTERVAL_BETWEEN_NOTIFICATIONS || 90,
    MAX_RETRY: process.env.MAX_RETRY || 3,
    DAYS_INTERVAL_BETWEEN_RETRY: process.env.DAYS_INTERVAL_BETWEEN_RETRY || 1,

    EXPEDITOR_EMAIL: process.env.EXPEDITOR_EMAIL,
    EXPEDITOR_PASSWORD: process.env.EXPEDITOR_PASSWORD,
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    SMTP_PORT: process.env.SMTP_PORT || 587,
    NOTIFY_EMAIL_SUBJECT: process.env.EMAIL_SUBJECT || '[still-here] Are you still alive ?',
    FINAL_RECIPIENT_RECIPIENT_EMAIL: process.env.FINAL_RECIPIENT_RECIPIENT_EMAIL,
    FINAL_RECIPIENT_EMAIL_SUBJECT: process.env.FINAL_RECIPIENT_EMAIL_SUBJECT,
    FINAL_RECIPIENT_EMAIL_HTML_BODY: process.env.FINAL_RECIPIENT_EMAIL_HTML_BODY,

    PORT: process.env.PORT,
    BASE_URL: process.env.BASE_URL
}
