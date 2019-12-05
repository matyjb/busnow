import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {withTheme} from './../theming';
import {
  Container,
  Header,
  Left,
  Icon,
  Body,
  Button,
  Title,
  Right,
  Text,
  Content,
} from 'native-base';

class SettingsScreen extends React.Component {
  render() {
    return (
      <Container>
        <Header style={{backgroundColor: this.props.theme.headerColor}}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Ustawienia</Title>
          </Body>
          <Right />
        </Header>
        <Content style={{backgroundColor: this.props.theme.primaryColor}}>
          <Button onPress={() => this.props.handleThemeChange('dark')}>
            <Text>change theme</Text>
          </Button>
          <Button onPress={() => this.props.handleThemeChange('default')}>
            <Text>change theme</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({});

// export default withTheme(SettingsScreen);
export default withTheme(SettingsScreen);
