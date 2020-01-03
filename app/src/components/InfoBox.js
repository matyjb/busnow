import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {BusTramApiContext} from '../contexts/BusTramApiContext';
import InfoBoxBus from './InfoBoxBus';
import InfoBoxBusStop from './InfoBoxBusStop';

export default class InfoBox extends Component {
  render() {
    return (
      <BusTramApiContext.Consumer>
        {({selectedMarker}) =>
          selectedMarker &&
          (selectedMarker.Lines ? (
            <InfoBoxBus selectedMarker={selectedMarker} />
          ) : (
            <InfoBoxBusStop selectedMarker={selectedMarker} />
          ))
        }
      </BusTramApiContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({});
