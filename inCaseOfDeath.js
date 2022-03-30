const nodemailer = require('nodemailer')

const {
    EXPEDITOR_EMAIL,
    EXPEDITOR_PASSWORD,
    SMTP_HOST,
    SMTP_PORT,
    FINAL_RECIPIENT_RECIPIENT_EMAIL,
    FINAL_RECIPIENT_EMAIL_SUBJECT,
    FINAL_RECIPIENT_EMAIL_HTML_BODY
} = require('./config')

function sendEmail (success) {
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
        to: FINAL_RECIPIENT_RECIPIENT_EMAIL,
        subject: FINAL_RECIPIENT_EMAIL_SUBJECT,
        html: FINAL_RECIPIENT_EMAIL_HTML_BODY
    }).then(result => success(result))
    .catch((error) => console.error(error))
}

exports.inform = function (data, finalMessage) { 
    console.log("see you good by (:)")

    sendEmail((mailSendResult) => finalMessage(mailSendResult))
}
