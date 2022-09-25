import React, {useState, useMemo} from 'react';
import {View, Text, StyleSheet, Modal} from 'react-native';
import {
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {Button} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {onVerify, resendOtp} from '../redux/action';
import Spinner from 'react-native-loading-spinner-overlay';
import Axios from 'axios';
import OtpInputs from 'react-native-otp-inputs';
import AsyncStorage from '@react-native-community/async-storage';
import {getProfile} from '../redux/action/DriverProfileAction';
import EndPoint from '../Endpoit';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpVal, setOtpVal] = useState('');
  const [timer, setTimer] = useState(60);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const email = useSelector((state) => state.auth.email);
  const lng = useSelector((state) => state.driver.english);

  useMemo(() => {
    timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
  }, [timer]);

  const otpHandle = (value) => {
    if (isNaN(value)) {
      return;
    }
    if (value.length > 6) {
      return;
    }
    setOtp(value);
  };

  let count;

  if (timer < 10) {
    count = `0${timer}`;
  } else if (timer <= 60) {
    count = timer;
  }

  const verify = async () => {
    setIsLoading(true);
    const code = parseInt(otp, 10);
    const formData = new FormData();
    formData.append('email', email);
    formData.append('otp_code', code);
    const url = EndPoint.VERIFY_OTP;
    try {
      const res = await Axios.post(
        // API_VERIFY,
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
        const data = res.data;
        console.log(data);
        await AsyncStorage.setItem('userToken', data.access_token);
        await dispatch(getProfile());
        setIsLoading(false);
        navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      }
    } catch (error) {
      console.log(error, 'error');
      setIsLoading(false);
      alert('Login Failed please check the connection');
    }
  };

  const resend = async () => {
    setIsLoading(true);
    try {
      const res = await Axios.post(
          'http://mysupir.com/api/auth/login',
          {
            email,
          },
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
      );

      if (res) {
        alert('OTP sudah dikirim ulang ke e-mail anda');
        setIsLoading(false);
        setOtp(null);
      }
    } catch (error) {
      console.log(error, 'error');
      alert('Failed');
      setIsLoading(false);
    }

  };

  return (
    <View style={styles.container}>
      <Spinner
          visible={isLoading}
      />
      <Text style={styles.textHeader}>
        {lng === true
          ? 'Code has been sent to email'
          : 'Kode telah dikirim ke email'}{' '}
        {email}
      </Text>
      <View style={styles.inputContainer}>
        <View style={styles.otpBoxesContainer}>
          <OtpInputs
              handleChange={(value) => otpHandle(value)}
              numberOfInputs={6}
              keyboardType="numeric"
              inputContainerStyles={styles.otpBox}
              inputStyles={styles.inputStyles}
              defaultValue={otp}
          />
        </View>
      </View>
      <View style={styles.resendContainer}>
        {timer !== 0 ? (
          <Text style={styles.resendMess}>
            {lng === true ? 'Resend after' : 'Kirim ulang setelah'}{' '}
            {timer !== 60 ? `00:${count}` : '01:00'}
          </Text>
        ) : (
          <TouchableWithoutFeedback onPress={resend}>
            <Text
              style={[styles.resendMess, {textDecorationLine: 'underline'}]}>
              {lng === true ? 'Resend code' : 'Kirim ulang kode'}
            </Text>
          </TouchableWithoutFeedback>
        )}
      </View>
      <Button
        title={lng === true ? 'Login' : 'Masuk'}
        containerStyle={styles.buttonContainer}
        buttonStyle={{backgroundColor: '#17273F'}}
        titleStyle={styles.titleButton}
        onPress={verify}
      />
    </View>
  );
};

export default VerifyOTP;

const styles = StyleSheet.create({
  otpBoxesContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 35,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  otpBox: {
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#F1F4F9',
    height: 50,
    width: 50,
    textAlign: 'center',
    borderRadius: 6,
    backgroundColor: '#F1F4F9',
    fontSize: 23,
  },
  textHeader: {
    fontSize: 16,
    fontFamily: 'Source Sans Pro',
    color: '#333333',
    textAlign: 'center',
    marginTop: 30,
    marginHorizontal: 32,
  },
  resendMess: {
    fontFamily: 'Source Sans Pro',
    fontWeight: '600',
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginTop: 50,
  },
  buttonContainer: {
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 30,
  },
  titleButton: {
    fontSize: 16,
    fontFamily: 'Source Sans Pro',
    fontWeight: '600',
    color: '#FFF',
    marginVertical: 8,
  },
  resendContainer: {
    justifyContent: 'center',
  },
  inputStyles: {
    height: 49,
    marginHorizontal: 3,
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 5.2,
  },
});
