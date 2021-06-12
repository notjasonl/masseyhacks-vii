const axios = require("axios")
var Amadeus = require("amadeus")
const express = require("express")
const socket = require("socket.io")
const { AMADEUS_KEY, AMADEUS_SECRET, TSA_KEY } = require("./config")

const PORT = process.env.PORT || 3001

const app = express()

const tsa_base = `https://www.tsawaittimes.com/api/`

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

    const flights = await amadeus.shopping.flightOffersSearch.get({
        originLocationCode: locDep,
        destinationLocationCode: locArr,
        departureDate: departure,
        adults: adults
    }).catch((err) => {
        console.log(err)
    })

    try {
        res.json(JSON.parse(flights.body))
    } catch (err) {
        await res.json(err)
    }

    try {
        res.json(flights.body)
    } catch (err) {
        await res.json(err)
    }
})

app.post("/times", async function (req, res) {
    let locDep = req.query.locationDeparture
    let departure = ""
    let time = parseInt(req.query.departure.split("T")[1].split(":")[0])
    console.log(time)

    if (time >= 12) {
        departure = `${time % 12} pm - ${(time % 12) + 1} pm`
    } else {
        departure = `${time} am - ${time + 1} am`
    }



    let x = await axios.get(`${tsa_base}/airport/${TSA_KEY}/ATL/json`)
    let delay = x.data.estimated_hourly_times.filter(slot => slot.timeslot === departure)[0]
    console.log(delay)

    try {
        res.json({waittime: delay.waittime})
    } catch (err) {
        await res.join(err)
    }

})

app.post("/delays", async function (req, res) {
    let locDep = req.query.locationDeparture
    let locArr = req.query.locationArrival
    let departure = req.query.departure
    let departureTime = req.query.departureTime
    let arrival = req.query.arrival
    let arrivalTime = req.query.arrivalTime
    let airCode = req.query.aircraftCode
    let carrCode = req.query.carrierCode
    let number = req.query.flightNumber
    let duration = req.query.duration

    const predictions = await amadeus.travel.predictions.flightDelay.get({
        originLocationCode: locDep,
        destinationLocationCode: locArr,
        departureDate: departure,
        departureTime: departureTime,
        arrivalDate: arrival,
        arrivalTime: arrivalTime,
        aircraftCode: airCode,
        carrierCode: carrCode,
        flightNumber: number,
        duration: duration
    })

    let maxPrediction = {}

    predictions.data.forEach(possible => {
        if (parseFloat(possible.probability) > parseFloat(maxPrediction.probability)) {
            maxPrediction = possible
        }
    })

    try {
        res.json(maxPrediction)
    } catch (err) {
        await res.json(err)
    }
})


var server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

let io = socket(server)

io.on("connection", function (socket) {
  console.log("Socket Connection Established with ID :" + socket.id)
})