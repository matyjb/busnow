import React, {Component, createContext} from 'react';
import WarsawApi from '../WarsawApi';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';

export const GlobalContext = createContext();

export const withGlobalContext = Component => props => (
  <GlobalContext.Consumer>
    {context => <Component globalContext={context} {...props} />}
  </GlobalContext.Consumer>
);

export default class GlobalContextProvider extends Component {
  state = {
    allStops: [],
    favLines: ['709', '739', '727', '185', '209', '401', '193', '737'],
    favStops: [],
    // vehicles: [],
    mapRegion: {
      //lat lon is center of screen
      latitude: 52.122801,
      longitude: 21.018324,
      // for example: left edge of screen is lon - londelta/2
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    radar: {
      coordinates: null,
      radiusKMs: 1.5,
    },
    selectedMarker: null,
  };

  ///////////ACTIONS

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

  navigateToMarkerAndSelect = marker => {
    this.map.animateToRegion(
      {
        latitude: marker.lat,
        longitude: marker.lon,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      400
    );
    this.selectMarker(marker);
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

  toggleRadar = () => {
    let coords = {
      latitude: this.state.mapRegion.latitude,
      longitude: this.state.mapRegion.longitude,
    };
    this.setState({
      radar: {
        ...this.state.radar,
        coordinates: this.state.radar.coordinates ? null : coords,
      },
    });
  };
  setMapRegion = newRegion => {
    this.setState({mapRegion: newRegion});
  };

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
  downloadAllStops = async () => {
    console.log('downloading stops started');
    let stops = await WarsawApi.getStops();
    if (stops.length != 0) {
      await this._saveStopsToStorage(this.state.allStops);
      this.setState({allStops: stops});
      console.log('saved ', stops.length, 'stops');
    }
    console.log('downloading stops ended');
  };

  ////////////STORAGE
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

  //////////////////LIFECYCLE
  async componentDidMount() {
    //allStops
    if ((await AsyncStorage.getItem('@Storage:stops')) == null) {
      await this.downloadAllStops();
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
  }

  render() {
    var value = {
      ...this.state,
      setMapRef: this.setMapRef,
      fitMapToClasterStops: this.fitMapToClasterStops,
      selectMarker: this.selectMarker,
      navigateToUser: this.navigateToUser,
      toggleStopInFavs: this.toggleStopInFavs,
      navigateToMarkerAndSelect: this.navigateToMarkerAndSelect,
      toggleLine: this.toggleLine,
      setRadarRadius: this.setRadarRadius,
      toggleRadar: this.toggleRadar,
      setMapRegion: this.setMapRegion,
      downloadAllStops: this.downloadAllStops,
    };
    return (
      <GlobalContext.Provider value={value}>
        {this.props.children}
      </GlobalContext.Provider>
    );
  }
}
