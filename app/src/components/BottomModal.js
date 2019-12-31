import React, {Component} from 'react';
import {Text, StyleSheet} from 'react-native';
import Modal from 'react-native-modalbox';

export default class BottomModal extends Component {
  render() {
    return (
      <Modal
        style={{...this.props.style, height: 300}}
        position={'bottom'}
        backButtonClose
        ref={this.props._modalref}
      >
        <Text>Modal on bottom with backdrop</Text>
      </Modal>
    );
  }
}

// const styles = StyleSheet.create({});
