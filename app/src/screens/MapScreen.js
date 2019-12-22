import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {Circle} from 'react-native-maps';
import {BusTramApiContext} from '../contexts/BusTramApiContext';
import Vehicle from '../components/Vehicle';
import {Fab, Icon, Button, Text} from 'native-base';
import Modal from 'react-native-modalbox';

import {ThemeContext} from '../contexts/ThemeContext';
import {ThemeConstants} from './../constants/ThemeConstants';

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
      <ThemeContext.Consumer>
        {({t}) => 
            <BusTramApiContext.Consumer>
              {({vehicles, setMapRegion, radar, toggleRadar}) => {
                return (
                  <>
                    <View style={styles.container}>
                      <MapView
                        customMapStyle={t.mapStyle}
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
                            strokeColor={t.radarStrokeColor}
                            fillColor={t.radarFillColor}
                          />
                        )}
                      </MapView>
                    </View>
                    <Fab
                      active={true}
                      containerStyle={{}}
                      style={{backgroundColor: t.accentColor}}
                      position="bottomRight"
                      onPress={() => toggleRadar()}>
                      <Icon
                        name="radar"
                        type="MaterialCommunityIcons"
                        style={{color: t.primaryColor}}
                      />
                      <Button
                        style={{
                          backgroundColor: t.accentColor,
                          marginBottom: 14,
                        }}>
                        <Icon
                          name="gps-fixed"
                          type="MaterialIcons"
                          style={{color: t.primaryColor}}
                        />
                      </Button>
                      <Button
                        style={{backgroundColor: t.accentColor}}
                        onPress={() =>
                          this.props.navigation.navigate('Settings')
                        }>
                        <Icon
                          name="md-settings"
                          style={{color: t.primaryColor}}
                        />
                      </Button>
                      <Button
                        style={{backgroundColor: t.accentColor}}
                        onPress={() => this._modal.open()}>
                        <Icon name="md-menu" style={{color: t.primaryColor}} />
                      </Button>
                    </Fab>
                    <Modal
                      style={{height: 300, zIndex: 1}}
                      position={'bottom'}
                      backButtonClose
                      ref={ref => {
                        this._modal = ref;
                      }}>
                      <Text>Modal on bottom with backdrop</Text>
                    </Modal>
                  </>
                );
              }}
            </BusTramApiContext.Consumer>
        }
      </ThemeContext.Consumer>
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
