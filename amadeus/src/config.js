require('dotenv').config({path: __dirname + '/.env'})

module.exports = {
    AMADEUS_KEY: process.env.AMADEUS_KEY,
    AMADEUS_SECRET: process.env.AMADEUS_SECRET
}