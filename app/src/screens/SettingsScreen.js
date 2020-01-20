import React, {Component} from 'react';
import {ThemeConstants} from '../constants/ThemeConstants';
import {Container, Button, Text, Content, View} from 'native-base';
import {ThemeContext} from '../contexts/ThemeContext';
import {GlobalContext} from '../contexts/GlobalContext';
import {ActivityIndicator, StyleSheet} from 'react-native';

class SettingsScreen extends Component {
  static navigationOptions = ({screenProps}) => {
    let t = ThemeConstants[screenProps.theme];

    return {
      title: 'Ustawienia',
      headerTintColor: 'white',
      headerStyle: {backgroundColor: t.headerColor},
    };
  };
  state = {
    isDownloadingStops: false,
  };

  render() {
    return (
      <ThemeContext.Consumer>
        {({t, toggleTheme, theme}) => (
          <Container style={{padding: 10, backgroundColor: t.primaryColor}}>
            <Content>
              <Button
                onPress={() => toggleTheme()}
                style={{
                  ...styles.button,
                  backgroundColor: t.accentColor,
                }}
              >
                <Text style={{color: t.textColor}}>
                  zmień motyw na {theme == 'dark' ? 'jasny' : 'ciemny'}
                </Text>
              </Button>
              <GlobalContext.Consumer>
                {({downloadAllStops}) => (
                  <Button
                    onPress={() => {
                      this.setState({isDownloadingStops: true}, () =>
                        downloadAllStops().then(() =>
                          this.setState({isDownloadingStops: false})
                        )
                      );
                    }}
                    style={{
                      ...styles.button,
                      backgroundColor: t.accentColor,
                    }}
                  >
                    {this.state.isDownloadingStops ? (
                      <ActivityIndicator size="small" color={t.textColor} />
                    ) : (
                      <Text style={{color: t.textColor}}>
                        pobierz przystanki
                      </Text>
                    )}
                  </Button>
                )}
              </GlobalContext.Consumer>
              <View
                style={{
                  height: 2,
                  backgroundColor: t.accentColor,
                  marginVertical: 10,
                }}
              />
              <Text
                style={{
                  color: t.textColor,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 20,
                  marginBottom: 20,
                }}
              >
                O aplikacji
              </Text>
              <Text style={{color: t.textColor, textAlign: 'center'}}>
                Twórca: Bartosz Matyjasiak
              </Text>
              <Text style={{color: t.textColor, textAlign: 'center'}}>
                Aplikacja stworzona jako praca inzynierska w Szkole Głównej
                Gospodarstwa Wiejskiego w Warszawie.
              </Text>
            </Content>
          </Container>
        )}
      </ThemeContext.Consumer>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    margin: 5,
  },
});

export default SettingsScreen;
