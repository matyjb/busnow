import { createStackNavigator } from 'react-navigation-stack';
import MapScreen from './screens/MapScreen'
import ChooseLinesScreen from './screens/ChooseLinesScreen';

const AppNavigator = createStackNavigator({
  Map: {
    screen: MapScreen,
  },
  ChooseLines: {
    screen: ChooseLinesScreen,
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