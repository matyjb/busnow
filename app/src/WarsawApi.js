import BuildConfig from 'react-native-config';
import React from 'react';
import moment from 'moment';

class WarsawApi extends React.Component {
  static apikey = BuildConfig.WARSAW_API_KEY;

  static async _fetchApi(
    url,
    funcName = '',
    onError = (error, fName) => {
      console.log('[ERROR] in ' + fName + ': ', error);
    }
  ) {
    var result = [];
    await fetch(url, {method: 'get'})
      .then(res => res.json())
      .then(res => {
        result = res;
      })
      .catch(error => onError(error, funcName));
    return result;
  }

  static async getLine(line, type) {
    // var type = "1";
    var resource_id = 'f2e5503e927d-4ad3-9500-4ab9e55deb59';
    var url =
      'https://api.um.warszawa.pl/api/action/busestrams_get/?resource_id=' +
      resource_id +
      '&apikey=' +
      WarsawApi.apikey +
      '&type=' +
      type +
      '&line=' +
      line;
    var res = await WarsawApi._fetchApi(url, 'getLine');

    if (Array.isArray(res.result)) {
      return res.result;
    } else {
      console.log('[error] getLine: ', res);
      return [];
    }
  }

  static async getStops() {
    var url = 'https://europe-west1-bus-now-257020.cloudfunctions.net/getStops';
    var res = await WarsawApi._fetchApi(url, 'getLine');
    if (Array.isArray(res)) {
      return res;
    } else {
      console.log('[error] getLine: ', res);
      return [];
    }
  }

  static async getStopUnit(name) {
    var resource_id = 'b27f4c17-5c50-4a5b-89dd-236b282bc499';
    var url =
      'https://api.um.warszawa.pl/api/action/dbtimetable_get?id=' +
      resource_id +
      '&name=' +
      name +
      '&apikey=' +
      WarsawApi.apikey;
  }

  static async getStopLines(busStopId, busStopNr) {
    var resource_id = '88cd555f-6f31-43ca-9de4-66c479ad5942';
    var url =
      'https://api.um.warszawa.pl/api/action/dbtimetable_get?id=' +
      resource_id +
      '&busstopId=' +
      busStopId +
      '&busstopNr=' +
      busStopNr +
      '&apikey=' +
      WarsawApi.apikey;

    var res = await WarsawApi._fetchApi(url, 'getStopLines');

    if (Array.isArray(res.result)) {
      return res.result;
    } else {
      console.log('[error] getStopLines: ', res);
      return [];
    }
  }

  static async getStopLineSchedule(busStopId, busStopNr, line) {
    var resource_id = 'e923fa0e-d96c-43f9-ae6e-60518c9f3238';
    var url =
      'https://api.um.warszawa.pl/api/action/dbtimetable_get?id=' +
      resource_id +
      '&busstopId=' +
      busStopId +
      '&busstopNr=' +
      busStopNr +
      '&line=' +
      line +
      '&apikey=' +
      WarsawApi.apikey;

    var res = await WarsawApi._fetchApi(url, 'getStopLineSchedule');

    if (Array.isArray(res.result)) {
      return res.result;
    } else {
      console.log('[error] getStopLineSchedule: ', res);
      return [];
    }
  }
}
export default WarsawApi;
