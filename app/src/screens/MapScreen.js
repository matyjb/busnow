import React, { useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import MapView, { Circle } from 'react-native-maps';
import {BusTramApiContext} from '../contexts/BusTramApiContext'
import Vehicle from '../components/Vehicle';
import FooterControlPanel from '../components/FooterControlPanel';

const MapScreen = () => {
  const {vehicles, setMapRegion, radar} = useContext(BusTramApiContext);
  const initRegion = {
    latitude: 52.122801,
    longitude: 21.018324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }
  
  return (
    <View style={styles.container}>
      <MapView
        initialRegion={initRegion}
        showsCompass={true}
        rotateEnabled={false}
        style={{...StyleSheet.absoluteFillObject}}
        onRegionChangeComplete={setMapRegion}
      >
        {vehicles.map((v) => (
          <Vehicle
            key={v.Lines + "-" + v.Brigade}
            coordinates={{"latitude": v.Lat, "longitude": v.Lon}}
            line={v.Lines}
            brigade={v.Brigade}
          />
          ))}
          {radar.isOn &&
            <Circle
              style={{zIndex: 999}}
              center = {radar.coordinates }
              radius = { radar.radiusKMs *1000 }
              strokeWidth = { 1 }
              strokeColor = { '#1a66ff' }
              fillColor = { '#1a66ff11' }
            />
          }
      </MapView>
      <FooterControlPanel/>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
})

export default MapScreen;
