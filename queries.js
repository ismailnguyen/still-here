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

exports.readDatas = async function (email, token) {
  if (!email || !token) {
    return
  }
  
  try {
    const results = await pool.query(
      'SELECT * FROM still_here WHERE user_email = $1 AND token = $2',
      [email, token],
    )

    if (!results || !results.rows || !results.rows.length) {
      throw 'User not found'
    }

    return results.rows.map(r =>
      ({
          lastAcknowledgementDate: r.last_acknowledgement_date,
          nbRetry: r.nb_retry,
          lastNotifiedDate: r.last_notified_date,
          user: {
            email: r.user_email,
            token: r.token
          }
      }))[0]
  }
  catch (error) {
    throw error ? error.message : 'User not found'
  }
}

 exports.writeDatas = async function (data) {
  const { user: { email, token }, lastAcknowledgementDate, nbRetry, lastNotifiedDate } = data
    
  if (!email || !token) {
    return
  }

  try {
    await pool.query(
      'UPDATE still_here SET last_acknowledgement_date = $1, nb_retry = $2, last_notified_date = $3 WHERE user_email = $4 AND token = $5',
      [lastAcknowledgementDate, nbRetry, lastNotifiedDate, email, token]
    )
  }
  catch (error) {
    throw error
  }
}
