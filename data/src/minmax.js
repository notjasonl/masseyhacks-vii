const fs = require("fs-extra")
const path = require("path")
const turf = require("@turf/turf")

let tracts = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/tracts_income.geojson"), "utf8"));

const output_path = path.join(__dirname, "../data")


let max = tracts.features[0]
let min = tracts.features[0]
tracts.features.forEach(tract => {
    if (tract.properties["NAME"] != "62.02" && tract.properties["VIOLATIONS_PER_POP"] > max.properties["VIOLATIONS_PER_POP"]) {
        max = tract
    }

    if (tract.properties["NAME"] != "62.02" && tract.properties["VIOLATIONS_PER_POP"] < max.properties["VIOLATIONS_PER_POP"]) {
        min = tract
    }
})

fs.writeFileSync(path.join(output_path, "most_violation.geojson"), JSON.stringify(max))
fs.writeFileSync(path.join(output_path, "least_violation.geojson"), JSON.stringify(min))