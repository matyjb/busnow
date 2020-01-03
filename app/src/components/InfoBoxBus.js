import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {ThemeContext} from '../contexts/ThemeContext';
import {Icon, Button} from 'native-base';
import PropTypes from 'prop-types';
import SecondsSinceTime from './SecondsSinceTime';

export default class InfoBoxBus extends Component {
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
                  {selectedMarker.Lines}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                  }}
                >
                  <SecondsSinceTime
                    style={{...styles.text, color: t.textColor}}
                    time={selectedMarker.Time}
                  />
                  <Text style={{...styles.text, color: t.textColor}}>
                    {' '}
                    sekund temu
                  </Text>
                </View>
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

InfoBoxBus.propTypes = {
  selectedMarker: PropTypes.shape({
    Lines: PropTypes.string.isRequired,
    Time: PropTypes.string.isRequired,
  }).isRequired,
};
