const axios = require("axios")
const fs = require("fs-extra")
const path = require("path")
const turf = require("@turf/turf")

const meter_url = "https://opendata.arcgis.com/datasets/53b94fc3cfd94506a7eb82d9796fbbc1_76.geojson"
const march_violations_url = "https://opendata.arcgis.com/datasets/be2e2b7f6c5f4d4aae67549dd58beb09_2.geojson"
const april_violations_url = "https://opendata.arcgis.com/datasets/3d39532ac4a244d99912ac9b4440c11b_3.geojson"
const may_violations_url = "https://opendata.arcgis.com/datasets/856ceda37614463d9e404e3a97db7c13_4.geojson"
const tracts_income_url = "https://opendata.arcgis.com/datasets/a53c0f02804a484b87027ce3ef3ff38b_41.geojson"

let master = {
    type: "FeatureCollection",
    features: []
}

let meters = {
    type: "FeatureCollection",
    features: []
}

let tracts = {
    type: "FeatureCollection",
    features: []
}

const output_path = path.join(__dirname, "../data")

fs.ensureDirSync(output_path)
    
axios.get(march_violations_url).then((res) => {
    let march = {
        type: "FeatureCollection",
        features: []
    }

    res.data.features.forEach(feature => {
        if (feature.properties["LONGITUDE"] != null && feature.properties["LONGITUDE"] != null) {
            feature.geometry = {
                type: "Point",
                coordinates: [feature.properties["LONGITUDE"], feature.properties["LATITUDE"]]
            }
            march.features.push(feature)
            master.features.push(feature)
            if (["METER, FAIL TO DEPOSIT PAYMENT","ILLEGAL AT METER","NOT PARKED IN A METER SPACE","PARK AT EXPIRED METER"].includes(feature.properties["VIOLATION_PROC_DESC"])) {
                meters.features.push(feature)
            }
        }
    })

    fs.writeFileSync(path.join(output_path, "march_violations.geojson"), JSON.stringify(march))
    return axios.get(april_violations_url)
}).then((res) => {
    let april = {
        type: "FeatureCollection",
        features: []
    }

    res.data.features.forEach(feature => {
        if (feature.properties["LONGITUDE"] != null && feature.properties["LONGITUDE"] != null) {
            feature.geometry = {
                type: "Point",
                coordinates: [feature.properties["LONGITUDE"], feature.properties["LATITUDE"]]
            }
            april.features.push(feature)
            master.features.push(feature)
            if (["PARK AT EXPIRED METER","NOT PARKED IN A METER SPACE","EXPIRATION TIME ON METER RECEIPT LAPSED BE","METER ILLEGAL PARKING IN BALLPARK ZONE"].includes(feature.properties["VIOLATION_PROC_DESC"])) {
                meters.features.push(feature)
            }
        }
    })
    fs.writeFileSync(path.join(output_path, "april_violations.geojson"), JSON.stringify(april))
    return axios.get(may_violations_url)
}).then((res) => {
    let may = {
        type: "FeatureCollection",
        features: []
    }

    res.data.features.forEach(feature => {
        if (feature.properties["LONGITUDE"] != null && feature.properties["LONGITUDE"] != null) {
            feature.geometry = {
                type: "Point",
                coordinates: [feature.properties["LONGITUDE"], feature.properties["LATITUDE"]]
            }
            may.features.push(feature)
            master.features.push(feature)
            if (["PARK AT EXPIRED METER","FAIL TO DISPLAY A MULTISPACE METER RECEIPT","METER ILLEGAL PARKING IN BALLPARK ZONE"].includes(feature.properties["VIOLATION_PROC_DESC"])) {
                meters.features.push(feature)
            }
        }
    })
    fs.writeFileSync(path.join(output_path, "may_violations.geojson"), JSON.stringify(may))
    fs.writeFileSync(path.join(output_path, "master_violations.geojson"), JSON.stringify(master))
    fs.writeFileSync(path.join(output_path, "meter_violations.geojson"), JSON.stringify(meters))
    return axios.get(tracts_income_url)
}).then((res) => {
    tracts = res.data
    fs.writeFileSync(path.join(output_path, "tracts_income.geojson"), JSON.stringify(res.data))
    return axios.get(meter_url)
}).then((res) => {
    let match = {}
    res.data.features.forEach(meter => {
        var meter_point = turf.point(meter.geometry.coordinates)
        tracts.features.forEach(tract => {
            let polygon = turf.polygon(tract.geometry.coordinates)
            if (turf.booleanContains(polygon, meter_point)) {
                meter.properties["TRACT"] = tract.properties["NAME"]
            }
        })
        if (!meter.properties["TRACT"]) {
            meter.properties["TRACT"] = -1
        }
    })
    fs.writeFileSync(path.join(output_path, "parking_meters.geojson"), JSON.stringify(res.data))
})


//DP03_0062E