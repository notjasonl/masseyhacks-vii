const fs = require("fs-extra")
const path = require("path")
const turf = require("@turf/turf")

let violations = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/master_violations.geojson"), "utf-8"));

let meters = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/parking_meters.geojson"), "utf8"));

const output_path = path.join(__dirname, "../data")

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
    violationsInCircle.features.push(violation)
    violationCircles.features.push(turf.circle(turf.point(violation.geometry.coordinates),0.01,{steps:10,units:'miles'}))
})

var final_meters = {
    type: "FeatureCollection",
    features: []
}

meters.features.forEach(meter => {
    var collides = []
    violationCircles.features.forEach(circle => {
        collides.push(turf.booleanContains(circle, meter))
    })
    if (!collides.includes(true)) {
        final_meters.features.push(meter)
    }
})

fs.writeFileSync(path.join(output_path, "safe_meters.geojson"), JSON.stringify(final_meters))
fs.writeFileSync(path.join(output_path, "violation_circles.geojson"), JSON.stringify(violationCircles))
