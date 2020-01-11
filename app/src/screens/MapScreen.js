import React from 'react';
// import {StyleSheet} from 'react-native';
import GMap from '../components/GMap';
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
        <GMap />
        <InfoBox />
        <BottomModal />
        <FabMapScreen style={{elevation: 0}} />
      </>
    );
  }
}
// const styles = StyleSheet.create({});

export default MapScreen;
