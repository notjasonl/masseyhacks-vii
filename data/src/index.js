const axios = require("axios")
const fs = require("fs-extra")
const path = require("path")
const turf = require("turf")

const meter_url = "https://opendata.arcgis.com/datasets/53b94fc3cfd94506a7eb82d9796fbbc1_76.geojson"
const march_violations_url = "https://opendata.arcgis.com/datasets/be2e2b7f6c5f4d4aae67549dd58beb09_2.geojson"
const april_violations_url = "https://opendata.arcgis.com/datasets/3d39532ac4a244d99912ac9b4440c11b_3.geojson"

const output_path = path.join(__dirname, "../data")

axios.get(meter_url).then((res) => {
    fs.writeFileSync(path.join(output_path, "parking_meters.geojson"), JSON.stringify(res))
    return axios.get(march_violations_url)
}).then((res) => {
    fs.writeFileSync(path.join(__dirname, "march_violations.geojson"), JSON.stringify(res))
    return axios.get(april_violations_url)
}).then((res) => {
    fs.writeFileSync(path.join(__dirname, "april_violations.geojson"), JSON.stringify(res))
})