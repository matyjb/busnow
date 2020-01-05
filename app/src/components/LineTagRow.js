import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import LineTag from './LineTag';
import WarsawApi from '../WarsawApi';

var moment = require('moment');

export default class LineTagRow extends Component {
  state = {
    lines: [],
  };

  async componentDidMount() {
    await this._initState(this.props.unit, this.props.nr);
    this.interval = setInterval(this._updateLeavingTimes, 60000);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.unit != this.props.unit || nextProps.nr != this.props.nr) {
      this._initState(nextProps.unit, nextProps.nr);
    }
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
    let l = this.state.lines;
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

  _initState = async (unit, nr) => {
    this.setState({lines: []}); //restart state'a
    // pobiera rozklad i inicjalizuje tablice obiektow:
    // {
    // 	line: '709',
    // 	timetable: to co pobierze z api,
    // 	timetableIndex: 0 <--- wskazuje na najblizszy przyjazd
    // 	leavesIn: 2 <---- aktualizuje sie co sekunde ( w dól) jak bedzie -1 to index o jeden do gory i wyliczeni na nowo leavesIn
    // }
    let lines = await WarsawApi.getStopLines(unit, nr);
    Promise.all(
      lines.map(async e => {
        let timetable = await WarsawApi.getStopLineSchedule(
          unit,
          nr,
          e.values[0].value
        );

        return {line: e.values[0].value, timetable: timetable};
      })
    ).then(data => {
      let currentTime = moment();
      let result = data.map(e => {
        if (e.timetable.length == 0) return e;

        for (let i = 0; i < e.timetable.length; i++) {
          const t = e.timetable[i];
          let leaveTime = this.parseTime(t.values[5].value);
          let d = moment.duration(leaveTime.diff(currentTime)).asMinutes();

          if (this.isNightBus(t.values[5].value)) {
            //nocny
            d += 24 * 60;
          }

          if (d < 0) continue;
          else return {...e, timetableIndex: i, leavesIn: d};
        }
        // kolejny jest jutro
        let leaveTime = this.parseTime(e.timetable[0].values[5].value);
        let d = moment.duration(leaveTime.diff(currentTime)).asMinutes();
        if (this.isNightBus(e.timetable[0].values[5].value)) {
          //nocny
          d += 24 * 60;
        }
        return {...e, timetableIndex: 0, leavesIn: d};
      });
      this.setState({lines: result});
    });
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.lines.map((e, i) => (
          <LineTag key={i} leavesIn={e.leavesIn} line={e.line} />
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 225,
  },
});

LineTagRow.propTypes = {
  unit: PropTypes.string.isRequired,
  nr: PropTypes.string.isRequired,
};
