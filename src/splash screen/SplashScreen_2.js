import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import Logo from '../assets/splash_2.png';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';

const SplashScreen_2 = () => {
  const navigation = useNavigation();
  const lng = useSelector((state) => state.driver.english);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <Text style={{fontWeight: 'bold'}}>My</Text>Supir
      </Text>
      <View style={styles.imageContainer}>
        <FastImage source={Logo} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textTop}>
          {lng === true ? 'Additional Income' : 'Penghasilan Tambahan'}
        </Text>
        <Text style={styles.textBottom}>
          {lng === true
            ? 'Get additional prospective income by joining My Supir'
            : 'Dapatkan penghasilan tambahan yang prospektif dengan bergabung ke My Supir'}
        </Text>
      </View>
      <Button
        title={
          lng === true ? 'Login with e-mail' : 'Masuk dengan e-mail'
        }
        containerStyle={styles.buttonContainer}
        buttonStyle={{backgroundColor: '#17273F'}}
        titleStyle={styles.buttonTitle}
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};

export default SplashScreen_2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  title: {
    fontFamily: 'Source Sans Pro',
    fontSize: 20,
    color: '#000',
    alignSelf: 'center',
    marginTop: 15,
  },
  image: {
    width: 253,
    height: 154,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 118,
  },
  textContainer: {
    marginHorizontal: 16,
    marginTop: 47,
  },
  textTop: {
    fontFamily: 'Source Sans Pro',
    fontWeight: '600',
    fontSize: 18,
    color: '#000',
  },
  textBottom: {
    fontFamily: 'Source Sans Pro',
    fontSize: 12,
    color: '#727272',
    marginTop: 3,
  },
  buttonContainer: {
    marginHorizontal: 16,
    marginTop: 64,
    borderRadius: 5,
  },
  buttonTitle: {
    fontFamily: 'Source Sans Pro',
    fontWeight: '600',
    fontSize: 14,
    color: '#EEFFFB',
    marginVertical: 8,
  },
});
