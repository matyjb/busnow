const fs = require('fs');
var oldjson = require('./przystanki.json');

var newjson = oldjson.result.map(e => {
  return {
    unit: e.values[0].value,
    nr: e.values[1].value,
    name: e.values[2].value,
    // street_id: e.values[3].value,
    lat: Number(e.values[4].value),
    lon: Number(e.values[5].value),
    direction: e.values[6].value == "______________________________" ? "" : e.values[6].value,
    operatesSince: e.values[7].value,
  };
});
var jsonContent = JSON.stringify(newjson);
fs.writeFile('przystanki_new.json', jsonContent, () => {

  
  
var oldjson2 = require('./przystanki_new.json');

var newjson2 = oldjson2.filter(e => {
  if(e.name == "") return false;
  if(e.lat == null) return false;
  if(e.lon == null) return false;
  return true;
});



// var sorted = newjson.sort(function (a, b) {
//   return a.unit.localeCompare(b.unit) || a.nr.localeCompare(b.nr) || Date.parse(a.operatesSince)-Date.parse(b.operatesSince);
// });

var jsonContent2 = JSON.stringify(newjson2);
fs.writeFile('przystanki_new.json', jsonContent2, () => {});
// var jsonContent3 = JSON.stringify(sorted);
// fs.writeFile('przystanki_new2.json', jsonContent3, () => {});
// if(jsonContent3.localeCompare(jsonContent2)) console.log("tak"); else console.log("nie");
});
