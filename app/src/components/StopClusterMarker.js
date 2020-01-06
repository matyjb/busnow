import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {Marker, Callout} from 'react-native-maps';
import {GlobalContext} from '../contexts/GlobalContext';
import {Text} from 'native-base';
import {ThemeContext} from '../contexts/ThemeContext';
import icon_light_cluster from './../assets/icon_light_cluster.png';
import icon_dark_cluster from './../assets/icon_dark_cluster.png';

const StopClusterMarker = props => {
  const {theme} = useContext(ThemeContext);
  const {fitMapToClasterStops} = useContext(GlobalContext);
  let icon;
  if (theme == 'dark') icon = icon_dark_cluster;
  else icon = icon_light_cluster;
  return (
    <Marker
      style={props.style}
      coordinate={{
        latitude: props.cluster.lat,
        longitude: props.cluster.lon,
      }}
      image={icon}
      tracksViewChanges={false}
      onPress={() => fitMapToClasterStops(props.cluster)}
    >
      {/* workaround to hide callout */}
      <Callout tooltip>
        <Text></Text>
      </Callout>
    </Marker>
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
