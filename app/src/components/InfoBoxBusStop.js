import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {ThemeContext} from '../contexts/ThemeContext';
import {Icon, Button} from 'native-base';
import PropTypes from 'prop-types';

export default class InfoBoxBusStop extends Component {
  render() {
    const {selectedMarker} = this.props;
    return (
      <ThemeContext.Consumer>
        {({t}) => (
          <View
            style={{
              ...styles.container,
              backgroundColor: t.primaryColor,
            }}
          >
            <Text style={{...styles.mainText, color: t.textColor}}>
              {selectedMarker.name} {selectedMarker.nr && selectedMarker.nr}
            </Text>
            <View></View>
          </View>
        )}
      </ThemeContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 4,
    padding: 10,
  },
  mainText: {
    fontSize: 32,
  },
  test: {},
  favIcon: {
    fontSize: 43,
  },
  favIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

InfoBoxBusStop.propTypes = {
  selectedMarker: PropTypes.shape({
    name: PropTypes.string.isRequired,
    nr: PropTypes.string.isRequired,
  }).isRequired,
};
