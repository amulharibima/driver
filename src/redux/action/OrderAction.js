import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import {API_ORDER} from '../../API';
import {CANCEL, ACCEPT, LATER_COUNT} from '../case type/OrderCase';
import EndPoint from '../../Endpoit';

export const acceptOrder = (id, later, laterOrder) => {
  return async (dispatch) => {
    try {
      const url = EndPoint.ACCEPT_ORDER + id;
      const token = await AsyncStorage.getItem('userToken');
      const res = await Axios.post(
        // `${API_ORDER}accept/${id}`,
        url,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      if (res !== null) {
        console.log(res.data);
        if (later === true) {
          const order = JSON.stringify(laterOrder);
          await AsyncStorage.setItem('laterTrip', order);
          dispatch({type: LATER_COUNT});
        }
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };
};

export const declineOrder = (id) => {
  return async (dispatch) => {
    try {
      const url = EndPoint.DECLINE_ORDER + id;
      const token = await AsyncStorage.getItem('userToken');
      const res = await Axios.post(
        // `${API_ORDER}decline/${id}`,
        url,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      if (res !== null) {
        console.log(res.data, 'cancel');
        dispatch({type: CANCEL});
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };
};
