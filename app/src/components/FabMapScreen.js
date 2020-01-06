import React, {Component} from 'react';
import {Icon, Button, Fab} from 'native-base';
import {withThemeContext} from '../contexts/ThemeContext';
import {withGlobalContext} from '../contexts/GlobalContext';
import {withNavigation} from 'react-navigation';

class FabMapScreen extends Component {
  render() {
    let {t} = this.props.themeContext;
    let {toggleRadar, navigateToUser} = this.props.globalContext;
    return (
      <Fab
        active={true}
        style={{...this.props.style, backgroundColor: t.accentColor}}
        position="bottomRight"
        onPress={() => toggleRadar()}
      >
        <Icon
          name="radar"
          type="MaterialCommunityIcons"
          style={{color: t.primaryColor}}
        />
        <Button
          style={{
            ...this.props.style,
            backgroundColor: t.accentColor,
            marginBottom: 14,
          }}
          onPress={() => navigateToUser()}
        >
          <Icon
            name="gps-fixed"
            type="MaterialIcons"
            style={{color: t.primaryColor}}
          />
        </Button>
        <Button
          style={{...this.props.style, backgroundColor: t.accentColor}}
          onPress={() => this.props.modalref.open()}
        >
          <Icon name="md-menu" style={{color: t.primaryColor}} />
        </Button>
      </Fab>
    );
  }
}
export default withNavigation(
  withThemeContext(withGlobalContext(FabMapScreen))
);
