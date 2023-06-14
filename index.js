const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql')

const app = express()
const port = 3000

const dbConfig = {
  host: "35.192.214.39",
  port: "3306",
  user: "root",
  password: "mypassword",
  database: "iotData"

}//body-parser is a commonly used middleware in Express, which is used to parse the data(body) of incoming requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.post('/data', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  // type of the Post res is String, they have to convert to the number format
  const soilValue = parseFloat(req.body.soilMoisture)
  const soilPercentage = parseFloat(req.body.soilMoisturePercentage)

  console.log('got data:', soilValue, soilPercentage)

  const db = mysql.createConnection(dbConfig)
  console.log("connecting to database...")
  db.connect((err) => {
    if (err) {
      console.log(err.message)
      res.sendStatus(500)
      return
    }
    console.log("connected to database")

    const query = `INSERT INTO soilData (soil_moisture, moisture_percentage) VALUES (?, ?)`
    // Data inserted into MySQL
    db.query(query, [soilValue, soilPercentage], (err, results) => {
      if (err) {
        console.log(err.message)
        res.sendStatus(500)
      } else {
        console.log('Data inserted into MySQL')
        res.sendStatus(200)
      }
      // Close the database connection
      db.end((err) => {
        if (err) {
          console.log(err.message)
        } else {
          console.log('Database connection closed.')
        }
      })
    })
  })
})
// This route only accepts POST requests
// This func is unnecessary just want to know the POST func is working
app.get('/data', (req, res) => {
  res.send('This route only accepts POST requests')
})

app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})
