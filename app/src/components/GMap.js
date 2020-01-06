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
    let {favLines, selectedMarker, selectMarker} = this.props.globalContext;
    var vehiclesFiltered = [];
    if (true) {
      //temp for dev
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
    }
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
