import React, {Component, PureComponent} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {ThemeConstants} from '../constants/ThemeConstants';
import {ThemeContext} from '../contexts/ThemeContext';
import {Container, Content} from 'native-base';
import {FlatList} from 'react-native-gesture-handler';
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
  parseTime(timeString) {
    let time = timeString.split(':');
    let h = time[0];
    let m = time[1];
    let s = time[2];
    if (this.isNightBus(timeString)) {
      h -= 24;
    }
    return moment(h + ':' + m + ':' + s, 'HH:mm:ss');
  }

  isNightBus(timeString) {
    let h = timeString.split(':')[0];
    if (h >= 24) return true;
    else return false;
  }

  _updateLeavingTimes = () => {
    let l = [...this.state.lines]; //to change reference
    let currentTime = moment();
    for (let i = 0; i < l.length; i++) {
      if (l[i].timetableIndex) {
        l[i].leavesIn--;
        if (l[i].leavesIn < 0) {
          l[i].timetableIndex++;
          if (l[i].timetableIndex >= l[i].timetable.length) {
            l[i].timetableIndex = 0;
            //calc leavesIn (jutro)
            let leaveTimeString = l[i].timetable[0].values[5].value;
            let leaveTime = this.parseTime(leaveTimeString);
            let d = moment.duration(leaveTime.diff(currentTime)).asMinutes();
            if (this.isNightBus(leaveTimeString)) {
              //nocny
              d += 24 * 60;
            }

            l[i].leavesIn = d;
          } else {
            //calc leavesIn
            let leaveTimeString =
              l[i].timetable[l[i].timetableIndex].values[5].value;
            let leaveTime = this.parseTime(leaveTimeString);
            let d = moment.duration(leaveTime.diff(currentTime)).asMinutes();

            if (this.isNightBus(leaveTimeString)) {
              //nocny
              d += 24 * 60;
            }
            l[i].leavesIn = d;
          }
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
        leavesIn > 60 ? Math.floor(leavesIn / 60) + ' godz' : leavesIn + ' min';
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
