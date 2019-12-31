import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {ThemeContext} from '../contexts/ThemeContext';
import {BusTramApiContext} from '../contexts/BusTramApiContext';
import MapView, {Circle, Marker} from 'react-native-maps';
import Vehicle from './Vehicle';
import WarsawApi from '../WarsawApi';

export default class Map extends Component {
  state = {
    stops: [],
    mapBoundaries: null,
  };

  async componentDidMount() {
    let stops = await WarsawApi.getStops();
    console.log('got all stops');

    this.setState({stops: stops});
  }

  async onRegionChangeComplete() {
    this.setState({
      mapBoundaries: await this.map.getMapBoundaries(),
    });
  }

  getStopsMarkers() {
    if (this.state.mapBoundaries) {
      // bounding box
      let late = this.state.mapBoundaries.northEast.latitude;
      let lats = this.state.mapBoundaries.southWest.latitude;
      let lone = this.state.mapBoundaries.northEast.longitude;
      let lons = this.state.mapBoundaries.southWest.longitude;
      let latdiff = late - lats;
      let londiff = lone - lons;
      late += latdiff / 3;
      lats -= latdiff / 3;
      lone += londiff / 3;
      lons -= londiff / 3;
      //

      let stopsMarkersVisible = this.state.stops.filter(e => {
        if (lons < e.lon && e.lon < lone && lats < e.lat && e.lat < late)
          return true;
        return false;
      });
      if (stopsMarkersVisible.length == 0) return [];

      let output = [];
      console.log(latdiff);
      if (latdiff < 0.013) {
        // no clustering
        output = stopsMarkersVisible;
      } else if (latdiff < 0.04) {
        // clustering
        let grouped = stopsMarkersVisible.reduce((rv, x) => {
          let v = x.unit;
          let el = rv.find(r => r && r.unit === v);
          if (el) {
            el.values.push(x);
          } else {
            rv.push({unit: v, values: [x]});
          }
          return rv;
        }, []);

        output = grouped.map(unit => {
          let l = unit.values.reduce(
            (a, x) => {
              return {sumlat: a.sumlat + x.lat, sumlon: a.sumlon + x.lon};
            },
            {sumlat: 0, sumlon: 0}
          );
          return {
            ...unit.values[0],
            lat: l.sumlat / unit.values.length,
            lon: l.sumlon / unit.values.length,
          };
        });
      } else {
        return [];
      }

      console.log('markery', output.length);
      return output.map(stop => {
        let c = {latitude: stop.lat, longitude: stop.lon};
        return (
          <Marker
            key={stop.unit + ':' + stop.nr}
            coordinate={c}
            title={stop.name + ' ' + stop.nr}
            description={stop.unit}
          />
        );
      });
    } else {
      return [];
    }
  }

  render() {
    const initRegion = {
      latitude: 52.122801,
      longitude: 21.018324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    return (
      <ThemeContext.Consumer>
        {({t}) => (
          <BusTramApiContext.Consumer>
            {({vehicles, setMapRegion, radar}) => (
              <View style={styles.container}>
                <MapView
                  ref={ref => {
                    this.map = ref;
                  }}
                  customMapStyle={t.mapStyle}
                  initialRegion={initRegion}
                  showsCompass={true}
                  rotateEnabled={false}
                  style={{...StyleSheet.absoluteFillObject}}
                  onRegionChangeComplete={nr => {
                    setMapRegion(nr);
                    this.onRegionChangeComplete();
                  }}
                >
                  {vehicles.map(v => (
                    <Vehicle
                      key={v.Lines + '-' + v.Brigade}
                      coordinates={{latitude: v.Lat, longitude: v.Lon}}
                      line={v.Lines}
                      brigade={v.Brigade}
                    />
                  ))}
                  {this.getStopsMarkers()}
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
            )}
          </BusTramApiContext.Consumer>
        )}
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
