import React, {Component} from 'react';

export const MapContext = createContext();

export const withMapContext = Component => props => (
  <MapContext.Consumer>
    {context => <Component globalContext={context} {...props} />}
  </MapContext.Consumer>
);

// context only consumed by GMap
export default class MapContextProvider extends Component {
  state = {
    stopsInBounds: [],
    vehicles: [],
  };

  render() {
    var value = {
      ...this.state,
    };
    return (
      <ThemeContext.Provider value={value}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}
