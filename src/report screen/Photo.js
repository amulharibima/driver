import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {
  FlatList,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {Modal} from 'react-native-paper';

const Photo = () => {
  const images = useSelector((state) => state.driver.reportImage);
  const firstImage = images[0];
  const [view, setView] = useState(false);
  const [imageView, setImageView] = useState('');

  const restImage = images.slice(1, 5);

  const renderItem = ({item}) => (
    <TouchableWithoutFeedback onPress={() => viewImage(item.image)}>
      <FastImage source={{uri: item.image}} style={styles.image} />
    </TouchableWithoutFeedback>
  );

  const viewImage = (image) => {
    setView(true);
    setImageView(image);
  };

  const onDismiss = () => {
    setView(false);
    setImageView('');
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.mainFotoContainer}>
          <TouchableOpacity onPress={() => viewImage(firstImage.image)}>
            <FastImage
              source={{uri: firstImage.image}}
              style={styles.mainFoto}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.fotoContainer}>
          <FlatList
            data={restImage}
            renderItem={renderItem}
            key={(item) => item.id}
            horizontal={true}
          />
        </View>
      </View>
      <Modal visible={view} onDismiss={onDismiss}>
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          source={{uri: imageView}}
          style={styles.viewImage}
        />
      </Modal>
    </>
  );
};

export default Photo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  mainFoto: {
    width: '100%',
    height: undefined,
    aspectRatio: 3 / 2,
    borderRadius: 10,
  },
  image: {
    width: 63,
    height: undefined,
    aspectRatio: 1 / 1,
    marginLeft: 20,
    borderRadius: 5,
  },
  fotoContainer: {
    marginTop: 34,
  },
  mainFotoContainer: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  viewImage: {
    width: '80%',
    height: undefined,
    aspectRatio: 2 / 3,
    alignSelf: 'center',
    borderRadius: 10,
  },
});
