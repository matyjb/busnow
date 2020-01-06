import React from 'react';
// import {StyleSheet} from 'react-native';
import Map from '../components/Map';
import FabMapScreen from '../components/FabMapScreen';
import BottomModal from '../components/BottomModal';
import InfoBox from '../components/InfoBox';

class MapScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <>
        <Map />
        <InfoBox />
        <BottomModal
          _modalref={ref => {
            this._modal = ref;
          }}
        />
        <FabMapScreen style={{elevation: 0}} modalref={this._modal} />
      </>
    );
  }
}
// const styles = StyleSheet.create({});

export default MapScreen;
