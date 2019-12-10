import React, {Component} from 'react';
import {Text, StyleSheet, View, StatusBar, SafeAreaView} from 'react-native';
import BusTramApiContextProvider from './contexts/BusTramApiContext';
import {Root} from 'native-base';
import AppContainer from './AppContainer';

export default class App extends Component {
  render() {
    return (
      <Root>
        <BusTramApiContextProvider>
          <StatusBar hidden />
          <AppContainer/>
        </BusTramApiContextProvider>
      </Root>
    );
  }
}

// const styles = StyleSheet.create({});
