import React from 'react';
import PropTypes from 'prop-types';
import {Marker, Callout} from 'react-native-maps';
import {BusTramApiContext} from '../contexts/BusTramApiContext';
import {Text, Icon} from 'native-base';
import {StyleSheet, View} from 'react-native';
import {ThemeContext} from '../contexts/ThemeContext';

const StopMarker = props => {
  return (
    <BusTramApiContext.Consumer>
      {({selectMarker}) => (
        <Marker
          style={props.style}
          coordinate={{latitude: props.stop.lat, longitude: props.stop.lon}}
          title={props.stop.name + ' ' + props.stop.nr}
          description={props.stop.unit}
          tracksViewChanges={false}
          onPress={() => selectMarker(props.stop)}
        >
          <ThemeContext.Consumer>
            {({t}) => (
              <View
                style={{
                  ...styles.container,
                  backgroundColor: t.stopBgColor,
                }}
              >
                <Icon
                  style={{...styles.icon, color: t.stopIconColor}}
                  name="bus"
                />
              </View>
            )}
          </ThemeContext.Consumer>
          {/* workaround to hide callout */}
          <Callout tooltip>
            <Text></Text>
          </Callout>
        </Marker>
      )}
    </BusTramApiContext.Consumer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    // borderRadius: 4,
    borderRadius: 5,
    borderWidth: 0.7,
    borderStyle: 'solid',
    borderColor: '#DBA656',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // paddingHorizontal: 2,
    width: 18,
    height: 18,
    justifyContent: 'center',
  },
  icon: {
    fontSize: 16,
    margin: 3,
  },
});

StopMarker.propTypes = {
  stop: PropTypes.shape({
    unit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    nr: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
  }).isRequired,
};
export default StopMarker;
