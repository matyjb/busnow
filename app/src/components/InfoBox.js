import React, {Component} from 'react';
// import {StyleSheet} from 'react-native';
import {withGlobalContext} from '../contexts/GlobalContext';
import InfoBoxBus from './InfoBoxBus';
import InfoBoxBusStop from './InfoBoxBusStop';

class InfoBox extends Component {
  render() {
    let {selectedMarker} = this.props.globalContext;
    return (
      selectedMarker &&
      (selectedMarker.Lines ? (
        <InfoBoxBus selectedMarker={selectedMarker} />
      ) : (
        <InfoBoxBusStop selectedMarker={selectedMarker} />
      ))
    );
  }
}

// const styles = StyleSheet.create({});

export default withGlobalContext(InfoBox);
