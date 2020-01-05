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
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.unit != this.props.unit || nextProps.nr != this.props.nr) {
      this._getLines(nextProps.unit, nextProps.nr);
    }
  }

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
            // nocny - przekazujemy liczbe minut, nie napis jutro
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
        //next bus is tomorrow
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
