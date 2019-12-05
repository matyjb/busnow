import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {Circle} from 'react-native-maps';
import {BusTramApiContext} from '../contexts/BusTramApiContext';
import Vehicle from '../components/Vehicle';
import {Fab, Icon, Button, Drawer, Text} from 'native-base';
import {withTheme} from './../theming';

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
        {({vehicles, setMapRegion, radar, toggleRadar}) => {
          return (
            <>
              <View style={styles.container}>
                <MapView
                  customMapStyle={this.props.theme.mapStyle}
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
                      strokeColor={this.props.theme.radarStrokeColor}
                      fillColor={this.props.theme.radarFillColor}
                    />
                  )}
                </MapView>
              </View>
              <View style={{flex: 1}}>
                <Fab
                  active={true}
                  containerStyle={{}}
                  style={{backgroundColor: this.props.theme.accentColor}}
                  position="bottomRight"
                  onPress={() => toggleRadar()}>
                  <Icon
                    name="radar"
                    type="MaterialCommunityIcons"
                    style={{color: this.props.theme.primaryColor}}
                  />
                  <Button
                    style={{
                      backgroundColor: this.props.theme.accentColor,
                      marginBottom: 14,
                    }}>
                    <Icon
                      name="gps-fixed"
                      type="MaterialIcons"
                      style={{color: this.props.theme.primaryColor}}
                    />
                  </Button>
                  <Button
                    style={{backgroundColor: this.props.theme.accentColor}}
                    onPress={() => this.props.navigation.navigate('Settings')}>
                    <Icon
                      name="md-menu"
                      style={{color: this.props.theme.primaryColor}}
                    />
                  </Button>
                  <Button
                    style={{backgroundColor: this.props.theme.accentColor}}
                    onPress={() => this.openDrawer()}>
                    <Icon
                      name="md-menu"
                      style={{color: this.props.theme.primaryColor}}
                    />
                  </Button>
                </Fab>
              </View>
            </>
          );
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

export default withTheme(MapScreen);
