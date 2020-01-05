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
    await this._getLines(this.props.unit, this.props.nr);
    this.interval = setInterval(this._updateArrivalTime, 60000);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.unit != this.props.unit || nextProps.nr != this.props.nr) {
      this._getLines(nextProps.unit, nextProps.nr);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  _updateArrivalTime = async () => {
    let l = this.state.lines;
    for (let i = 0; i < l.length; i++) {
      if (isNaN(l[i].arrivesIn)) continue;
      l[i].arrivesIn--;
      if (l[i].arrivesIn < 0) {
        l[i].timetableIndex++;
        if (l[i].timetableIndex >= l[i].timetable.length)
          l[i].timetableIndex = 0;

        let time = l[i].timetable[l[i].timetableIndex].values[5].value.split(
          ':'
        );
        let h = time[0];
        let m = time[1];
        let s = time[2];
        let currentTime = moment();
        if (h >= 24) {
          h -= 24;
          // nocny
          let arrivalTime = moment(h + ':' + m + ':' + s, 'HH:mm:ss');
          let d =
            moment.duration(arrivalTime.diff(currentTime)).asMinutes() +
            60 * 24;

          l[i].arrivesIn = d;
        } else {
          let arrivalTime = moment(h + ':' + m + ':' + s, 'HH:mm:ss');
          let d = moment.duration(arrivalTime.diff(currentTime)).asMinutes();
          l[i].arrivesIn = d;
        }
      }
    }
    this.setState({lines: l});
  };

  async _getLines(unit, nr) {
    let lines = await WarsawApi.getStopLines(unit, nr);
    this.setState({lines: []});
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
      console.log(data);

      let s = data.map(l => {
        for (let i = 0; i < l.timetable.length; i++) {
          const t = l.timetable[i];

          //to dziala ale nocne mają godzine typu 25:00 a nie 01:00
          // let arrivalTime = moment(t.values[5].value, 'HH:mm:ss');

          let time = t.values[5].value.split(':');
          let h = time[0];
          let m = time[1];
          let s = time[2];
          if (h >= 24) {
            h -= 24;
            // nocny - przekazujemy liczbe minut
            let arrivalTime = moment(h + ':' + m + ':' + s, 'HH:mm:ss');
            let d =
              moment.duration(arrivalTime.diff(currentTime)).asMinutes() +
              60 * 24;

            return {...l, timetableIndex: i, arrivesIn: d};
          }
          let arrivalTime = moment(h + ':' + m + ':' + s, 'HH:mm:ss');

          let d = moment.duration(arrivalTime.diff(currentTime)).asMinutes();

          if (d < 0) continue;
          else {
            return {...l, timetableIndex: i, arrivesIn: d};
          }
        }

        //koniec trasy
        if (l.timetable.length == 0) {
          return {...l, timetableIndex: 0, arrivesIn: NaN};
        }

        //next bus is tomorrow
        // const tmt = l.timetable[0];

        // let time = tmt.values[5].value.split(':');
        // let h = time[0];
        // let m = time[1];
        // let s = time[2];

        // if (h >= 24) {
        //   h -= 24;
        //   // nocny
        //   let arrivalTime = moment(h + ':' + m + ':' + s, 'HH:mm:ss');
        //   let d =
        //     moment.duration(arrivalTime.diff(currentTime)).asMinutes() +
        //     60 * 24;

        //   return {...l, timetableIndex: 0, arrivesIn: d};
        // } else {
        //   let arrivalTime = moment(h + ':' + m + ':' + s, 'HH:mm:ss');

        //   let d = moment.duration(arrivalTime.diff(currentTime)).asMinutes();
        //   return {...l, timetableIndex: 0, arrivesIn: d};
        // }
        return {...l, timetableIndex: 0, arrivesIn: 'jutro'};
      });

      this.setState({lines: s});
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.lines.map((e, i) => (
          <LineTag key={i} arrivesIn={e.arrivesIn} line={e.line} />
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
