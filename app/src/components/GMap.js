import React, {Component} from 'react';
import {StyleSheet, View, PermissionsAndroid, Platform} from 'react-native';
import {withThemeContext} from '../contexts/ThemeContext';
import {withGlobalContext} from '../contexts/GlobalContext';
import MapView, {Circle} from 'react-native-maps';
import VehicleMarker from './VehicleMarker';
import StopMarker from './StopMarker';
import StopClusterMarker from './StopClusterMarker';
import Geolocation from '@react-native-community/geolocation';
import WarsawApi from '../WarsawApi';
var moment = require('moment');

const initRegion = {
  latitude: 52.122801,
  longitude: 21.018324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};
const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 1000,
};

class GMap extends Component {
  state = {
    // vehicleMarkers: [],
    vehicles: [],
    stopsInBounds: [],
    mapRegion: initRegion,
  };

  _updateVehicles = async () => {
    let {
      favLines,
      selectedMarker,
      selectMarker,
      allStops,
      radar,
    } = this.props.globalContext;
    var vehiclesFiltered = [];

    let radarLines = new Set();
    if (radar.coordinates) {
      const earthRadiusKm = 6371;
      // zebrac wszystkie przystanki co są w radiusie (klastry)
      let stops = allStops.filter(e => {
        let latRadar = (radar.coordinates.latitude * Math.PI) / 180;
        let lonRadar = (radar.coordinates.longitude * Math.PI) / 180;
        let latStop = (e.lat * Math.PI) / 180;
        let lonStop = (e.lon * Math.PI) / 180;
        let dLat = latStop - latRadar;
        let dLon = lonStop - lonRadar;

        var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.sin(dLon / 2) *
            Math.sin(dLon / 2) *
            Math.cos(latRadar) *
            Math.cos(latStop);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusKm * c < radar.radiusKMs + 200;
      });
      // zebrac wszystkie linesy z przystankow
      //   // FOREACH//pushowac do radarLines wszystkie linie z kazdego znalezionego przystanku
      for (const cluster of stops) {
        // SUGGESTION: zrobić by kazdy przystanek mial juz za wczasu pobrane jakie autobusy tam jezdza ????????
        for (const s of cluster.stops) {
          let lines = await WarsawApi.getStopLines(s.unit, s.nr);
          lines.forEach(l => {
            if (!favLines.find(e => e == l.values[0].value))
              radarLines.add(l.values[0].value);
          });
        }
      }
    }
    console.log(radarLines);

    var timeNow = moment();

    for (const i of favLines) {
      var line = await WarsawApi.getLine(i, i < 100 ? 2 : 1);
      line.forEach(v => {
        var timeVehicle = moment(v.Time);
        var duration = moment.duration(timeNow.diff(timeVehicle));
        var seconds = duration.asSeconds();
        if (seconds < 50) vehiclesFiltered.push(v);
      });
    }
    for (const i of radarLines) {
      var line = await WarsawApi.getLine(i, i < 100 ? 2 : 1);
      line.forEach(v => {
        var timeVehicle = moment(v.Time);
        var duration = moment.duration(timeNow.diff(timeVehicle));
        var seconds = duration.asSeconds();
        if (seconds < 50) vehiclesFiltered.push(v);
      });
    }

    //TODO: get all vehicles inside radar radius
    // zmienna linesToDownload = new Set(favLines);
    // let favLinesSet = new Set(favLines);
    // let linesToDownload = new Set(favLines);
    // if (radar.coordinates) {
    //   // zebrac wszystkie przystanki co są w radiusie
    //   const earthRadiusKm = 6371;
    //   let stops = allStops.filter(e => {
    //     let latRadar = (radar.coordinates.latitude * Math.PI) / 180;
    //     let lonRadar = (radar.coordinates.longitude * Math.PI) / 180;
    //     let latStop = (e.lat * Math.PI) / 180;
    //     let lonStop = (e.lon * Math.PI) / 180;
    //     let dLat = latStop - latRadar;
    //     let dLon = lonStop - lonRadar;

    //     var a =
    //       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    //       Math.sin(dLon / 2) *
    //         Math.sin(dLon / 2) *
    //         Math.cos(latRadar) *
    //         Math.cos(latStop);
    //     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //     return earthRadiusKm * c < radar.radiusKMs;
    //   });
    //   // zebrac wszystkie linesy z przystankow
    //   // FOREACH//pushowac do linesToDownload wszystkie linie z kazdego znalezionego przystanku
    //   for (const s of stops) {
    //     // SUGGESTION: zrobić by kazdy przystanek mial juz za wczasu pobrane jakie autobusy tam jezdza ????????
    //     let lines = await WarsawApi.getStopLines(s.unit, s.nr);
    //     lines.forEach(l => linesToDownload.add(l.values[0].value));
    //   }
    // }
    // // dla kazdej linii w linesToDownload odpalić api
    // for (const line of linesToDownload) {
    //   let vehicles = await WarsawApi.getLine(line, line < 100 ? 2 : 1);
    //   // FOREACH^//kazdy wynik z kadego odpalenia api sprawdzić czy jest w radiusie if jest -> push do vehiclesFiltered (jezeli nie jest ulubionym)
    //   var timeNow = moment();
    //   if (favLinesSet.has(line)) {
    //     vehicles.forEach(v => {
    //       let timeVehicle = moment(v.Time);
    //       let duration = moment.duration(timeNow.diff(timeVehicle));
    //       let seconds = duration.asSeconds();
    //       if (seconds < 50) vehiclesFiltered.push(v);
    //     });
    //   } else {
    //     let timeVehicle = moment(v.Time);
    //     let duration = moment.duration(timeNow.diff(timeVehicle));
    //     let seconds = duration.asSeconds();
    //     if (seconds < 50) {
    //       if (/*is in radius? */ true) {
    //         vehiclesFiltered.push(v);
    //       }
    //     }
    //   }
    // }

    this.setState({vehicles: vehiclesFiltered});

    // update selectedMarker that is a bus
    if (selectedMarker && selectedMarker.VehicleNumber) {
      let t = vehiclesFiltered.filter(
        e => e.VehicleNumber == selectedMarker.VehicleNumber
      );
      if (t.length > 0) {
        selectMarker(t[0]);
      } else {
        selectMarker(null);
      }
    }
  };

  componentDidMount() {
    this.mounted = true;

    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then(granted => {
        if (granted && this.mounted) {
          this.watchLocation();
        }
      });
    } else {
      this.watchLocation();
    }

    this._updateVehicles();
    this.interval = setInterval(this._updateVehicles, 10000);
  }

  watchLocation() {
    this.watchID = Geolocation.watchPosition(
      position => {
        // const myLastPosition = this.state.myPosition;
        // const myPosition = position.coords;
        // if (!isEqual(myPosition, myLastPosition)) {
        //   this.setState({myPosition});
        // }
      },
      null,
      GEOLOCATION_OPTIONS
    );
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.watchID) {
      Geolocation.clearWatch(this.watchID);
    }
    clearInterval(this.interval);
  }

  updateBusStops = mapRegion => {
    let {allStops} = this.props.globalContext;
    let s = allStops.filter(e => {
      if (
        Math.abs(e.lat - mapRegion.latitude) < mapRegion.latitudeDelta &&
        Math.abs(e.lon - mapRegion.longitude) < mapRegion.longitudeDelta
      )
        return true;
      return false;
    });

    this.setState({stopsInBounds: s});
  };

  _renderVehiclesMarkers() {
    return this.state.vehicles.map(v => (
      <VehicleMarker style={{zIndex: 2}} key={v.VehicleNumber} vehicle={v} />
    ));
  }
  _renderStopsMarkers() {
    if (this.state.mapRegion.latitudeDelta > 0.04) return [];

    let clasters = this.state.mapRegion.latitudeDelta > 0.025;
    if (clasters) {
      return this.state.stopsInBounds.map(c => (
        <StopClusterMarker key={c.unit} style={{zIndex: 1}} cluster={c} />
      ));
    } else {
      let output = [];
      this.state.stopsInBounds.forEach(c => {
        c.stops.forEach(s => {
          output.push(
            <StopMarker
              key={s.unit + ':' + s.nr}
              style={{zIndex: 1}}
              stop={s}
            />
          );
        });
      });
      return output;
    }
  }

  render() {
    let {t} = this.props.themeContext;
    let {
      setMapRegion,
      radar,
      setMapRef,
      selectMarker,
    } = this.props.globalContext;
    return (
      <View style={styles.container}>
        <MapView
          ref={setMapRef}
          customMapStyle={t.mapStyle}
          initialRegion={initRegion}
          rotateEnabled={false}
          style={{...StyleSheet.absoluteFillObject}}
          onRegionChangeComplete={mr => {
            this.updateBusStops(mr);
            setMapRegion(mr);
            this.setState({mapRegion: mr});
          }}
          showsUserLocation={true}
          onPress={() => selectMarker(null)}
        >
          {this._renderVehiclesMarkers()}
          {this._renderStopsMarkers()}
          {radar.coordinates && (
            <Circle
              style={{zIndex: 0}}
              center={radar.coordinates}
              radius={radar.radiusKMs * 1000}
              strokeWidth={1}
              strokeColor={t.radarStrokeColor}
              fillColor={t.radarFillColor}
            />
          )}
        </MapView>
      </View>
    );
  }
}

export default withThemeContext(withGlobalContext(GMap));

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
