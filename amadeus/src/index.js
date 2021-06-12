const axios = require("axios")
var Amadeus = require("amadeus")
const express = require("express")
const socket = require("socket.io")
// const bodyParser = require("body-parser")
const { AMADEUS_KEY, AMADEUS_SECRET } = require("./config")

const PORT = process.env.PORT || 3001

const app = express()

// app.use(express.urlencoded())
app.use(express.json())

app.use(express.urlencoded({extended: true}));


var amadeus = new Amadeus({
    clientId: AMADEUS_KEY,
    clientSecret: AMADEUS_SECRET
})

app.post("/date", async function (req, res) {
    console.log(req.body)
    let departure = req.body.departure
    let arrival = req.body.arrival
    let locDep = req.body.locationDeparture
    let locArr = req.body.locationArrival
    let adults = req.body.adults

    // const flights = await amadeus.shopping.flightOffersSearch.get({
    //     originLocationCode: locDep,
    //     destinationLocationCode: locArr,
    //     departureDate: departure,
    //     adults: adults
    // }).catch((err) => {
    //     console.log(err)
    // })

    // try {
    //     res.json(JSON.parse(flights.body))
    // } catch (err) {
    //     await res.json(err)
    // }

    try {
        res.json({ message: "hi" })
    } catch (err) {
        await res.json(err)
    }
})

app.post("/price", async function (req, res) {
    res.json(req.query)
    console.log(req.query)

})


var server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

let io = socket(server)

io.on("connection", function (socket) {
  console.log("Socket Connection Established with ID :" + socket.id)
})