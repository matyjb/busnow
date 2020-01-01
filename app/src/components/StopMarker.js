import React from 'react';
import PropTypes from 'prop-types';
import {Marker, Callout} from 'react-native-maps';
import {BusTramApiContext} from '../contexts/BusTramApiContext';
import {Text} from 'native-base';

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
          {/* workaround to hide callout */}
          <Callout tooltip>
            <Text></Text>
          </Callout>
        </Marker>
      )}
    </BusTramApiContext.Consumer>
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
