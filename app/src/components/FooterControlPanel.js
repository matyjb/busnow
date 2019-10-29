import React, { Component, useContext } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { Footer, FooterTab, Button, Icon } from 'native-base'
import { BusTramApiContext } from '../contexts/BusTramApiContext'

const FooterControlPanel = () => {
  const {radar, toggleRadar} = useContext(BusTramApiContext);
  
  return (
    <Footer>
      <FooterTab>
        <Button onPress={toggleRadar} active={radar.isOn}>
          <Icon name={radar.isOn ? "gps-fixed" : "gps-not-fixed"} active={radar.isOn} type="MaterialIcons" />
        </Button>
      </FooterTab>
    </Footer>
  )
}

const styles = StyleSheet.create({});

export default FooterControlPanel;
