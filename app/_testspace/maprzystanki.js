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
    direction:
      e.values[6].value == '______________________________'
        ? ''
        : e.values[6].value,
    operatesSince: e.values[7].value,
  };
});
var jsonContent = JSON.stringify(newjson);
fs.writeFile('przystanki_new2.json', jsonContent, () => {
  var oldjson2 = require('./przystanki_new2.json');

  var newjson2 = oldjson2.filter(e => {
    if (e.name == '') return false;
    if (e.lat == null || isNaN(e.lat)) return false;
    if (e.lon == null || isNaN(e.lon)) return false;
    return true;
  });

  var newjson3 = [];
  for (let i = 0; i < newjson2.length - 1; i++) {
    const e = newjson2[i];
    const next = newjson2[i + 1];
    // same stop
    if (e.name == next.name && e.nr == next.nr && e.unit == next.unit)
      if (Date.parse(e.operatesSince) < Date.parse(next.operatesSince))
        continue;

    newjson3.push(e);
  }
  console.log("stary", newjson3.length);
  

  var jsonContent2 = JSON.stringify(newjson3);
  fs.writeFile('przystanki_new2.json', jsonContent2, () => {});

  // to test if incoming json from api is sorted
  // var sorted = newjson.sort(function (a, b) {
  //   return a.unit.localeCompare(b.unit) || a.nr.localeCompare(b.nr) || Date.parse(a.operatesSince)-Date.parse(b.operatesSince);
  // });
  // var jsonContent3 = JSON.stringify(sorted);
  // fs.writeFile('przystanki_new2.json', jsonContent3, () => {});
  // if(jsonContent3.localeCompare(jsonContent2)) console.log("tak"); else console.log("nie");
  // already sorted
});

console.log(oldjson.result.length);
      //mapping to format
      let mapped = oldjson.result.map(e => {
        return {
          unit: e.values[0].value,
          nr: e.values[1].value,
          name: e.values[2].value,
          // street_id: e.values[3].value,
          lat: Number(e.values[4].value),
          lon: Number(e.values[5].value),
          direction:
            e.values[6].value == '______________________________'
              ? ''
              : e.values[6].value,
          operatesSince: e.values[7].value,
        };
      }).filter(e => {
        
        if (e.name == '' ||
          e.lat == null || isNaN(e.lat) ||
          e.lon == null || isNaN(e.lon)) {
            // console.log(e);
            
            return false;
          }
        return true;
      });
      /////
      console.log(mapped.length);
      // take newest
      let newest = [];
      for (let i = 0; i < mapped.length - 1; i++) {
        const e = mapped[i];
        const next = mapped[i + 1];
        // same stop
        if (e.name == next.name && e.nr == next.nr && e.unit == next.unit)
          if (Date.parse(e.operatesSince) < Date.parse(next.operatesSince))
            continue;
    
            newest.push(e);
      }
      console.log(newest.length);
