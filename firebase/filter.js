const fs = require("fs");
const p = require("./przystanki_new2.json");

let countStops0 = p.reduce((acc, e)=>acc+e.stops.length,0);
console.log('przed:', p.length, countStops0);


let json2 = [];
p.forEach(c => {
  let przystanki = c.stops.filter(e => e.lines.length != 0);
  if(przystanki.length != 0)
  json2.push({...c, stops: przystanki})
});


let countStops1 = json2.reduce((acc, e)=>acc+e.stops.length,0);
console.log('po:   ', json2.length, countStops1);


var jsonContent2 = JSON.stringify(json2);
fs.writeFile("przystanki_new2filtered.json", jsonContent2, () => {});
