import React, { Component } from 'react'
import { Text, StyleSheet, View, Dimensions } from 'react-native'
import { AnimatedRegion, Marker } from 'react-native-maps';

const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 52.122801;
const LONGITUDE = 21.018324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Vehicle extends Component {
  state = {
    coordinate: new AnimatedRegion({
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    }),
  }
  animate(newCoordinate) {
    const { coordinate } = this.state;
    // const newCoordinate = {
    //   latitude: LATITUDE + (Math.random() - 0.5) * (LATITUDE_DELTA / 2),
    //   longitude: LONGITUDE + (Math.random() - 0.5) * (LONGITUDE_DELTA / 2),
    // };

    if (Platform.OS === 'android') {
      if (this.marker) {
        this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
      }
    } else {
      coordinate.timing(newCoordinate).start();
    }
  }
  componentDidUpdate(){
    this.animate(this.props.newCoordinate);
  }
  render() {
    return (
        <Marker.Animated
          ref={marker => {
            this.marker = marker;
          }}
          coordinate={this.state.coordinate}
        >
          <View style={styles.container}>
            <Text>{this.props.line}</Text>
          </View>
        </Marker.Animated>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    borderWidth: 0.7,
    borderStyle: "solid",
    borderColor: '#DBA656',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    paddingHorizontal: 2
  }
})
