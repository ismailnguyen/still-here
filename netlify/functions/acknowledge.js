const { acknowledge } = require('../../controller')

/*
 * This endpoint will send a mail to the recipient to ask to acknowledge if he is still alive
*/
exports.handler = async function (event, context) {
    return {
        statusCode: 200,
        body: await acknowledge(event.queryStringParameters.by, event.queryStringParameters.token)
    }
};