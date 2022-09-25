import React, {useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import Logo from '../assets/login.png';
import {TextInput, ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {useSelector, useDispatch} from 'react-redux';
import Axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import {EMAIL} from '../redux/case type/AuthCase';
import EndPoint from '../Endpoit';

const Login = () => {
  const navigation = useNavigation();
  const lng = useSelector((state) => state.driver.english);
  const [email, setEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const onChangeEmail = (val) => {
    setEmail(val);
  };

  const login = async () => {
    setIsLoading(true);
    console.log('pressed');
    const url = EndPoint.LOGIN;
    console.log('url', url);
    const formData = new FormData();
    formData.append('email', email);
    try {
      const res = await Axios.post(
        // API_LOGIN
        url,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
        },
      );
      if (res !== null) {
        setIsLoading(false);
        console.log(res.data);
        dispatch({type: EMAIL, email});
        navigation.navigate('Verify OTP');
      }
    } catch (error) {
      console.log(error.response.data, 'error');
      for (let [key, value] of Object.entries(error.response.data.errors)) {
        alert(value);
      }

      setIsLoading(false);
    }
  };

  const DevLogin = async () => {
    setIsLoading(true);
    try {
      const res = await Axios.post('http://mysupir.com/api/devlogin', {
        phone_number: number,
      });

      if (res !== null) {
        console.log(res.data);
        await AsyncStorage.setItem('userToken', res.data.access_token);
        dispatch(getProfile());
        navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error, 'error');
      setIsLoading(false);
      alert(error);
    }
  };

  return (
    <ScrollView>
      <Spinner
        visible={isLoading}
      />
      <View style={styles.container}>
        <Text style={styles.title}>
          <Text style={{fontWeight: 'bold'}}>My</Text>Supir
        </Text>
        <View style={styles.imageContainer}>
          <FastImage source={Logo} style={styles.image} />
        </View>
        <View style={styles.loginContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.textTop}>
              {lng === true ? 'Welcome!' : 'Selamat Datang!'}
            </Text>
            <Text style={styles.textBottom}>Lorem ipsum dolor sit amet, </Text>
          </View>
          <View style={styles.textInputContainer}>
            <Icon
              type="ionicon"
              name="person"
              size={20}
              color="#17273F"
              containerStyle={{
                marginLeft: 22,
                marginRight: 10,
              }}
            />
            <TextInput
              placeholder="E-mail"
              style={styles.placeholder}
              onChangeText={onChangeEmail}
            />
          </View>
          <Button
            title={'Login'}
            containerStyle={styles.buttonContainer}
            buttonStyle={{backgroundColor: '#17273F'}}
            titleStyle={styles.titleButton}
            onPress={login}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17273F',
  },
  title: {
    fontFamily: 'Source Sans Pro',
    fontSize: 20,
    color: '#FFF',
    alignSelf: 'center',
    marginTop: 20,
  },
  image: {
    width: 320,
    height: 168,
  },
  imageContainer: {
    alignSelf: 'center',
    marginTop: 64,
  },
  textTop: {
    fontFamily: 'Source Sans Pro',
    fontWeight: 'bold',
    fontSize: 25,
    color: '#17273F',
  },
  loginContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    marginTop: 55,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  textContainer: {
    marginHorizontal: 16,
    marginTop: 30,
  },
  textInputContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    paddingVertical: 2,
  },
  placeholder: {
    fontSize: 14,
    fontFamily: 'Source Sans Pro',
    color: '#80807E',
    marginLeft: 15,
  },
  buttonContainer: {
    marginHorizontal: 16,
    marginTop: 25,
    borderRadius: 10,
  },
  titleButton: {
    fontFamily: 'Source Sans Pro',
    fontWeight: '600',
    fontSize: 18,
    color: '#FFF',
    marginVertical: 3,
  },
});
