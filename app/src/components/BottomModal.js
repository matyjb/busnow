import React, {Component} from 'react';
import {Text, StyleSheet} from 'react-native';
import Modal from 'react-native-modalbox';
import {withThemeContext} from '../contexts/ThemeContext';
import {Button, Icon, View} from 'native-base';
import {withNavigation} from 'react-navigation';
import {withGlobalContext} from '../contexts/GlobalContext';
import {FlatList} from 'react-native-gesture-handler';

class BottomModal extends Component {
  render() {
    let {t} = this.props.themeContext;
    let {favStops, navigateToMarkerAndSelect} = this.props.globalContext;
    return (
      <Modal
        style={{
          ...this.props.style,
          ...styles.container,
          backgroundColor: t.primaryColor,
        }}
        position={'bottom'}
        backButtonClose
        ref={r => {
          this.props._modalref(r);
          this._modal = r;
        }}
        swipeArea={styles.iconsContainer.height}
      >
        <View style={styles.iconsContainer}>
          <Button
            transparent
            onPress={() => this.props.navigation.navigate('Settings')}
          >
            <Icon
              style={styles.icon}
              name="md-settings"
              style={{color: t.accentColor}}
            />
          </Button>
          <Button transparent onPress={() => {}}>
            <Icon
              style={styles.icon}
              name="star"
              style={{color: t.accentColor}}
              type="AntDesign"
            />
          </Button>
        </View>
        <View style={{backgroundColor: t.accentColor, height: 2}} />
        <View style={{paddingHorizontal: 10}}>
          <FlatList
            style={{
              height: styles.container.height - styles.iconsContainer.height,
            }}
            data={favStops}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({item}) => (
              <FlatListItem
                item={item}
                t={t}
                onPress={() => {
                  this._modal.close();
                  navigateToMarkerAndSelect(item);
                }}
              />
            )}
            ListHeaderComponent={() => <View style={{height: 10}} />}
            ListFooterComponent={() => <View style={{height: 10}} />}
            ItemSeparatorComponent={() => <View style={{height: 10}} />}
            ListEmptyComponent={() => (
              <Text
                style={{
                  color: t.textColor,
                  padding: 10,
                  textAlign: 'center',
                }}
              >
                Dodaj pare przystanków do ulubionych by je tutaj zobaczyć
              </Text>
            )}
          />
        </View>
      </Modal>
    );
  }
}

class FlatListItem extends React.PureComponent {
  render() {
    let {t, item, onPress} = this.props;
    return (
      <Button
        iconLeft
        transparent
        onPress={onPress}
        style={{justifyContent: 'flex-start', height: 40}}
      >
        <Icon
          style={{...styles.stopIcon, color: t.textColor}}
          name="ios-arrow-forward"
          type="Ionicons"
        />
        <Text style={{...styles.stopText, color: t.textColor}}>
          {item.name} {item.nr}
        </Text>
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 300,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignContent: 'space-between',
    height: 50,
  },
  icon: {
    fontSize: 40,
  },
  stopIcon: {
    paddingRight: 10,
  },
  stopText: {
    // paddingBottom: 5,
    fontSize: 20,
  },
});

export default withNavigation(withThemeContext(withGlobalContext(BottomModal)));
