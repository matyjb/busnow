import React, { Component, createContext } from 'react';
import BuildConfig from 'react-native-config';

var moment = require('moment');

export const BusTramApiContext = createContext();

export default class BusTramApiContextProvider extends Component {
  state = {
    vehicles: [],
    updateVehicles: this.updateVehicles,
    lines: ['709','739', '727', '185', '209', '401', '193','737'],
    toggleLine: this.toggleLine

  }

  toggleLine = (line) => {
    var filtered = this.state.lines.filter(l => {
      return l != line;
    });
    this.setState({lines: filtered});
    this.updateVehicles();
  }
  updateVehicles = async() => {
    var vehiclesFiltered = [];
    if(true){ //temp for dev
      var timeNow = moment();
      for (const i of this.state.lines) {
        var line = await this.getLine(i, i < 100 ? 2 : 1);
        line.forEach(v => {
          var timeVehicle = moment(v.Time);
          var duration = moment.duration(timeNow.diff(timeVehicle));
          var seconds = duration.asSeconds();
          if(seconds < 50)
            vehiclesFiltered.push(v);
        });
      }
    }
    this.setState({ vehicles: vehiclesFiltered })
  }
  async getLine(line, type){
    var apikey = BuildConfig.WARSAW_API_KEY;
    // var type = "1";
    var resource_id = "f2e5503e927d-4ad3-9500-4ab9e55deb59";
    var result = [];
    await fetch("https://api.um.warszawa.pl/api/action/busestrams_get/?resource_id="+resource_id+"&apikey="+apikey+"&type="+type+"&line="+line,{method: "get"})
    .then(res => res.json())
    .then(res => {
      if(Array.isArray(res.result)){
        result = res.result;
      }
      else
      console.log("error1: ", res.result)
    }).catch(error => console.log("error2: ", error))
    return result;
  }


  componentDidMount() {
    this.interval = setInterval(this.updateVehicles, 10000);
    // this.updateVehicles();
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <BusTramApiContext.Provider value={{...this.state}}>
        {this.props.children}
      </BusTramApiContext.Provider>
    )
  }
}
