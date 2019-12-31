import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {ThemeContext} from '../contexts/ThemeContext';
import {BusTramApiContext} from '../contexts/BusTramApiContext';
import MapView, {Circle, Marker} from 'react-native-maps';
import Vehicle from './Vehicle';

export default class Map extends Component {
  // 0.013
  // 0.04
  getStopsMarkers(stops, clasters) {
    if (clasters) {
      return stops.map(c => (
        <Marker
          key={c.unit}
          coordinate={{latitude: c.lat, longitude: c.lon}}
          title={c.name}
          description={c.unit}
        />
      ));
    } else {
      let output = [];
      stops.forEach(c => {
        c.stops.forEach(stop => {
          output.push(stop);
        });
      });
      return output.map(s => (
        <Marker
          key={s.unit + ':' + s.nr}
          coordinate={{latitude: s.lat, longitude: s.lon}}
          title={s.name + ' ' + s.nr}
          description={s.unit}
        />
      ));
    }
  }

  render() {
    const initRegion = {
      latitude: 52.122801,
      longitude: 21.018324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    return (
      <ThemeContext.Consumer>
        {({t}) => (
          <BusTramApiContext.Consumer>
            {({
              vehicles,
              setMapRegion,
              radar,
              stopsInBounds,
              mapRegion,
              setMapRef,
            }) => (
              <View style={styles.container}>
                <MapView
                  ref={setMapRef}
                  customMapStyle={t.mapStyle}
                  initialRegion={initRegion}
                  showsCompass={true}
                  rotateEnabled={false}
                  style={{...StyleSheet.absoluteFillObject}}
                  onRegionChangeComplete={setMapRegion}
                >
                  {vehicles.map(v => (
                    <Vehicle
                      key={v.Lines + '-' + v.Brigade}
                      coordinates={{latitude: v.Lat, longitude: v.Lon}}
                      line={v.Lines}
                      brigade={v.Brigade}
                    />
                  ))}
                  {mapRegion.latitudeDelta < 0.04 &&
                    this.getStopsMarkers(
                      stopsInBounds,
                      mapRegion.latitudeDelta > 0.013
                    )}
                  {radar.isOn && (
                    <Circle
                      style={{zIndex: 999}}
                      center={radar.coordinates}
                      radius={radar.radiusKMs * 1000}
                      strokeWidth={1}
                      strokeColor={t.radarStrokeColor}
                      fillColor={t.radarFillColor}
                    />
                  )}
                </MapView>
              </View>
            )}
          </BusTramApiContext.Consumer>
        )}
      </ThemeContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
