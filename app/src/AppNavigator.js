import { createStackNavigator } from 'react-navigation-stack';
import MapScreen from './screens/MapScreen'

const AppNavigator = createStackNavigator({
  Map: {
    screen: MapScreen,
  },
},{
  initialRouteName: 'Map',
  defaultNavigationOptions: {
    header: null,
    headerStyle: {
      backgroundColor: '#f4511e',
    },
  },
});

export default AppNavigator;