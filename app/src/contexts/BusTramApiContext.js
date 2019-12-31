import React, {Component, createContext} from 'react';
import WarsawApi from '../WarsawApi';

var moment = require('moment');

export const BusTramApiContext = createContext();

export default class BusTramApiContextProvider extends Component {
  state = {
    vehicles: [],
    lines: ['709', '739', '727', '185', '209', '401', '193', '737'],
    mapRegion: {
      latitude: 52.122801,
      longitude: 21.018324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    radar: {
      coordinates: {
        latitude: 0,
        longitude: 0,
      },
      radiusKMs: 1.5,
      isOn: false,
    },
  };

  toggleRadar = () => {
    var coords = {
      latitude: this.state.mapRegion.latitude,
      longitude: this.state.mapRegion.longitude,
    };
    this.setState({
      radar: {
        ...this.state.radar,
        isOn: !this.state.radar.isOn,
        coordinates: coords,
      },
    });
  };
  setMapRegion = newRegion => {
    this.setState({mapRegion: newRegion});
  };

  setRadarCoordinates = newCoordinates => {
    this.setState({radar: {...this.state.radar, coordinates: newCoordinates}});
  };
  setRadarRadius = newRadius => {
    this.setState({radar: {...this.state.radar, radiusKMs: newRadius}});
  };

  toggleLine = line => {
    var linesSet = new Set(this.state.lines);
    if (linesSet.has(line)) linesSet.delete(line);
    else linesSet.add(line);
    this.setState({lines: [...linesSet]});
  };
  updateVehicles = async () => {
    var vehiclesFiltered = [];
    if (true) {
      //temp for dev
      var timeNow = moment();
      for (const i of this.state.lines) {
        var line = await WarsawApi.getLine(i, i < 100 ? 2 : 1);
        line.forEach(v => {
          var timeVehicle = moment(v.Time);
          var duration = moment.duration(timeNow.diff(timeVehicle));
          var seconds = duration.asSeconds();
          if (seconds < 50) vehiclesFiltered.push(v);
        });
      }
    }
    this.setState({vehicles: vehiclesFiltered});
  };

  componentDidMount() {
    this.updateVehicles();
    this.interval = setInterval(this.updateVehicles, 10000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    var value = {
      ...this.state,
      updateVehicles: this.updateVehicles,
      toggleLine: this.toggleLine,
      setRadarCoordinates: this.setRadarCoordinates,
      setRadarRadius: this.setRadarRadius,
      toggleRadar: this.toggleRadar,
      setMapRegion: this.setMapRegion,
    };
    return (
      <BusTramApiContext.Provider value={value}>
        {this.props.children}
      </BusTramApiContext.Provider>
    );
  }
}
