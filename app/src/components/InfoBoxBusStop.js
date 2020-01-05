import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {ThemeContext} from '../contexts/ThemeContext';
import {Icon, Button} from 'native-base';
import PropTypes from 'prop-types';
import LineTagRow from './LineTagRow';

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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View>
                <Text style={{...styles.mainText, color: t.textColor}}>
                  {selectedMarker.name} {selectedMarker.nr && selectedMarker.nr}
                </Text>
                <LineTagRow unit={selectedMarker.unit} nr={selectedMarker.nr} />
              </View>
              <View style={styles.favIconContainer}>
                <Button transparent>
                  <Icon
                    name="star"
                    style={{...styles.favIcon, color: t.accentColor}}
                    type="AntDesign"
                  />
                </Button>
              </View>
            </View>
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
    fontSize: 25,
    maxWidth: 240,
  },
  test: {},
  favIcon: {
    fontSize: 43,
  },
  favIconContainer: {
    padding: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

InfoBoxBusStop.propTypes = {
  selectedMarker: PropTypes.shape({
    name: PropTypes.string.isRequired,
    nr: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
  }).isRequired,
};
