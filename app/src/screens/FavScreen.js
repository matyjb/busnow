import React, {PureComponent} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {ThemeConstants} from '../constants/ThemeConstants';
import {withThemeContext, ThemeContext} from '../contexts/ThemeContext';
import {Container, Tabs, Tab, Button, Icon} from 'native-base';
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
            <Tabs style={{backgroundColor: t.primaryColor}}>
              <Tab
                heading="Linie"
                tabStyle={{backgroundColor: t.headerColor}}
                activeTabStyle={{backgroundColor: t.headerColor}}
                textStyle={{color: 'white'}}
              >
                <GlobalContext.Consumer>
                  {({favLines, toggleLine}) => (
                    <View style={{flex: 1, backgroundColor: t.primaryColor}}>
                      {favLines.map((l, i) => (
                        <View key={i} style={styles.item}>
                          <Text
                            style={{...styles.itemText, color: t.textColor}}
                          >
                            {l}
                          </Text>
                          <Button onPress={() => toggleLine(l)} transparent>
                            <Icon
                              name="circle-with-minus"
                              type="Entypo"
                              style={styles.itemButton}
                            />
                          </Button>
                        </View>
                      ))}
                    </View>
                  )}
                </GlobalContext.Consumer>
              </Tab>
              <Tab
                heading="Przystanki"
                tabStyle={{backgroundColor: t.headerColor}}
                activeTabStyle={{backgroundColor: t.headerColor}}
                textStyle={{color: 'white'}}
              >
                <GlobalContext.Consumer>
                  {({favStops, toggleStopInFavs}) => (
                    <View style={{flex: 1, backgroundColor: t.primaryColor}}>
                      {favStops.map((s, i) => (
                        <View key={i} style={styles.item}>
                          <Text
                            style={{...styles.itemText, color: t.textColor}}
                          >
                            {s.name + ' ' + s.nr}
                          </Text>
                          <Button
                            onPress={() => toggleStopInFavs(s)}
                            transparent
                          >
                            <Icon
                              name="circle-with-minus"
                              type="Entypo"
                              style={styles.itemButton}
                            />
                          </Button>
                        </View>
                      ))}
                    </View>
                  )}
                </GlobalContext.Consumer>
              </Tab>
            </Tabs>
          </Container>
        )}
      </ThemeContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 2,
  },
  itemText: {
    alignSelf: 'center',
    fontSize: 25,
  },
  itemButton: {
    color: 'red',
  },
});
