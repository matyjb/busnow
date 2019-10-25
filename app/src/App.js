import React, { Component } from 'react'
import { Text, StyleSheet, View, StatusBar, SafeAreaView } from 'react-native'
import { createAppContainer } from 'react-navigation';
import AppNavigator from './AppNavigator';
import BusTramApiContextProvider from './contexts/BusTramApiContext';

const AppContainer = createAppContainer(AppNavigator);
export default class App extends Component {
  render() {
    return (
      <>
        <BusTramApiContextProvider>
          <StatusBar barStyle="dark-content" />
          <AppContainer />
        </BusTramApiContextProvider>
      </>
    )
  }
}

const styles = StyleSheet.create({})