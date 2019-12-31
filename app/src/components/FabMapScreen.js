import React, {Component} from 'react';
import {View} from 'react-native';
import {Icon, Button, Fab} from 'native-base';

export default class FabMapScreen extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <Fab
          active={true}
          containerStyle={{}}
          style={{backgroundColor: '#5067FF'}}
          position="bottomRight"
          onPress={() => {}}
        >
          <Icon name="radar" type="MaterialCommunityIcons" />
          <Button style={{backgroundColor: '#34A34F', marginBottom: 14}}>
            <Icon name="gps-fixed" type="MaterialIcons" />
          </Button>
          <Button style={{backgroundColor: '#3B5998'}}>
            <Icon name="md-menu" />
          </Button>
        </Fab>
      </View>
    );
  }
}
