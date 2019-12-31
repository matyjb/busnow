import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {ThemeContext} from '../contexts/ThemeContext';
import {BusTramApiContext} from '../contexts/BusTramApiContext';
import MapView, {Circle, Marker} from 'react-native-maps';
import VehicleMarker from './VehicleMarker';
import StopMarker from './StopMarker';
import StopClusterMarker from './StopClusterMarker';

export default class Map extends Component {
  // 0.013
  // 0.04
  getStopsMarkers(stops, clasters) {
    if (clasters) {
      return stops.map(c => (
        <StopClusterMarker style={{zIndex: 1}} cluster={c} />
      ));
    } else {
      let output = [];
      stops.forEach(c => {
        c.stops.forEach(stop => {
          output.push(stop);
        });
      });
      return output.map(s => <StopMarker style={{zIndex: 1}} stop={s} />);
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
                    <VehicleMarker
                      style={{zIndex: 2}}
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
