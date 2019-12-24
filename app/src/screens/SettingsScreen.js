import React, {Component} from 'react';
import {ThemeConstants} from '../constants/ThemeConstants';
import {Container, Button, Text, Content} from 'native-base';
import { ThemeContext } from '../contexts/ThemeContext';

class SettingsScreen extends React.Component {
  static navigationOptions = ({screenProps}) => {
    let t = ThemeConstants[screenProps.theme];

    return {
      title: 'Ustawienia',
      headerTintColor: 'white',
      headerStyle: {backgroundColor: t.headerColor},
    };
  };

  render() {
    return (
      <ThemeContext.Consumer>
        {({t, toggleTheme, theme}) => 
            <Container>
              <Content style={{backgroundColor: t.primaryColor}}>
                <Button onPress={() => toggleTheme()}>
                  <Text>
                    zmień motyw na {theme == 'dark' ? 'jasny' : 'ciemny'}
                  </Text>
                </Button>
              </Content>
            </Container>
        }
      </ThemeContext.Consumer>
    );
  }
}
// const styles = StyleSheet.create({});

export default SettingsScreen;
