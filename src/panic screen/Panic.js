import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import {API_DRIVER} from '../API';
import {useSelector} from 'react-redux';
import Geocoder from 'react-native-geocoder';
import geocoder from 'react-native-geocoder/js/geocoder';
import Geolocation from '@react-native-community/geolocation';
import EndPoint from '../Endpoit';

const Panic = () => {
  const [state, setState] = useState({
    latitude: 0,
    longitude: 0,
    address: '',
  });

  const [count, setCount] = useState(0);

  const [press, setPress] = useState(false);

  const getCurrLocation = async () => {
    Geolocation.getCurrentPosition((info) => {
      setState({
        ...state,
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
      });
    });
  };
  useEffect(() => {
    getCurrLocation();
  }, []);

  const onPanic = async () => {
    setCount(count + 1);
    setPress(true);
    try {
      const position = await geocoder.geocodePosition({
        lat: state.latitude,
        lng: state.longitude,
      });
      // setState({
      //   ...state,
      //   address: position[1].formattedAddress,
      // });
      const url = EndPoint.PANIC;
      const token = await AsyncStorage.getItem('userToken');
      const res = await Axios.post(
        // `${API_DRIVER}/panic`,
        url,
        {
          location_latitude: state.latitude,
          location_longitude: state.longitude,
          location_name: position[1].formattedAddress,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );
      if (res !== null) {
        console.log(res.data);
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={onPanic}>
        <View style={styles.imageContainer}>
          <FastImage
            source={require('../assets/sos.png')}
            style={styles.image}
          />
          <Text style={styles.sos}>S.O.S</Text>
        </View>
      </TouchableWithoutFeedback>
      <Text style={styles.text}>
        PRESS BUTTON FOR EMERGENCY SITUATION!!!
        {press === true && (
          <Text>Anda Telah menenakan tombol ini {count} kali</Text>
        )}
      </Text>
    </View>
  );
};

export default Panic;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
  },
  image: {
    width: 250,
    height: 250,
    alignSelf: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
  },
  sos: {
    fontWeight: 'bold',
    fontFamily: 'Source Sans Pro',
    fontSize: 50,
    color: '#FFFFFF',
    position: 'absolute',
    alignSelf: 'center',
  },
  text: {
    fontSize: 12,
    fontFamily: 'Source Sans Pro',
    textAlign: 'center',
    color: '#F63F3F',
    marginTop: 32,
    marginHorizontal: 72,
  },
});
