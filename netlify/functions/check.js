const { check } = require('../../controller')

/*
 * Endpoint just to display the data
*/
exports.handler = async function (event, context) {
    return {
        statusCode: 200,
        body: await check(event.queryStringParameters.user, event.queryStringParameters.token)
    }
};