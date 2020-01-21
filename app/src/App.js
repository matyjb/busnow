import React, {Component} from 'react';
import {StatusBar} from 'react-native';
import GlobalContextProvider from './contexts/GlobalContext';
import {Root} from 'native-base';
import AppContainer from './AppContainer';
import ThemeContextProvider, {ThemeContext} from './contexts/ThemeContext';

export default class App extends Component {
  render() {
    return (
      <Root>
        <GlobalContextProvider>
          <ThemeContextProvider>
            <ThemeContext.Consumer>
              {({t, theme}) => (
                <StatusBar
                  backgroundColor={t.headerColor}
                  barStyle={theme == 'dark' ? 'light-content' : 'dark-content'}
                />
              )}
            </ThemeContext.Consumer>
            <AppContainer />
          </ThemeContextProvider>
        </GlobalContextProvider>
      </Root>
    );
  }
}

// const styles = StyleSheet.create({});
