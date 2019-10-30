import React, { useContext } from 'react'
import { StyleSheet } from 'react-native'
import { Footer, FooterTab, Button, Icon } from 'native-base'
import { BusTramApiContext } from '../contexts/BusTramApiContext'
import { withNavigation } from 'react-navigation';

const FooterControlPanel = (props) => {
  const {radar, toggleRadar} = useContext(BusTramApiContext);
  
  return (
    <Footer>
      <FooterTab>
        <Button onPress={()=>props.navigation.navigate('ChooseLines')}>
          <Icon name="directions-bus" type="MaterialIcons" />
        </Button>
        <Button onPress={toggleRadar} active={radar.isOn}>
          <Icon name={radar.isOn ? "gps-fixed" : "gps-not-fixed"} active={radar.isOn} type="MaterialIcons" />
        </Button>
      </FooterTab>
    </Footer>
  )
}

const styles = StyleSheet.create({});

export default withNavigation(FooterControlPanel);
