import React, {Component} from 'react';
import {Text, StyleSheet, View, StatusBar, SafeAreaView} from 'react-native';
import GlobalContextProvider from './contexts/GlobalContext';
import {Root} from 'native-base';
import AppContainer from './AppContainer';
import ThemeContextProvider from './contexts/ThemeContext';

export default class App extends Component {
  render() {
    return (
      <Root>
        <GlobalContextProvider>
          <StatusBar hidden />
          <ThemeContextProvider>
            <AppContainer />
          </ThemeContextProvider>
        </GlobalContextProvider>
      </Root>
    );
  }
}

// const styles = StyleSheet.create({});
