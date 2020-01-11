import React, {PureComponent} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {withThemeContext} from '../contexts/ThemeContext';

class TimesList extends PureComponent {
  render() {
    let {timesArr, nextIndex} = this.props;
    let {t} = this.props.themeContext;
    return (
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {timesArr.map((time, i) => {
          let textColor = t.textColor;
          if (nextIndex == undefined || nextIndex > i) {
            textColor = 'grey';
          } else if (nextIndex == i) {
            textColor = t.accentColor;
          }
          return (
            <Text key={i} style={{color: textColor}}>
              {' '}
              {time.format('HH:mm')}{' '}
            </Text>
          );
        })}
      </View>
    );
  }
}

TimesList.propTypes = {
  nextIndex: PropTypes.number,
  timesArr: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const styles = StyleSheet.create({
  container: {},
});

export default withThemeContext(TimesList);
