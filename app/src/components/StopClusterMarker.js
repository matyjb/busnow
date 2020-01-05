import React from 'react';
import PropTypes from 'prop-types';
import {Marker, Callout} from 'react-native-maps';
import {BusTramApiContext} from '../contexts/BusTramApiContext';
import {Text} from 'native-base';
import {ThemeContext} from '../contexts/ThemeContext';
import icon_light_cluster from './../assets/icon_light_cluster.png';
import icon_dark_cluster from './../assets/icon_dark_cluster.png';

const StopClusterMarker = props => {
  return (
    <ThemeContext.Consumer>
      {({theme}) => (
        <BusTramApiContext.Consumer>
          {({fitMapToClasterStops}) => {
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
          }}
        </BusTramApiContext.Consumer>
      )}
    </ThemeContext.Consumer>
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
