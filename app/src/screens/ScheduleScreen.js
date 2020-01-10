import React, {Component, PureComponent} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {ThemeConstants} from '../constants/ThemeConstants';
import {ThemeContext} from '../contexts/ThemeContext';
import {Container, Content} from 'native-base';
import {FlatList} from 'react-native-gesture-handler';
import TimesList from '../components/TimesList';
var moment = require('moment');

export default class ScheduleScreen extends Component {
  static navigationOptions = ({screenProps, navigation}) => {
    let t = ThemeConstants[screenProps.theme];
    let stop = navigation.getParam('stop', null);
    return {
      title: stop ? stop.name + ' ' + stop.nr : 'error',
      headerTintColor: 'white',
      headerStyle: {backgroundColor: t.headerColor},
    };
  };
  state = {
    lines: [],
  };
  componentDidMount() {
    let lines = this.props.navigation.getParam('lines', []);
    this.setState({lines: lines});

    this.interval = setInterval(this._updateLeavingTimes, 60000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  _updateLeavingTimes = () => {
    let l = [...this.state.lines];
    let currentTime = moment();
    for (let i = 0; i < l.length; i++) {
      for (let j = 0; j < l[i].timetable.length; j++) {
        let d = moment
          .duration(l[i].timetable[j].time.diff(currentTime))
          .asMinutes();
        if (d < 0) continue;
        else {
          l[i].timetableIndex = i;
          l[i].leavesIn = d;
          break;
        }
      }
    }
    this.setState({lines: l});
  };

  render() {
    return (
      <ThemeContext.Consumer>
        {({t}) => (
          <Container>
            <View style={{backgroundColor: t.primaryColor, flex: 1}}>
              <FlatList
                data={this.state.lines}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({item}) => (
                  <View style={styles.listItem}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                      }}
                    >
                      <LineName t={t} line={item.line} isFav={false} />
                      <NextLeavesInCountdown t={t} leavesIn={item.leavesIn} />
                    </View>
                    <View style={{backgroundColor: t.accentColor, height: 2}} />
                    <TimesList
                      nextIndex={item.timetableIndex}
                      timesArr={item.timetable.map(e => e.time)}
                    />
                  </View>
                )}
              />
            </View>
          </Container>
        )}
      </ThemeContext.Consumer>
    );
  }
}

class LineName extends PureComponent {
  render() {
    let {t, style, line, isFav} = this.props;
    return (
      <View style={style}>
        <Text
          style={{
            ...styles.lineName,
            color: isFav ? t.accentColor : t.textColor,
          }}
        >
          {line}
        </Text>
      </View>
    );
  }
}

class NextLeavesInCountdown extends PureComponent {
  render() {
    let {t, style, leavesIn} = this.props;
    if (leavesIn) {
      let time =
        leavesIn > 60
          ? Math.floor(leavesIn / 60) + ' godz'
          : Math.floor(leavesIn) + ' min';
      return (
        <View style={style}>
          <Text style={{color: t.textColor, ...styles.countdown}}>{time}</Text>
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  countdown: {
    fontSize: 27,
  },
  lineName: {
    fontSize: 35,
  },
  listItem: {
    padding: 10,
  },
});
