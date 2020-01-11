import React, {PureComponent} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {ThemeConstants} from '../constants/ThemeConstants';
import {withThemeContext, ThemeContext} from '../contexts/ThemeContext';
import {Container, Tabs, Tab} from 'native-base';
import {withGlobalContext, GlobalContext} from '../contexts/GlobalContext';

export default class FavScreen extends PureComponent {
  static navigationOptions = ({screenProps}) => {
    let t = ThemeConstants[screenProps.theme];
    return {
      title: 'Ulubione',
      headerTintColor: 'white',
      headerStyle: {backgroundColor: t.headerColor},
    };
  };

  render() {
    return (
      <ThemeContext.Consumer>
        {({t}) => (
          <Container>
            <Tabs>
              <Tab
                heading="Linie"
                tabStyle={{backgroundColor: t.headerColor}}
                activeTabStyle={{backgroundColor: t.headerColor}}
                textStyle={{color: 'white'}}
              >
                <GlobalContext.Consumer>
                  {({favLines, toggleLine}) => <Text>tab1</Text>}
                </GlobalContext.Consumer>
              </Tab>
              <Tab
                heading="Przystanki"
                tabStyle={{backgroundColor: t.headerColor}}
                activeTabStyle={{backgroundColor: t.headerColor}}
                textStyle={{color: 'white'}}
              >
                <GlobalContext.Consumer>
                  {({favStops, toggleStopInFavs}) => <Text>tab2</Text>}
                </GlobalContext.Consumer>
              </Tab>
            </Tabs>
          </Container>
        )}
      </ThemeContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({});
