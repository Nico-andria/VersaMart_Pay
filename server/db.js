const mongoose = require("mongoose")
require("dotenv").config();

const mongoUri = process.env.MONGO_URL;

mongoose.connect(mongoUri, {useUnifiedTopology : true , UseNewUrlParser: true} )

var connection = mongoose.connection

connection.on('error', () => {
    console.log("MongoDB connection failed")
})
connection.on('connected', () => {
    console.log("MongoDB connection successfull")
})

module.exports = mongoose