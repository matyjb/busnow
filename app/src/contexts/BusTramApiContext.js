import React, {Component, createContext} from 'react';
import WarsawApi from '../WarsawApi';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';

var moment = require('moment');

export const BusTramApiContext = createContext();

export default class BusTramApiContextProvider extends Component {
  state = {
    allStops: [],
    stopsInBounds: [],
    vehicles: [],
    favLines: ['709', '739', '727', '185', '209', '401', '193', '737'],
    favStops: [],
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

  toggleStopInFavs = stop => {
    let s = this.state.favStops;
    let f = s.find(e => {
      return e.unit == stop.unit && e.nr == stop.nr;
    });
    let set = new Set(s);
    if (f) {
      set.delete(f);
    } else {
      set.add(stop);
    }
    let stops = Array.from(set);
    this._saveFavStopsToStorage(stops);
    this.setState({favStops: stops});
  };

  setMapRef = r => {
    this.map = r;
  };

  navigateToUser = () => {
    Geolocation.getCurrentPosition(
      ({coords}) => {
        this.map.animateToRegion(
          {...coords, latitudeDelta: 0.01, longitudeDelta: 0.01},
          400
        );
      },
      // error => alert('Error: Are location services on?'),
      error => {},
      {enableHighAccuracy: true}
    );
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
  _loadFavStopsFromStorage = async () => {
    try {
      const value = await AsyncStorage.getItem('@Storage:favStops');
      if (value !== null) {
        this.setState({favStops: JSON.parse(value)});
      }
      console.log('loaded favStops');
    } catch (error) {
      console.log('error loading favStops from storage');
    }
  };
  _saveFavStopsToStorage = async stops => {
    try {
      await AsyncStorage.setItem('@Storage:favStops', JSON.stringify(stops));
      console.log('saved favStops');
    } catch (error) {
      console.log('error saving favStops to storage');
    }
  };
  _loadFavLinesFromStorage = async () => {
    try {
      const value = await AsyncStorage.getItem('@Storage:favLines');
      if (value !== null) {
        this.setState({favLines: JSON.parse(value)});
      }
      console.log('loaded favLines');
    } catch (error) {
      console.log('error loading favLines from storage');
    }
  };
  _saveFavLinesToStorage = async lines => {
    try {
      await AsyncStorage.setItem('@Storage:favLines', JSON.stringify(lines));
      console.log('saved favLines');
    } catch (error) {
      console.log('error saving favLines to storage');
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
    var linesSet = new Set(this.state.favLines);
    if (linesSet.has(line)) linesSet.delete(line);
    else linesSet.add(line);
    let lines = [...linesSet];
    this._saveFavLinesToStorage(lines);
    this.setState({favLines: lines});
  };
  _updateVehicles = async () => {
    var vehiclesFiltered = [];
    if (true) {
      //temp for dev
      var timeNow = moment();
      for (const i of this.state.favLines) {
        var line = await WarsawApi.getLine(i, i < 100 ? 2 : 1);
        line.forEach(v => {
          var timeVehicle = moment(v.Time);
          var duration = moment.duration(timeNow.diff(timeVehicle));
          var seconds = duration.asSeconds();
          if (seconds < 50) vehiclesFiltered.push(v);
        });
      }
    }

    // update selectedMarker that is a bus
    let newstate = {vehicles: vehiclesFiltered};
    if (this.state.selectedMarker && this.state.selectedMarker.VehicleNumber) {
      let t = vehiclesFiltered.filter(
        e => e.VehicleNumber == this.state.selectedMarker.VehicleNumber
      );
      if (t.length > 0) {
        this.setState({...newstate, selectedMarker: t[0]});
      } else {
        this.setState({...newstate, selectedMarker: null});
      }
    } else {
      this.setState(newstate);
    }
  };

  async componentDidMount() {
    //allStops
    if ((await AsyncStorage.getItem('@Storage:stops')) == null) {
      await this.downloadAllStops();
      await this._saveStopsToStorage(this.state.allStops);
    } else {
      await this._loadStopsFromStorage();
    }
    //favStops
    if ((await AsyncStorage.getItem('@Storage:favStops')) != null) {
      await this._loadFavStopsFromStorage(this.state.favStops);
    }

    //favLines
    if ((await AsyncStorage.getItem('@Storage:favLines')) != null) {
      await this._loadFavLinesFromStorage(this.state.favLines);
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
      navigateToUser: this.navigateToUser,
      toggleStopInFavs: this.toggleStopInFavs,
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
