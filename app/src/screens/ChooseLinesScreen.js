import React, { useContext } from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import {BusTramApiContext} from '../contexts/BusTramApiContext'
import { Container, Header, Text, Button, Footer } from 'native-base';
import LinesList from '../components/LinesList';

const ChooseLinesScreen = (props) => {
  const {lines} = useContext(BusTramApiContext);
  return (
    <Container style={styles.container}>
      <Header>
        {lines.map((item, index) => 
            <Text key={index}>{item}</Text>
        )}
      </Header>
      <LinesList/>
      <Footer>
        <Button onPress={()=> props.navigation.goBack()}>
          <Text>back</Text>
        </Button>
      </Footer>
    </Container>
  )
}
const styles = StyleSheet.create({
  container: {
  },
  flatList:{
    flex: 1,
    marginVertical: 2,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 5,
    height: Dimensions.get('window').width / 5 - 5 * 2,
    width: Dimensions.get('window').width / 5 - 5 * 2,
    backgroundColor: 'blue',
  }
})

export default ChooseLinesScreen;
