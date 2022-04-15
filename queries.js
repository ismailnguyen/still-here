const {
  DATABASE_URL,
  DB_SSL_MODE,
  DB_SSL_REJECT_UNAUTHORIZED
} = require('./config')
const Pool = require('pg').Pool
const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
        sslmode: DB_SSL_MODE,
        rejectUnauthorized: DB_SSL_REJECT_UNAUTHORIZED
      }
})

exports.readDatas = function ({email, token}, success, failure) {
  if (!email || !token) {
    return
  }
  
  pool.query(
        'SELECT * FROM still_here WHERE user_email = $1 AND token = $2 FETCH FIRST 1 ROW ONLY',
        [email, token],
        (error, results) => {
            if (error) {
              console.error(error)
              failure(error.message)
              return
            }

            success(results.rows.map(r =>
              ({
                  lastAcknowledgementDate: r.last_acknowledgement_date,
                  nbRetry: r.nb_retry,
                  lastNotifiedDate: r.last_notified_date,
                  user: r.user_email
              }))[0])
        }
    )
}

 exports.writeDatas = function (data, success, failure) {
    const { user: { email, token }, lastAcknowledgementDate, nbRetry, lastNotifiedDate } = data
    
    if (!email || !token) {
      return
    }

    pool.query(
        'UPDATE still_here SET last_acknowledgement_date = $1, nb_retry = $2, last_notified_date = $3 WHERE user_email = $4 AND token = $5',
        [lastAcknowledgementDate, nbRetry, lastNotifiedDate, email, token],
        (error, results) => {
          if (error) {
            console.error(error)
            failure(error)
            return
          }
          success()
        }
      )
}
