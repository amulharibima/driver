import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Splash from '../assets/splash_logo.png';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {useDispatch} from 'react-redux';
import {onCheckToken} from '../redux/action';

const SplashScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(() => {
      dispatch(onCheckToken(navigation));
    }, 4000);
  }, []);

  return (
    <View style={styles.container}>
      <FastImage source={Splash} style={styles.image} />
      <Text style={styles.text}>DRIVER APP</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17273F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 160,
    height: 129,
  },
  text: {
    fontFamily: 'Titillium',
    fontWeight: 'bold',
    fontSize: 25,
    color: '#FFF',
    marginTop: 5,
  },
});
