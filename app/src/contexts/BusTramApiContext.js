import React, {Component, createContext} from 'react';
import WarsawApi from '../WarsawApi';
import AsyncStorage from '@react-native-community/async-storage';

var moment = require('moment');

export const BusTramApiContext = createContext();

export default class BusTramApiContextProvider extends Component {
  state = {
    allStops: [],
    stopsInBounds: [],
    vehicles: [],
    lines: ['709', '739', '727', '185', '209', '401', '193', '737'],
    mapRegion: {
      //lat lon is center of screen
      latitude: 52.122801,
      longitude: 21.018324,
      // for example: left edge of screen is lon - londelta/2
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
    selectedMarker: null,
  };

  setMapRef = r => {
    this.map = r;
  };

  selectMarker = marker => {
    this.setState({selectedMarker: marker});
  };

  fitMapToClasterStops = claster => {
    let m = claster.stops.map(e => {
      return {latitude: e.lat, longitude: e.lon};
    });
    this.map.fitToCoordinates(m, {
      edgePadding: {top: 300, right: 200, bottom: 300, left: 200},
      animated: true,
    });
  };

  _setStopsInBounds = () => {
    let s = this.state.allStops.filter(e => {
      if (
        Math.abs(e.lat - this.state.mapRegion.latitude) <
          this.state.mapRegion.latitudeDelta &&
        Math.abs(e.lon - this.state.mapRegion.longitude) <
          this.state.mapRegion.longitudeDelta
      )
        return true;
      return false;
    });
    this.setState({stopsInBounds: s});
  };

  downloadAllStops = async () => {
    let stops = await WarsawApi.getStops();
    console.log('downloaded all stops');
    let clustered = stops
      .reduce((rv, x) => {
        let v = x.unit;
        let el = rv.find(r => r && r.unit === v);
        if (el) {
          el.values.push(x);
        } else {
          rv.push({unit: v, values: [x]});
        }
        return rv;
      }, [])
      .map(claster => {
        let l = claster.values.reduce(
          (a, x) => {
            return {sumlat: a.sumlat + x.lat, sumlon: a.sumlon + x.lon};
          },
          {sumlat: 0, sumlon: 0}
        );
        return {
          name: claster.values[0].name,
          unit: claster.values[0].unit,
          lat: l.sumlat / claster.values.length,
          lon: l.sumlon / claster.values.length,
          stops: claster.values,
        };
      });
    console.log('clustered all stops', clustered.length);

    this.setState({allStops: clustered});
  };

  _loadStopsFromStorage = async () => {
    try {
      const value = await AsyncStorage.getItem('@Storage:stops');
      if (value !== null) {
        this.setState({allStops: JSON.parse(value)});
      }
      console.log('loaded stops');
    } catch (error) {
      console.log('error loading stops from storage');
    }
  };
  _saveStopsToStorage = async stops => {
    try {
      await AsyncStorage.setItem('@Storage:stops', JSON.stringify(stops));
      console.log('saved stops');
    } catch (error) {
      console.log('error saving stops to storage');
    }
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
    this.setState({mapRegion: newRegion}, this._setStopsInBounds);
  };

  // setRadarCoordinates = newCoordinates => {
  //   this.setState({radar: {...this.state.radar, coordinates: newCoordinates}});
  // };
  setRadarRadius = newRadius => {
    this.setState({radar: {...this.state.radar, radiusKMs: newRadius}});
  };

  toggleLine = line => {
    var linesSet = new Set(this.state.lines);
    if (linesSet.has(line)) linesSet.delete(line);
    else linesSet.add(line);
    this.setState({lines: [...linesSet]});
  };
  _updateVehicles = async () => {
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

  async componentDidMount() {
    //allStops
    if ((await AsyncStorage.getItem('@Storage:stops')) == null) {
      await this.downloadAllStops();
      await this._saveStopsToStorage(this.state.allStops);
    } else {
      await this._loadStopsFromStorage();
    }

    //
    this._updateVehicles();
    this.interval = setInterval(this._updateVehicles, 10000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    var value = {
      ...this.state,
      setMapRef: this.setMapRef,
      fitMapToClasterStops: this.fitMapToClasterStops,
      selectMarker: this.selectMarker,
      // stopsInBounds: this.stopsInBounds,
      // updateVehicles: this._updateVehicles,
      toggleLine: this.toggleLine,
      // setRadarCoordinates: this.setRadarCoordinates,
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
