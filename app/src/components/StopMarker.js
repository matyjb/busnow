import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {Marker, Callout} from 'react-native-maps';
import {GlobalContext} from '../contexts/GlobalContext';
import {Text} from 'native-base';
import {ThemeContext} from '../contexts/ThemeContext';
import icon_light from './../assets/icon_light.png';
import icon_dark from './../assets/icon_dark.png';
import icon_selected_light from './../assets/icon_selected_light.png';
import icon_selected_dark from './../assets/icon_selected_dark.png';

const StopMarker = props => {
  const {theme} = useContext(ThemeContext);
  const {selectMarker, selectedMarker} = useContext(GlobalContext);
  let icon;
  if (theme == 'dark') {
    if (selectedMarker == props.stop) icon = icon_selected_dark;
    else icon = icon_dark;
  } else {
    if (selectedMarker == props.stop) icon = icon_selected_light;
    else icon = icon_light;
  }
  return (
    <Marker
      style={props.style}
      coordinate={{
        latitude: props.stop.lat,
        longitude: props.stop.lon,
      }}
      image={icon}
      tracksViewChanges={false}
      onPress={() => selectMarker(props.stop)}
    >
      {/* workaround to hide callout */}
      <Callout tooltip>
        <Text></Text>
      </Callout>
    </Marker>
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
