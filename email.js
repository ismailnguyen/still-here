const nodemailer = require('nodemailer')

const {
    BASE_URL,
    EXPEDITOR_EMAIL,
    EXPEDITOR_PASSWORD,
    SMTP_HOST,
    SMTP_PORT,
    NOTIFY_EMAIL_SUBJECT
} = require('./config')

exports.sendEmail = async function (email, token) {
    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        auth: {
            user: EXPEDITOR_EMAIL,
            pass: EXPEDITOR_PASSWORD
        }
    })

    try {
        return await transporter.sendMail({
            from: EXPEDITOR_EMAIL,
            to: email,
            subject: NOTIFY_EMAIL_SUBJECT,
            html: `<a href="${ BASE_URL }/acknowledge?by=${ email }&token=${ token }" target="_blank" rel="noopener">Click here to acknowledge</a>`
        })
    }
    catch (error) {
        throw error
    }
}
