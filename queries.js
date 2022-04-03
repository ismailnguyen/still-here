const {
  DB_HOST,
  DB_USER,
  DB_PWD,
  DB_NAME,
  DB_PORT,
  DB_SSL_MODE,
  DB_SSL_REJECT_UNAUTHORIZED
} = require('./config')
const Pool = require('pg').Pool
const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PWD,
    port: DB_PORT,
    ssl: {
        sslmode: DB_SSL_MODE,
        rejectUnauthorized: DB_SSL_REJECT_UNAUTHORIZED
      }
})

exports.readDatas = function (user, success, failure) {
    pool.query(
        'SELECT * FROM still_here WHERE user_email = $1 FETCH FIRST 1 ROW ONLY',
        [user],
        (error, results) => {
            if (error) {
                console.error(error)
            failure(error)
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
    const { user, lastAcknowledgementDate, nbRetry, lastNotifiedDate } = data
    
    if (!user) {
      return
    }

    pool.query(
        'UPDATE still_here SET last_acknowledgement_date = $1, nb_retry = $2, last_notified_date = $3 WHERE user_email = $4',
        [lastAcknowledgementDate, nbRetry, lastNotifiedDate, user],
        (error, results) => {
          if (error) {
            console.error(error)
            failure(error)
          }
          success()
        }
      )
}
