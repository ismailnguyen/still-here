const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const { 
  check,
  notify,
  acknowledge
} = require('./controller')
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
app.get('/check', (request, response) => {
  const result = check(request.query.user, request.query.token);

  response.status(200).json(result);
})

/*
 * This endpoint will send a mail to the recipient to ask to acknowledge if he is still alive
*/
app.get('/notify', (request, response) => {
  const result = notify(request.query.user, request.query.token);

  response.status(200).send(result);
})

/*
 * If the recipient acknowledges he is still alive, we update the lastAcknowledgementDate
*/
app.get('/acknowledge', (request, response) => {
  const result = acknowledge(request.query.by, request.query.token);

  response.status(200).send(result);
})

app.listen(PORT, () => {
  console.log(`App now running on port ${PORT}`)
})
