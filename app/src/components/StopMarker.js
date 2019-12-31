import React from 'react';
import PropTypes from 'prop-types';
import {Marker} from 'react-native-maps';

const StopMarker = props => {
  return (
    <Marker
      style={props.style}
      key={props.stop.unit + ':' + props.stop.nr}
      coordinate={{latitude: props.stop.lat, longitude: props.stop.lon}}
      title={props.stop.name + ' ' + props.stop.nr}
      description={props.stop.unit}
    />
  );
};

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
