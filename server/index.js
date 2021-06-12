const express = require("express");
const turf = require("@turf/turf");
const fs = require("fs-extra");
const path = require("path");

const PORT = process.env.PORT || 4001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post("/api/mapClick", (req, res) => {
  let { lat, long } = req.body;
  let tracts = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/data/tracts_income.geojson"), "utf8"));
  let tract = tracts.features.filter(tract => {
    let polygon = turf.polygon(tract.geometry.coordinates)
    let point = turf.point([long, lat])
    return turf.booleanContains(polygon, point)
  })

  let meters = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/data/parking_meters.geojson"), "utf8"));
  // res.json({name: tract[0]})
  let metersintracts=meters.features.filter(meter => {return meter.properties["TRACT"] == tract[0].properties["NAME"]})
  // meters.features.forEach(meter => {
  //   if (meter.properties["TRACT"] == tract[0].properties["NAME"]){
  //     metersintracts.push(meter)
  //   }
  // })
  
  res.json(metersintracts)
  let violations = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/data/meter_violations.geojson"), "utf-8"));
  let violationsintracts=[]
  for (violation in violations){
    if(turf.booleanContains(turf.polygon(tract.geometry.coordinates), violation.geometry.coordinates)){
      violationsintracts.push(violation)
    }
  }
})

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

//curl --data "lat=38.907192&long=-77.036873" -X POST "http://localhost:4001/api/mapClick"