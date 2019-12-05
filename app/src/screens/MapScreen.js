import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {Circle} from 'react-native-maps';
import {BusTramApiContext} from '../contexts/BusTramApiContext';
import Vehicle from '../components/Vehicle';
import {Fab, Icon, Button} from 'native-base';

class MapScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  render() {
    const initRegion = {
      latitude: 52.122801,
      longitude: 21.018324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };

    return (
      <BusTramApiContext.Consumer>
        {({vehicles, setMapRegion, radar}) => {
          return <>
            <View style={styles.container}>
              <MapView
                initialRegion={initRegion}
                showsCompass={true}
                rotateEnabled={false}
                style={{...StyleSheet.absoluteFillObject}}
                onRegionChangeComplete={setMapRegion}>
                {vehicles.map(v => (
                  <Vehicle
                    key={v.Lines + '-' + v.Brigade}
                    coordinates={{latitude: v.Lat, longitude: v.Lon}}
                    line={v.Lines}
                    brigade={v.Brigade}
                  />
                ))}
                {radar.isOn && (
                  <Circle
                    style={{zIndex: 999}}
                    center={radar.coordinates}
                    radius={radar.radiusKMs * 1000}
                    strokeWidth={1}
                    strokeColor={'#1a66ff'}
                    fillColor={'#1a66ff11'}
                  />
                )}
              </MapView>
            </View>
            <View style={{flex: 1}}>
              <Fab
                active={true}
                containerStyle={{}}
                style={{backgroundColor: '#5067FF'}}
                position="bottomRight"
                onPress={() => {}}>
                <Icon name="radar" type="MaterialCommunityIcons" />
                <Button style={{backgroundColor: '#34A34F', marginBottom: 14}}>
                  <Icon name="gps-fixed" type="MaterialIcons" />
                </Button>
                <Button
                  style={{backgroundColor: '#3B5998'}}
                  onPress={() => this.props.navigation.navigate('Settings')}>
                  <Icon name="md-menu" />
                </Button>
              </Fab>
            </View>
          </>;
        }}
      </BusTramApiContext.Consumer>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default MapScreen;
