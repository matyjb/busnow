import React from 'react';
import PropTypes from 'prop-types';
import {Marker} from 'react-native-maps';

const StopClusterMarker = props => {
  return (
    <Marker
      style={props.style}
      key={props.cluster.unit}
      coordinate={{latitude: props.cluster.lat, longitude: props.cluster.lon}}
      title={props.cluster.name}
      description={props.cluster.unit}
    />
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
