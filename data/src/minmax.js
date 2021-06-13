const fs = require("fs-extra")
const path = require("path")
const turf = require("@turf/turf")

let tracts = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/tracts_income.geojson"), "utf8"));

const output_path = path.join(__dirname, "../data")


let max = tracts.features[0]
let min = tracts.features[0]
tracts.features.forEach(tract => {
    if (tract.properties["DP03_0062E"] > max.properties["DP03_0062E"]) {
        max = tract
    }

    if (tract.properties["DP03_0062E"] < max.properties["DP03_0062E"]) {
        min = tract
    }
})

fs.writeFileSync(path.join(output_path, "wealthiest_tract.geojson"), JSON.stringify(max))
fs.writeFileSync(path.join(output_path, "not_wealthiest_tract.geojson"), JSON.stringify(min))