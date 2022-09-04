const {
    DAYS_INTERVAL_BETWEEN_NOTIFICATIONS,
    MAX_RETRY,
    DAYS_INTERVAL_BETWEEN_RETRY
} = require('./config')
const { writeDatas, readDatas } = require('./queries')
const { sendEmail } = require('./email')
const { inform } = require('./inCaseOfDeath')

function daysDifference(lowerDate, upperDate) {
    return Math.round((upperDate.getTime() - lowerDate.getTime()) / (1000 * 3600 * 24))
}

function isLastAcknowledgeDateTooRecent (lastAcknowledgementDate) {
    const now = new Date()

    return daysDifference(lastAcknowledgementDate, now) <= parseInt(DAYS_INTERVAL_BETWEEN_NOTIFICATIONS)
}

function isAlreadyNotifiedRecently (lastNotifiedDate) {
    const now = new Date()

    return daysDifference(lastNotifiedDate, now) <= parseInt(DAYS_INTERVAL_BETWEEN_RETRY)
}

function isMaxRetryReached (nbRetry) {
    return nbRetry == parseInt(MAX_RETRY)
}

function isMaxRetryNotReached (nbRetry) {
    return nbRetry < parseInt(MAX_RETRY)
}

function isMaxRetryExceeded (nbRetry) {
    return nbRetry > parseInt(MAX_RETRY)
}

async function isAcknowledgementExpired (data) {
    const lastAcknowledgementDate = new Date(data.lastAcknowledgementDate)
    const lastNotifiedDate = new Date(data.lastNotifiedDate)
    const now = new Date()

    // We resend an acknowledgement link by email only if the interval since the previous
    // acknowledgement exceeded DAYS_INTERVAL_BETWEEN_NOTIFICATIONS days
    if (isLastAcknowledgeDateTooRecent(lastAcknowledgementDate)) {
        return {
            result: false,
            message: 'Acknowledgement date is too recent, please use /check'
        }
    }

    // If last notification was sent too recently, less than DAYS_INTERVAL_BETWEEN_RETRY day(s) ago, we wait
    if (isAlreadyNotifiedRecently(lastNotifiedDate)) {
        return {
            result: false,
            message: 'Already notified recently, please use /check'
        }
    }

    // If last acknowledgment date is before the last notification date, we can send notification
    if (daysDifference(lastAcknowledgementDate, lastNotifiedDate) <= 0) {
        /*
        * From here there are two cases:
        * - max retry reached => notify secondary recipient that the primary recipient is inactive
        * - max retry not reached => retry notification to primary recipient
        */

        // Use 0 as default value if this value wasn't initialized yet
        data.nbRetry = data.nbRetry || 0

        // If max retry is reached it means that the primary recipient was already inactive
        // Final destination was already done
        if (isMaxRetryExceeded(data.nbRetry)) {
            return {
                result: false,
                message: 'Too many retries, candidate is dead!'
            } 
        }

        // Otherwise we proceed to inform the secondary recipient about inactivity of primary recipient
        if (isMaxRetryReached(data.nbRetry)) {
            throw 'Exceptional failure: primary recipient inactif, will inform secondary recipient'
        }

        // Max retry not reached
        // Happy path: Acknowledgement date expired, notify primary recipient
        if (isMaxRetryNotReached(data.nbRetry)) {
            return {
                result: true
            }
        }
    }
}

async function updateLastNotifiedDate (data) {
    data.lastNotifiedDate = new Date().toISOString()
    
    // If max retry not reached, increment the retried counter
    data.nbRetry++

    try {
        await writeDatas(data)

        return 'Recipient notified!'
    }
    catch (error) {
        throw 'Notification failure!'
    }
}

exports.check = async function (user, token) {
    if (!user || !token) {
        return 'Please provide a valid user'
    }

    try {
        const data = await readDatas(user, token)

        let nextNotificationDate = new Date(data.lastNotifiedDate)
        nextNotificationDate.setDate(nextNotificationDate.getDate() + parseInt(DAYS_INTERVAL_BETWEEN_NOTIFICATIONS))

        let nextLastCallDate = new Date(nextNotificationDate.valueOf())
        nextLastCallDate.setDate(nextLastCallDate.getDate() + parseInt(MAX_RETRY) * parseInt(DAYS_INTERVAL_BETWEEN_RETRY))

        return {
            lastAcknowledgementDate: (new Date(data.lastAcknowledgementDate)).toDateString(),
            nbRetry: data.nbRetry,
            lastNotifiedDate: (new Date(data.lastNotifiedDate)).toDateString(),
            nextNotificationDate: nextNotificationDate.toDateString(),
            nextLastCallDate: nextLastCallDate.toDateString()
        }
    }
    catch (error) {
        return error
    }
}

exports.notify = async function (user, token) {
    if (!user || !token) {
        return 'Please provide a valid user'
    }

    try {
        // First check that the last acknowledgement date is older than the days interval
        // Otherwise, we don't send the email
        const data = await readDatas( user, token)

        const acknowledgementExpired = isAcknowledgementExpired(data)
        // If the last acknowledgement date is older than the days interval, we send the email
        if (acknowledgementExpired && acknowledgementExpired.result) {
            const mailSendResult = await sendEmail(user, token)
            console.log(mailSendResult)

            // If the mail was correctly sent, we update the last notified date
            try {
                await updateLastNotifiedDate(data)
                
                return 'Email sent to ' + user + '! '
            } catch (error) {
                return error
            }
        } else if (acknowledgementExpired && acknowledgementExpired.message) {
            return acknowledgementExpired.message
        }
    }
    catch (destinationFinal) {
        return inform()
    }
}

exports.acknowledge = async function (user, token) {
    if (!user || !token) {
        return 'Please provide a valid user'
    }

    try {
        let data = await readDatas(user, token)
        data.lastAcknowledgementDate = new Date().toISOString()
        data.nbRetry = 0 // Reset the counter of nbRetry when user acknowledges

        try {
            await writeDatas(data)

            return 'Acknowledged!'
        }
        catch (error) {
            return error
        }
    }
    catch (error) {
        return error
    }
}
