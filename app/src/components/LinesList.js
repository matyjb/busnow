import React , {useContext} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
  Dimensions
} from 'react-native';
import { BusTramApiContext } from '../contexts/BusTramApiContext';
import LINES from '../constants/Lines';

const Item = ({line, onPress, selected}) => {
  const style = !selected ? {...styles.item,...styles.itemSelected} : styles.item;
  return  (
    <TouchableOpacity onPress={() => onPress(line)}>
      <View style={style}>
        <Text>{line}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default function LinesList() {
  const {lines, toggleLine} = useContext(BusTramApiContext);
  return (
    <View style={styles.container}>
      <FlatList
        data={LINES}
        numColumns={5}
        renderItem={({ item, index }) => (
          <Item
            id={index}
            onPress={toggleLine}
            line={item}
            selected={lines.includes(item)}
          />
        )}
        keyExtractor={(item, index) => index}
        extraData={lines}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#0000ff66',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 5,
    height: Dimensions.get('window').width / 5 - 5 * 2,
    width: Dimensions.get('window').width / 5 - 5 * 2,
  },
  itemSelected: {
    backgroundColor: '#eeeeee',
  },
  title: {
    fontSize: 32,
  },
});
