import React, {Component} from 'react';
import {Text, View} from 'react-native';

var moment = require('moment');

calcSeconds = time => {
  var duration = moment.duration(moment().diff(moment(time)));
  return Math.round(duration.asSeconds());
};

export default class SecondsSinceTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastSeenSec: calcSeconds(props.time),
    };
  }

  static getDerivedStateFromProps(props) {
    return {
      lastSeenSec: calcSeconds(props.time),
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({
        lastSeenSec: this.state.lastSeenSec + 1,
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    return <Text style={this.props.style}>{this.state.lastSeenSec}</Text>;
  }
}
