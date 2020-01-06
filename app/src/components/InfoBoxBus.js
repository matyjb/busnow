import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {withThemeContext} from '../contexts/ThemeContext';
import {Icon, Button} from 'native-base';
import PropTypes from 'prop-types';
import SecondsSinceTime from './SecondsSinceTime';
import {GlobalContext} from '../contexts/GlobalContext';

class InfoBoxBus extends Component {
  render() {
    const {selectedMarker} = this.props;
    const {t} = this.props.themeContext;
    return (
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
          <GlobalContext.Consumer>
            {({toggleLine, favLines}) => {
              let f = favLines.find(e => {
                return e == selectedMarker.Lines;
              });
              return (
                <View style={styles.favIconContainer}>
                  <Button
                    transparent
                    onPress={() => toggleLine(selectedMarker.Lines)}
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
export default withThemeContext(InfoBoxBus);
