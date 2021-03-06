const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const controller = require('./controller')
const { PORT } = require('./config');

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

/*
 * Endpoint just to display the data
*/
app.get('/check', controller.check)

/*
 * This endpoint will send a mail to the recipient to ask to acknowledge if he is still alive
*/
app.get('/notify', controller.notify)

/*
 * If the recipient acknowledges he is still alive, we update the lastAcknowledgementDate
*/
app.get('/acknowledge', controller.acknowledge)

app.listen(PORT, () => {
  console.log(`App now running on port ${PORT}`)
})
