import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import MapView from 'react-native-maps';

export default class MapScreen extends Component {
  state = {
    region: {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text> this is map screen </Text>
        <MapView
          initialRegion={this.state.region}
          showsCompass={true}
          rotateEnabled={true}
          style={{...StyleSheet.absoluteFillObject}}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',

    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
})
