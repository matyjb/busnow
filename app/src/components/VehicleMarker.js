import React, {Component} from 'react';
import {Text, StyleSheet, View, Dimensions} from 'react-native';
import {AnimatedRegion, Marker} from 'react-native-maps';
import PropTypes from 'prop-types';

import {withThemeContext} from '../contexts/ThemeContext';
import {withGlobalContext} from '../contexts/GlobalContext';

const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class VehicleMarker extends Component {
  state = {
    coordinate: new AnimatedRegion({
      latitude: this.props.vehicle.Lat,
      longitude: this.props.vehicle.Lon,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
  };
  animate(newCoordinate) {
    const coordinate = {
      latitude: this.props.vehicle.Lat,
      longitude: this.props.vehicle.Lon,
    };

    if (Platform.OS === 'android') {
      if (this.marker) {
        this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
      }
    } else {
      coordinate.timing(newCoordinate).start();
    }
  }

  componentDidUpdate() {
    const coordinate = {
      latitude: this.props.vehicle.Lat,
      longitude: this.props.vehicle.Lon,
    };
    this.animate(coordinate);
  }
  render() {
    let {selectMarker, favLines} = this.props.globalContext;
    let {t} = this.props.themeContext;
    let isFav = favLines.find(e => e == this.props.vehicle.Lines) !== undefined;

    return (
      <Marker.Animated
        style={this.props.style}
        ref={marker => {
          this.marker = marker;
        }}
        coordinate={this.state.coordinate}
        tracksViewChanges={false}
        onPress={() => selectMarker(this.props.vehicle)}
      >
        <View
          style={{
            ...styles.container,
            borderWidth: isFav ? 1.4 : 0.7,
            backgroundColor: t.vehicleBgColor,
          }}
        >
          <Text style={{...styles.text, color: t.textColor}}>
            {this.props.vehicle.Lines}
          </Text>
        </View>
      </Marker.Animated>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    // borderRadius: 4,
    borderRadius: 40,
    borderStyle: 'solid',
    borderColor: '#DBA656',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    paddingHorizontal: 2,
    width: 26,
    height: 25,
    justifyContent: 'center',
  },
  text: {
    fontSize: 10,
    textAlign: 'center',
  },
});

VehicleMarker.propTypes = {
  // coordinates: PropTypes.exact({
  //   latitude: PropTypes.number,
  //   longitude: PropTypes.number,
  // }),
  // line: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  // brigade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  vehicle: PropTypes.shape({
    Lines: PropTypes.string,
    Lat: PropTypes.number,
    Lon: PropTypes.number,
    VehicleNumber: PropTypes.string,
    Time: PropTypes.string,
    Brigade: PropTypes.string,
  }).isRequired,
};

export default withThemeContext(withGlobalContext(VehicleMarker));
