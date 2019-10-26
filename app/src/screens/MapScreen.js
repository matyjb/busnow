import React, { Component } from 'react'
import { Text, StyleSheet, View, Dimensions, Button } from 'react-native'
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import {BusTramApiContext} from '../contexts/BusTramApiContext'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Vehicle from '../components/Vehicle';
// const screen = Dimensions.get('window');

// const ASPECT_RATIO = screen.width / screen.height;
// const LATITUDE = 52.122801;
// const LONGITUDE = 21.018324;
// const LATITUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
export default class MapScreen extends Component {
  state = {
    region: {
      latitude: 52.122801,
      longitude: 21.018324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    // coordinate: new AnimatedRegion({
    //   latitude: LATITUDE,
    //   longitude: LONGITUDE,
    //   latitudeDelta: LATITUDE_DELTA,
    //   longitudeDelta: LONGITUDE_DELTA
    // }),
  }
  // animate() {
  //   const { coordinate } = this.state;
  //   console.log("hellow")
  //   const newCoordinate = {
  //     latitude: LATITUDE + (Math.random() - 0.5) * (LATITUDE_DELTA / 2),
  //     longitude: LONGITUDE + (Math.random() - 0.5) * (LONGITUDE_DELTA / 2),
  //   };

  //   if (Platform.OS === 'android') {
  //     if (this.marker) {
  //       this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
  //     }
  //   } else {
  //     coordinate.timing(newCoordinate).start();
  //   }
  // }
  render() {
    return (
      <View style={styles.container}>
        <BusTramApiContext.Consumer>
          {({vehicles}) => (
            <>
              <MapView
              initialRegion={this.state.region}
              showsCompass={true}
              rotateEnabled={true}
              style={{...StyleSheet.absoluteFillObject}}
              >
                {vehicles.map((v, i) => (
                  // <Marker
                  //   key={i}
                  //   coordinate={{"latitude": v.Lat, "longitude": v.Lon}}
                  //   title={v.Lines}
                  // />
                  <Vehicle
                    key={i}
                    newCoordinate={{"latitude": v.Lat, "longitude": v.Lon}}
                    line={v.Lines}
                  />
                ))}
                {/* <Marker.Animated
                  ref={marker => {
                    this.marker = marker;
                  }}
                  coordinate={this.state.coordinate}
                >
                  <View style={{backgroundColor: "red", width: 5, height: 5}}/>
                </Marker.Animated> */}
              </MapView>
              </>
          )}
        </BusTramApiContext.Consumer>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
})
