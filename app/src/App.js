import React, {Component} from 'react';
import {Text, StyleSheet, View, StatusBar, SafeAreaView} from 'react-native';
import BusTramApiContextProvider from './contexts/BusTramApiContext';
import {Root} from 'native-base';
import AppContainer from './AppContainer';
import ThemeContextProvider from './contexts/ThemeContext';

export default class App extends Component {
  render() {
    return (
      <Root>
        <BusTramApiContextProvider>
          <StatusBar hidden />
          <ThemeContextProvider>
            <AppContainer />
          </ThemeContextProvider>
        </BusTramApiContextProvider>
      </Root>
    );
  }
}

// const styles = StyleSheet.create({});
