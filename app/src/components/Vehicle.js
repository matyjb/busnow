import React, {Component} from 'react';
import {Text, StyleSheet, View, Dimensions} from 'react-native';
import {AnimatedRegion, Marker} from 'react-native-maps';
import PropTypes from 'prop-types';

import { ThemeContext } from '../contexts/ThemeContext';
import {ThemeConstants} from './../constants/ThemeConstants';

const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class Vehicle extends Component {
  state = {
    coordinate: new AnimatedRegion({
      latitude: this.props.coordinates.latitude,
      longitude: this.props.coordinates.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
  };
  animate(newCoordinate) {
    const {coordinate} = this.state;

    if (Platform.OS === 'android') {
      if (this.marker) {
        this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
      }
    } else {
      coordinate.timing(newCoordinate).start();
    }
  }

  componentDidUpdate() {
    this.animate(this.props.coordinates);
  }
  render() {
    return (
      <Marker.Animated
        ref={marker => {
          this.marker = marker;
        }}
        coordinate={this.state.coordinate}
        tracksViewChanges={false}
      >
        <ThemeContext.Consumer>
          {({t}) => 
              <View
                style={{
                  ...styles.container,
                  backgroundColor: t.vehicleBgColor,
                }}>
                <Text style={{...styles.text, color: t.textColor}}>
                  {this.props.line}
                </Text>
              </View>
          }
        </ThemeContext.Consumer>
      </Marker.Animated>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    // borderRadius: 4,
    borderRadius: 40,
    borderWidth: 0.7,
    borderStyle: 'solid',
    borderColor: '#DBA656',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    paddingHorizontal: 2,
    width: 23,
    height: 23,
    justifyContent: 'center',
  },
  text: {
    fontSize: 10,
  },
});

Vehicle.propTypes = {
  coordinates: PropTypes.exact({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
  line: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  brigade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Vehicle;
