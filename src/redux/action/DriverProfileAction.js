import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import {API_DRIVER, API_DRIVER_UPDATE_FOTO, API_DRIVER_UPDATE} from '../../API';
import {
  ADDRESS,
  EMAIL,
  PHONE_PROFILE,
  NAME,
  PICTURE,
  ID,
  LICENSES,
  RATING,
} from '../case type/DriverProfileCase';
import {ORDER_ON} from '../case type/DriverCase';
import {broadcast} from './DriverAction';
import EndPoint from '../../Endpoit';

export const getProfile = (navigation, payment) => {
  return async (dispatch) => {
    try {
      const url = EndPoint.GET_PROFILE;
      const token = await AsyncStorage.getItem('userToken');
      const res = await Axios.get(
        // API_DRIVER,
        url,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );
      if (res !== null) {
        console.log(res.data);
        const regex =
          'https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)';
        const data = res.data.driver;
        const name = res.data.licenses;
        const license = name.map((item) => {
          return item.toUpperCase();
        });
        await AsyncStorage.setItem('userProfile', JSON.stringify(res.data));
        dispatch({type: ADDRESS, address: data.address});
        dispatch({type: EMAIL, email: data.email});
        dispatch({type: PHONE_PROFILE, phone_profile: data.phone_number});
        dispatch({type: NAME, name: data.name});
        dispatch({
          type: PICTURE,
          picture: `http://mysupir.com/get_image?img_path=${data.foto}`,
        });
        dispatch({type: ID, id: data.user_id});
        dispatch({type: ORDER_ON, order_on: data.order_status});
        dispatch({type: LICENSES, licenses: license});
        dispatch({type: RATING, rating: res.data.rating});
        dispatch({type: 'INCOME', income: res.data.earnings});
        dispatch({type: 'IDENTIFY', identify: res.data.driver.identifier});
        dispatch({type: 'IS_SUSPENDED', is_suspended: res.data.driver.is_suspended, alasan_suspend: res.data.driver.alasan_suspend});
        dispatch(broadcast(data.user_id, navigation, payment));
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };
};

export const getOfflineProfile = (payment) => {
  return async (dispatch) => {
    try {
      const profile = await AsyncStorage.getItem('userProfile');
      const data = JSON.parse(profile);
      const driver = data.driver;
      const name = data.licenses;
      const license = name.map((item) => {
        return item.toUpperCase();
      });
      if (data !== null) {
        dispatch({type: ADDRESS, address: driver.address});
        dispatch({type: EMAIL, email: driver.email});
        dispatch({type: PHONE_PROFILE, phone_profile: driver.phone_number});
        dispatch({type: NAME, name: driver.name});
        dispatch({type: PICTURE, picture: driver.foto});
        dispatch({type: ID, id: driver.user_id});
        dispatch({type: ORDER_ON, order_on: driver.order_status});
        dispatch({type: LICENSES, licenses: license});
        dispatch({type: RATING, rating: profile.rating});
        dispatch(broadcast(driver.user_id, payment));
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };
};

export const changeProfile = (name, address, navigation) => {
  return async (dispatch) => {
    try {
      const url = EndPoint.UPDATE_PROFILE;
      const token = await AsyncStorage.getItem('userToken');
      const res = await Axios.put(
        // API_DRIVER_UPDATE,
        url,
        {
          name: name,
          address: address,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-type': 'application/json',
            accept: 'application/json',
          },
        },
      );
      if (res !== null) {
        console.log(res.data);
        dispatch({type: NAME, name: name});
        dispatch({type: ADDRESS, address: address});
        navigation.navigate('Profile');
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };
};

export const changePicture = (body) => {
  return async (dispatch) => {
    try {
      const url = EndPoint.CHANGE_AVATAR;
      const token = await AsyncStorage.getItem('userToken');
      console.log('token', token)
      const res = await Axios.post(
        // API_DRIVER_UPDATE_FOTO,
        url,
        body,
        {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-type': 'application/json',
            accept: 'application/json',
          },
        },
      );
      const pict = body._parts[0][1].uri;
      if (res !== null) {
        console.log('ini hasil post',res.data);
        await dispatch(getProfile());
        console.log(pict);
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };
};

export const getIncome = async () => {
  return async (dispatch) => {
    try {
      const url = EndPoint.GENERATE_INCOME;
      const token = await AsyncStorage.getItem('userToken');
      const res = await Axios.post(
        // `${API_DRIVER}/generate-income`,
        url,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );
      if (res) {
        console.log(res.data);
        dispatch({type: 'INCOME', income: res.data.income});
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };
};
