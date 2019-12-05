import { createStackNavigator } from 'react-navigation-stack';
import React, {Component} from 'react';
import MapScreen from './screens/MapScreen';
import SettingsScreen from './screens/SettingsScreen';

const AppNavigator = screenProps => {
  return createStackNavigator({
  Map: {
    screen: MapScreen,
  },
  Settings: {
    screen: props => <SettingsScreen {...props} {...screenProps}/>,
  }
},{
  initialRouteName: 'Map',
  defaultNavigationOptions: {
    header: null,
    headerStyle: {
      backgroundColor: '#f4511e',
    },
  },
});
}
export default AppNavigator;