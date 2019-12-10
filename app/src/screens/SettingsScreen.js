import React, {Component} from 'react';
import {ThemeContext} from './../AppContainer';
import {ThemeConstants} from './../constants/ThemeConstants';
import {Container, Button, Text, Content} from 'native-base';

class SettingsScreen extends React.Component {
  static contextType = ThemeContext;
  static navigationOptions = ({screenProps}) => {
    let t = ThemeConstants[screenProps.theme];

    return {
      title: 'Ustawienia',
      headerTintColor: 'white',
      headerStyle: {backgroundColor: t.headerColor},
    };
  };

  render() {
    let t = ThemeConstants[this.context.theme];
    return (
      <Container>
        <Content style={{backgroundColor: t.primaryColor}}>
          <Button onPress={() => this.context.toggleTheme()}>
            <Text>
              zmień motyw na {this.context.theme == 'dark' ? 'jasny' : 'ciemny'}
            </Text>
          </Button>
        </Content>
      </Container>
    );
  }
}
// const styles = StyleSheet.create({});

export default SettingsScreen;
