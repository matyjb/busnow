import React from 'react';
import PropTypes from 'prop-types';
import {Marker, Callout} from 'react-native-maps';
import {BusTramApiContext} from '../contexts/BusTramApiContext';
import {Text, Icon} from 'native-base';
import {StyleSheet, View} from 'react-native';
import {ThemeContext} from '../contexts/ThemeContext';

const StopClusterMarker = props => {
  return (
    <BusTramApiContext.Consumer>
      {({fitMapToClasterStops}) => (
        <Marker
          style={props.style}
          coordinate={{
            latitude: props.cluster.lat,
            longitude: props.cluster.lon,
          }}
          title={props.cluster.name}
          description={props.cluster.unit}
          tracksViewChanges={false}
          onPress={() => fitMapToClasterStops(props.cluster)}
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
    width: 22,
    height: 22,
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    margin: 3.5,
  },
});

StopClusterMarker.propTypes = {
  cluster: PropTypes.shape({
    unit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
  }).isRequired,
};
export default StopClusterMarker;
