// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
require('dotenv').config();
const apikey = process.env.WARSAW_API_KEY;
const fetch = require("node-fetch");
var moment = require('moment');
const fs = require('fs');

run();
async function run() {
  let stops = await _getAllStops();
  console.log("got all stops");

  //clusterring
  let clustered = stops
    .reduce((rv, x) => {
      let v = x.unit;
      let el = rv.find(r => r && r.unit === v);
      if (el) {
        el.values.push(x);
      } else {
        rv.push({ unit: v, values: [x] });
      }
      return rv;
    }, [])
    .map(claster => {
      let l = claster.values.reduce(
        (a, x) => {
          return { sumlat: a.sumlat + x.lat, sumlon: a.sumlon + x.lon };
        },
        { sumlat: 0, sumlon: 0 }
      );
      return {
        name: claster.values[0].name,
        unit: claster.values[0].unit,
        lat: l.sumlat / claster.values.length,
        lon: l.sumlon / claster.values.length,
        stops: claster.values
      };
    });

  //save
  var jsonContent2 = JSON.stringify(clustered);
  fs.writeFile("./functions/stops.json", jsonContent2, () => {});
}
async function _fetchApi(
  url,
  funcName = "",
  onError = (error, fName) => {
    console.log("[ERROR] in " + fName + ": ", error);
  }
) {
  var result = [];
  await fetch(url, { method: "get" })
    .then(res => res.json())
    .then(res => {
      result = res;
    })
    .catch(error => onError(error, funcName));
  return result;
}

async function _getAllStops() {
  var resource_id = "ab75c33d-3a26-4342-b36a-6e5fef0a3ac3";
  var url =
    "https://api.um.warszawa.pl/api/action/dbstore_get?id=" +
    resource_id +
    "&apikey=" +
    apikey;
  var res = await _fetchApi(url, "getStops");

  if (Array.isArray(res.result)) {
    //filtering

    console.log("result: ", res.result.length);
    //mapping to format
    let mapped = res.result
      .map(e => {
        return {
          unit: e.values[0].value,
          nr: e.values[1].value,
          name: e.values[2].value,
          // street_id: e.values[3].value,
          lat: e.values[4].value ? Number(e.values[4].value) : null,
          lon: e.values[5].value ? Number(e.values[5].value) : null,
          direction:
            e.values[6].value == "______________________________"
              ? ""
              : e.values[6].value,
          operatesSince: e.values[7].value
        };
      })
      .filter(e => {
        if (
          e.name == "" ||
          e.lat == null ||
          isNaN(e.lat) ||
          e.lon == null ||
          isNaN(e.lon)
        ) {
          // console.log(e);

          return false;
        }
        return true;
      });
    /////
    console.log("mapped: ", mapped.length);
    // take newest
    let newest = [];
    for (let i = 0; i < mapped.length - 1; i++) {
      const e = mapped[i];
      const next = mapped[i + 1];
      // same stop
      if (
        e.name == next.name &&
        e.nr == next.nr &&
        e.unit == next.unit &&
        moment(e.operatesSince, "YYYY-MM-DD HH:mm:ss.SSS").diff(
          moment(next.operatesSince, "YYYY-MM-DD HH:mm:ss.SSS")
        ) < 0
      ) {
        continue;
      } else {
        newest.push(e);
      }
    }
    console.log("newest: ", newest.length);
    // get stops lines
    for (let i = 0; i < newest.length; i++) {
      let lines = await getStopLines(newest[i].unit, newest[i].nr);
      newest[i].lines = lines.map(l => l.values[0].value);
      console.log(i, newest[i].name, newest[i].nr);
      
    }
    //tylko te z jakimis liniami
    console.log('pobrane: ', newest.length);
    let newestFiltered = newest.filter(e=>e.lines.length != 0);
    console.log('filtrowane: ', newestFiltered);
    return newestFiltered;
    
    ///////////////
  } else {
    console.log("[error] getLine: ", res);
    return [];
  }
}
async function getStopLines(busStopId, busStopNr) {
  var resource_id = "88cd555f-6f31-43ca-9de4-66c479ad5942";
  var url =
    "https://api.um.warszawa.pl/api/action/dbtimetable_get?id=" +
    resource_id +
    "&busstopId=" +
    busStopId +
    "&busstopNr=" +
    busStopNr +
    "&apikey=" +
    apikey;

  var res = await _fetchApi(url, "getStopLines");

  if (Array.isArray(res.result)) {
    return res.result;
  } else {
    console.log("[error] getStopLines: ", res);
    return [];
  }
}
