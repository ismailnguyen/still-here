const {
    DAYS_INTERVAL_BETWEEN_NOTIFICATIONS,
    MAX_RETRY,
    DAYS_INTERVAL_BETWEEN_RETRY
} = require('./config')
const { writeDatas, readDatas } = require('./queries')
const { sendEmail } = require('./email')
const { inform } = require('./inCaseOfDeath')

function daysDifference(upperDate, lowerDate) {
    return Math.round((upperDate.getTime() - lowerDate.getTime()) / (1000 * 3600 * 24))
}

function checkAcknowledgementExpiration (data, success, failure, exceptionFailure) {
    const lastAcknowledgementDate = new Date(data.lastAcknowledgementDate)
    const lastNotifiedDate = new Date(data.lastNotifiedDate)
    const now = new Date()

    // We resend an acknowledgement link by email only if the interval since the previous
    // acknowledgement exceeded 90 days
    if (daysDifference(now, lastAcknowledgementDate) > DAYS_INTERVAL_BETWEEN_NOTIFICATIONS) {
        // If the last notification date was done before the last acknowledgement date, we send the email
        if (daysDifference(lastNotifiedDate, lastAcknowledgementDate) <= 0) {
            success()
        }
        // If we already notified the recipient after the acknowledgement period exceeded
        else {
            // If last notification was sent more than 1 day ago, we send again the email until reaching the max retry
            // And we update the counter of nbRetry
            if (daysDifference(now, lastNotifiedDate) > DAYS_INTERVAL_BETWEEN_RETRY) {
                data.nbRetry = data.nbRetry || 0

                if (data.nbRetry > MAX_RETRY) {
                    failure('Too many retries, candidate is dead!')
                } else {
                    data.nbRetry++

                    writeDatas(
                        data,
                        () => {
                            if (data.nbRetry < MAX_RETRY) {
                                success('Recipient notified!')
                            }
                            // Otherwise we proceed to inform the secondary recipient about inactivity of primary recipient
                            else if (data.nbRetry == MAX_RETRY) {
                                exceptionFailure()
                            }
                        },
                        (error) => failure(error)
                    )
                }
            } else {
                failure('Already notified recently, please use /check')
            }
        }
    } else {
        failure('Acknowledgement date is too recent, please use /check')
    }
}

function updateLastNotifiedDate (data, success, failure) {
    data.lastNotifiedDate = new Date().toISOString()

    writeDatas(
        data,
        () => success('Recipient notified!'),
        () => failure('Notification failure!')
    )
}

exports.check = function (request, response) {
    const user = request.query.user;

    if (!user) {
        response.send('Please provide a valid user')
        return
    }

    readDatas(
        user,
        (text) => response.send(text),
        (error) => response.send(error)
    )
}

exports.notify = function (request, response) {
    const user = request.query.user;

    if (!user) {
        response.send('Please provide a valid user')
        return
    }

    // First check that the last acknowledgement date is older than the days interval
    // Otherwise, we don't send the email
    readDatas(
        user,
        (data) => {
            checkAcknowledgementExpiration(
                data,
                // If the last acknowledgement date is older than the days interval, we send the email
                () => sendEmail(
                    (mailSendResult) => {
                        console.log(mailSendResult)

                        // If the mail was correctly sent, we update the last notified date
                        updateLastNotifiedDate(
                            data,
                            (success) => response.send(success),
                            (failure) => response.send(failure)
                        )
                    }
                ),
                (message) => response.send(message),
                () => inform(
                    data,
                    (finalMessage) => response.send(finalMessage)
                )
            )
        },
        (error) => response.send(error)
    )
}

exports.acknowledge = function (request, response) {
    const user = request.query.by;

    if (!user) {
        response.send('Please provide a valid user')
        return
    }

    readDatas(
        user,
        (data) => {
            data.lastAcknowledgementDate = new Date().toISOString()

            writeDatas(
                data,
                () => response.send('Acknowledged!'),
                (error) => response.send(error)
            )
        },
        (error) => response.send(error)
    )
}
