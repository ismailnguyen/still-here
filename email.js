const nodemailer = require('nodemailer')

const {
    BASE_URL,
    EXPEDITOR_EMAIL,
    EXPEDITOR_PASSWORD,
    SMTP_HOST,
    SMTP_PORT,
    EMAIL_SUBJECT
} = require('./config')

exports.sendEmail = function (success) {
    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        auth: {
            user: EXPEDITOR_EMAIL,
            pass: EXPEDITOR_PASSWORD,
        }
    })

    transporter.sendMail({
        from: EXPEDITOR_EMAIL,
        to: EXPEDITOR_EMAIL,
        subject: EMAIL_SUBJECT,
        html: '<a href="' + BASE_URL + '/acknowledge?by=' + EXPEDITOR_EMAIL + '" target="_blank" rel="noopener">Click here to acknowledge</a>'
    }).then(result => success(result))
    .catch((error) => console.error(error))
}
