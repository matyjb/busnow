import React, { Component, createContext } from 'react';
import BuildConfig from 'react-native-config';
// import { WARSAW_API_KEY } from 'react-native-dotenv';

export const BusTramApiContext = createContext();

export default class BusTramApiContextProvider extends Component {
  state = {
    vehicles: [],
    updateVehicles: this.updateVehicles
  }
  updateVehicles = () => {
    if(false){ //temp for dev
      var apikey = BuildConfig.WARSAW_API_KEY;
      var type = "1";
      var resource_id = "f2e5503e927d-4ad3-9500-4ab9e55deb59";
      
      fetch("https://api.um.warszawa.pl/api/action/busestrams_get/?resource_id="+resource_id+"&apikey="+apikey+"&type="+type,{method: "get"})
      .then(res => res.json())
      .then(res => {
        if(Array.isArray(res.result)){
          this.setState({ vehicles: res.result })
        }
        else
        console.log("error: ", res.result)
      }).catch(error => console.log("error: ", error))
    }
  }
  componentDidMount() {
    this.interval = setInterval(this.updateVehicles, 10000);
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
