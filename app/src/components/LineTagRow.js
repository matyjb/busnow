import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import LineTag from './LineTag';
import WarsawApi from '../WarsawApi';
import {withGlobalContext} from '../contexts/GlobalContext';
import {ThemeContext} from '../contexts/ThemeContext';
import {Icon, Button} from 'native-base';
import {withNavigation} from 'react-navigation';

var moment = require('moment');

class LineTagRow extends Component {
  state = {
    lines: [],
  };

  async componentDidMount() {
    await this._initState(this.props.stop.unit, this.props.stop.nr);
    this.interval = setInterval(this._updateLeavingTimes, 60000);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.stop.unit != this.props.stop.unit ||
      nextProps.stop.nr != this.props.stop.nr
    ) {
      this._initState(nextProps.stop.unit, nextProps.stop.nr);
    }
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
          l[i].timetableIndex = j;
          l[i].leavesIn = d;
          break;
        }
      }
    }

    // for (let i = 0; i < l.length; i++) {
    //   if (l[i].timetableIndex) {
    //     l[i].leavesIn--;
    //     if (l[i].leavesIn < 0) {
    //       l[i].timetableIndex++;
    //       if (l[i].timetableIndex >= l[i].timetable.length) {
    //         l[i].timetableIndex = 0;
    //         //calc leavesIn (jutro)
    //         let leaveTimeString = l[i].timetable[0].values[5].value;
    //         let leaveTime = this.parseTime(leaveTimeString);
    //         let d = moment.duration(leaveTime.diff(currentTime)).asMinutes();
    //         if (this.isNightBus(leaveTimeString)) {
    //           //nocny
    //           d += 24 * 60;
    //         }

    //         l[i].leavesIn = d;
    //       } else {
    //         //calc leavesIn
    //         let leaveTimeString =
    //           l[i].timetable[l[i].timetableIndex].values[5].value;
    //         let leaveTime = this.parseTime(leaveTimeString);
    //         let d = moment.duration(leaveTime.diff(currentTime)).asMinutes();

    //         if (this.isNightBus(leaveTimeString)) {
    //           //nocny
    //           d += 24 * 60;
    //         }
    //         l[i].leavesIn = d;
    //       }
    //     }
    //   }
    // }
    this.setState({lines: l});
  };

  _initState = async (unit, nr) => {
    this.setState({lines: []});
    let lines = this.props.stop.lines;

    Promise.all(
      lines.map(async e => {
        let timetable = await WarsawApi.getStopLineSchedule(unit, nr, e);

        return {line: e, timetable: timetable};
      })
    ).then(data => {
      let currentTime = moment();
      let result = data.map(e => {
        if (e.timetable.length == 0) return e;
        for (let i = 0; i < e.timetable.length; i++) {
          let d = moment
            .duration(e.timetable[i].time.diff(currentTime))
            .asMinutes();
          if (d < 0) continue;
          else return {...e, timetableIndex: i, leavesIn: d};
        }
        return e;
        //   const t = e.timetable[i];
        //   let leaveTime = this.parseTime(t.time);

        //   if (this.isNightBus(t.time)) {
        //     //nocny
        //     d += 24 * 60;
        //   }

        //   if (d < 0) continue;
        // }
        // // kolejny jest jutro
        // let leaveTime = this.parseTime(e.timetable[0].time);
        // let d =
        // moment.duration(leaveTime.diff(currentTime)).asMinutes() + 24 * 60;
        // if (this.isNightBus(e.timetable[0].time)) {
        //   //nocny
        //   d += 24 * 60;
        // }
        // return {...e, timetableIndex: 0, leavesIn: d};
      });
      this.setState({lines: result});
    });
  };

  onSchedulePressed = () => {
    this.props.navigation.navigate('Schedule', {
      stop: this.props.stop,
      lines: this.state.lines,
    });
  };

  render() {
    let {favLines} = this.props.globalContext;
    return (
      <View style={styles.container}>
        {this.state.lines.length != 0 && (
          <ThemeContext.Consumer>
            {({t}) => (
              <Button transparent onPress={this.onSchedulePressed}>
                <Icon
                  style={{color: t.textColor}}
                  name="timetable"
                  type="MaterialCommunityIcons"
                />
              </Button>
            )}
          </ThemeContext.Consumer>
        )}
        {this.state.lines.map((e, i) => (
          <LineTag
            key={i}
            leavesIn={e.leavesIn}
            line={e.line}
            isFav={favLines.find(line => line == e.line) !== undefined}
          />
        ))}
      </View>
    );
  }
}

export default withNavigation(withGlobalContext(LineTagRow));

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 225,
  },
});

LineTagRow.propTypes = {
  stop: PropTypes.shape({
    unit: PropTypes.string.isRequired,
    nr: PropTypes.string.isRequired,
  }).isRequired,
};
