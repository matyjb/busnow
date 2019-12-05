import React, {Component} from 'react';
import {ThemeProvider} from './theming';
import {Text, StyleSheet, View, StatusBar, SafeAreaView} from 'react-native';
import {createAppContainer} from 'react-navigation';
import AppNavigator from './AppNavigator';
import {themes} from './theming';
import BusTramApiContextProvider from './contexts/BusTramApiContext';
import {Root} from 'native-base';

const AppContainer = props => {
  const AppContainer = createAppContainer(AppNavigator(props));
  return <AppContainer />;
};
// const AppContainer = props => createAppContainer(AppNavigator(props));
export default class App extends Component {
  state = {
    theme: themes.default,
  };
  handleThemeChange = themeName => {
    this.setState({theme: themes[themeName]});
  };
  render() {
    return (
      <Root>
        <BusTramApiContextProvider>
          <StatusBar hidden />
          <ThemeProvider theme={this.state.theme}>
            <AppContainer handleThemeChange={this.handleThemeChange} />
          </ThemeProvider>
        </BusTramApiContextProvider>
      </Root>
    );
  }
}

const styles = StyleSheet.create({});
