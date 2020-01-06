import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {GlobalContext} from '../contexts/GlobalContext';
import InfoBoxBus from './InfoBoxBus';
import InfoBoxBusStop from './InfoBoxBusStop';

export default class InfoBox extends Component {
  render() {
    return (
      <GlobalContext.Consumer>
        {({selectedMarker}) =>
          selectedMarker &&
          (selectedMarker.Lines ? (
            <InfoBoxBus selectedMarker={selectedMarker} />
          ) : (
            <InfoBoxBusStop selectedMarker={selectedMarker} />
          ))
        }
      </GlobalContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({});
