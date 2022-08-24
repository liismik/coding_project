require('dotenv').config()
const express = require('express')
const cors = require("cors")
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const routesUrls = require('./routes/user')

dotenv.config()

mongoose.connect(process.env.DATABASE_ACCESS, () => console.log('Database connected'))

app.use(express.json())
app.use(cors())
app.use('/app', routesUrls)

app.listen(5000, () => { console.log("Server started on port 5000") })