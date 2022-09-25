import Axios from 'axios';
import {API_LOGIN, API_VERIFY, API_RESEND_OTP} from '../../API';
import {PHONE, OTP} from '../case type/AuthCase';
import AsyncStorage from '@react-native-community/async-storage';
import {getProfile, getOfflineProfile} from './DriverProfileAction';
import {broadcast} from './DriverAction';
import EndPoint from '../../Endpoit';

export const onLogin = (body, navigation) => {
  return async (dispatch) => {
    try {
      const url = EndPoint.LOGIN;
      const res = await Axios.post(
        // API_LOGIN,
        url,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
        },
      );
      if (res !== null) {
        navigation.navigate('Verify OTP');
        console.log(res.data);
        dispatch({type: PHONE, phone: body._parts[0][1]});
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };
};

export const onVerify = (body, navigation) => {
  return async (dispatch) => {
    try {
      const url = EndPoint.VERIFY_OTP;
      const res = await Axios.post(
        // API_VERIFY,
        url,
        body,
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
        dispatch(getProfile());
        navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };
};

export const resendOtp = (body) => {
  return async (dispatch) => {
    try {
      const url = EndPoint.RESEND_OTP;
      const res = await Axios.post(
        // API_RESEND_OTP,
        url,
        body,
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
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };
};

export const onCheckToken = (navigation) => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token !== null) {
        await dispatch(getProfile());
        navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      } else {
        navigation.navigate('Splash 2');
      }
    } catch (error) {
      console.log(error, 'error');
      navigation.navigate('Splash 2');
    }
  };
};

export const onLogout = (navigation) => {
  return async (dispatch) => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.reset({
        index: 0,
        routes: [{name: 'Splash 2'}],
      });
    } catch (error) {
      console.log(error, 'error');
    }
  };
};
