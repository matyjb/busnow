const fetch = require("node-fetch");

async function getbus(line){

  var apikey = "ffe0614a-0e30-47a4-a207-64cd1d630932";
  var type = "1";
  var resource_id = "f2e5503e927d-4ad3-9500-4ab9e55deb59";
  
  await fetch("https://api.um.warszawa.pl/api/action/busestrams_get/?resource_id="+resource_id+"&apikey="+apikey+"&type="+type+"&line="+line,{method: "get"})
  .then(res => res.json())
  .then(res => {
    if(Array.isArray(res.result)){
      return res.result;
    }
    else
    console.log("error: ", res.result)
  }).catch(error => console.log("error: ", error))
  return [];
}

function doesAllBussesHaveDiffferentBrigades(busses_arr){
  var brigades = [];
  busses_arr.forEach(bus => {
    if(brigades.includes(bus.Brigade)) return false;
    else brigades.push(bus.Brigade);
  });
  return true;
}

var fs = require('fs');
 
var busses = fs.readFileSync('busses.txt', 'utf8').toString().split('\n');

console.log("źle dla:");
for (i in busses) {
  var busses_arr = getbus(i)
  if(!doesAllBussesHaveDiffferentBrigades(busses_arr)) 
  console.log(i)
}
console.log("------");
process.exit();
