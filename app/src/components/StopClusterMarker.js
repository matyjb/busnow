import React from 'react';
import PropTypes from 'prop-types';
import {Marker, Callout, CalloutSubview} from 'react-native-maps';
import {BusTramApiContext} from '../contexts/BusTramApiContext';
import {View, Text} from 'native-base';

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
          {/* workaround to hide callout */}
          <Callout tooltip>
            <Text></Text>
          </Callout>
        </Marker>
      )}
    </BusTramApiContext.Consumer>
  );
};

StopClusterMarker.propTypes = {
  cluster: PropTypes.shape({
    unit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
  }).isRequired,
};
export default StopClusterMarker;
