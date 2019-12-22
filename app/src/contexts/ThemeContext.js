import React, { Component, createContext } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { ThemeConstants } from '../constants/ThemeConstants';

export const ThemeContext = createContext();

export default class ThemeContextProvider extends Component {
  state = {
    theme: 'light',
  };

  toggleTheme = () => {
    var newTheme = this.state.theme === 'light' ? 'dark' : 'light';
    this.setState({theme: newTheme});
    this._saveTheme(newTheme);
  };
  _saveTheme = async theme => {
    try {
      await AsyncStorage.setItem('@Settings:theme', theme);
    } catch (error) {
      console.log('error saving theme settings');
    }
  };
  _loadTheme = async () => {
    try {
      const value = await AsyncStorage.getItem('@Settings:theme');
      if (value !== null) {
        this.setState({theme: value});
      }
    } catch (error) {
      console.log('error loading theme settings');
    }
  };
  componentDidMount() {
    this._loadTheme();
  }

  render() {
    var value = {
      theme: this.state.theme, 
      toggleTheme: this.toggleTheme,
      t: ThemeConstants[this.state.theme]
    }
    return (
      <ThemeContext.Provider value={value}>
        {this.props.children}
      </ThemeContext.Provider>
    )
  }
}
