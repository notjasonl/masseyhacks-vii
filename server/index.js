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
  let bigCircle = turf.circle([long,lat],20, {steps:10,units: 'miles'});

  let meters = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/data/parking_meters.geojson"), "utf8"));
  let metersInCircle = []
  meters.features.forEach(meter => {
    if(turf.booleanContains(bigCircle, turf.point(meter.geometry.coordinates))){
      metersInCircle.push(meter)
    }
  })
  // let metersintract=meters.features.filter(meter => {return meter.properties["TRACT"] == tract[0].properties["NAME"]})

  let violations = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/data/master_violations.geojson"), "utf-8"));
  let violationsInCircle=[]
  let violationCircles={
    type: "FeatureCollection",
    features: []
  };
  // violations.features.forEach(violation => {
  //   if(turf.booleanContains(turf.polygon(tract[0].geometry.coordinates), turf.point(violation.geometry.coordinates))){
  //     violationsintracts.push(violation)
  //   }
  // })
  violations.features.forEach(violation => {
    if(turf.booleanContains(bigCircle, turf.point(violation.geometry.coordinates))){
      violationsInCircle.push(violation)
      violationCircles.features.push(turf.circle(turf.point(violation.geometry.coordinates),.01,{units:'miles'}))
    }
  })

  //metersInCircle=meters.features.filter(meter => {return turf.booleanContains(violationCircles,meter.geometry.coordinates)})
  for(meter in metersInCircle){
    for(circle in violationCircles.features){
      metersInCircle=meters.features.filter(meter => {return !booleanContains(circle,meter.geometry.coordinates)})
    }
  }
    
  let masterMeters = {
    type: "FeatureCollection",
    features: metersInCircle
  }

  let masterViolations = {
    type: "FeatureCollection",
    features: violationsInCircle
  }

  res.json(metersInCircle)
  //make circle around click point
  //make circles around each violation within the click point
  //get rid of meters in the circles around each violation

  

})

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

//curl --data "lat=38.907192&long=-77.036873" -X POST "http://localhost:4001/api/mapClick"

//make a buffer around chosen coord
