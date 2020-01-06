import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {ThemeContext} from '../contexts/ThemeContext';
import {Icon, Button} from 'native-base';
import PropTypes from 'prop-types';
import LineTagRow from './LineTagRow';
import {GlobalContext} from '../contexts/GlobalContext';

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
              <GlobalContext.Consumer>
                {({toggleStopInFavs, favStops}) => {
                  let f = favStops.find(e => {
                    return (
                      e.unit == selectedMarker.unit && e.nr == selectedMarker.nr
                    );
                  });
                  return (
                    <View style={styles.favIconContainer}>
                      <Button
                        transparent
                        onPress={() => toggleStopInFavs(selectedMarker)}
                      >
                        <Icon
                          name={f ? 'star' : 'staro'}
                          style={{...styles.favIcon, color: t.accentColor}}
                          type="AntDesign"
                        />
                      </Button>
                    </View>
                  );
                }}
              </GlobalContext.Consumer>
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
