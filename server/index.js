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

  let bigCircle = turf.circle([long,lat],0.5, {steps:10,units: 'miles'});

  let meters = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/data/parking_meters.geojson"), "utf8"));
  let metersInCircle = {
    type: "FeatureCollection",
    features: []
  };
  //get all meters within 0.5 mile radius of the clicked point
  meters.features.forEach(meter => {
    if(turf.booleanContains(bigCircle, turf.point(meter.geometry.coordinates))){
      metersInCircle.features.push(meter)
    }
  })

  //get all violations
  let violations = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/data/master_violations.geojson"), "utf-8"));
  let violationsInCircle={
    type: "FeatureCollection",
    features: []
  };


  let violationCircles={
    type: "FeatureCollection",
    features: []
  };

  
  //get all violations in the wanted area
  violations.features.forEach(violation => {
    if(turf.booleanContains(bigCircle, turf.point(violation.geometry.coordinates))){
      violationsInCircle.features.push(violation)
      violationCircles.features.push(turf.circle(turf.point(violation.geometry.coordinates),0.01,{steps:10,units:'miles'}))
    }
  })

  console.log(`Meters: ${metersInCircle.features.length}, Violations: ${violationCircles.features.length}`)

  var final_meters = {
    type: "FeatureCollection",
    features: []
  }

  metersInCircle.features.forEach(meter => {
    var collides = []
    violationCircles.features.forEach(circle => {
      collides.push(turf.booleanContains(circle, meter))
    })
    if (!collides.includes(true)) {
      final_meters.features.push(meter)
    }
  })
  

  res.json({"number": final_meters})
  
})

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

//curl --data "lat=38.907192&long=-77.036873" -X POST "http://localhost:4001/api/mapClick"
