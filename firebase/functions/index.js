const functions = require("firebase-functions");

exports.getStops = functions
  .region("europe-west1")
  .https.onRequest((request, response) => {
    var j = require("./stops.json");
    response.send(j);
  });
