import React from 'react';
import PropTypes from 'prop-types';
import {Marker, Callout} from 'react-native-maps';
import {BusTramApiContext} from '../contexts/BusTramApiContext';
import {Text} from 'native-base';
import {ThemeContext} from '../contexts/ThemeContext';
import icon_light from './../assets/icon_light.png';
import icon_dark from './../assets/icon_dark.png';

const StopMarker = props => {
  return (
    <ThemeContext.Consumer>
      {({theme}) => (
        <BusTramApiContext.Consumer>
          {({selectMarker}) => {
            let icon;
            if (theme == 'dark') icon = icon_dark;
            else icon = icon_light;

            // TODO: add selected or not
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
          }}
        </BusTramApiContext.Consumer>
      )}
    </ThemeContext.Consumer>
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
