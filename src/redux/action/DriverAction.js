import AsyncStorage from '@react-native-community/async-storage';
import {
  ENGLISH,
  INDONESIA,
  ORDER_ON,
  REPORT,
  ONTIME,
  ONTRIP,
} from '../case type/DriverCase';
import Axios from 'axios';
import {API_TOGGLE_ORDER, API_ORDER} from '../../API';
import Pusher from 'pusher-js/react-native';
import Echo from 'laravel-echo';
import {useSelector} from 'react-redux';
import {
  ORDER,
  ORDER_TRIP,
  ORDER_TIME,
  ORDER_LATER,
  PAYED,
  DONE,
  ACCEPT,
} from '../case type/OrderCase';
import EndPoint from '../../Endpoit';

export const loadLanguage = () => {
  return async (dispatch) => {
    try {
      const lng = await AsyncStorage.getItem('language');
      if (lng !== null) {
        if (lng == 'Indo') {
          dispatch({type: INDONESIA});
        } else if (lng == 'Eng') {
          dispatch({type: ENGLISH});
        }
      }
      console.log(lng);
    } catch (error) {
      console.log(error, 'error');
    }
  };
};

export const orderStatus = (status, lat, long) => {
  return async (dispatch) => {
    try {
      const url = EndPoint.TOGGLE_ORDER;
      const token = await AsyncStorage.getItem('userToken');
      const res = await Axios.post(
        // API_TOGGLE_ORDER,
        url,
        {
          order_status: status,
          lat: lat,
          long: long,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
        },
      );

      if (res !== null) {
        console.log(res.data);
        dispatch({type: ORDER_ON, order_on: status});
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };
};

export const broadcast = (id, navigation) => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      Pusher.logToConsole = true;
      const pusher = new Pusher('b18ddeb2c00212231da7', {
        authEndpoint: 'http://mysupir.com/broadcasting/auth',
        auth: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        cluster: 'ap1',
      });
      const echo = new Echo({
        broadcaster: 'pusher',
        client: pusher,
      });
      echo.private(`App.User.${id}`).notification((notif) => {
        let price;
        if (notif.order.type == 'trip' && notif.later === false) {
          const tmp = notif.transaction.total_price.split('.');
          price = tmp[0];
          console.log(price);
          dispatch({
            type: ORDER,
            order_id: notif.order.id,
            user_id: notif.user.id,
            user_name: notif.user.name,
            car_type: notif.order.car_type_id,
            identifier_id: notif.order.identifier,
            notes: notif.order.notes,
            total_distance: notif.order.total_distance,
            payment_status: notif.transaction.status,
            price: parseInt(price, 10),
            start_lat: notif.order.start_location.latitude,
            start_long: notif.order.start_location.longitude,
            start_loc: notif.order.start_location.name,
            user_pict:
              'http://mysupir.com/get_image?img_path=' +
              notif.user.foto,
            user_phone: notif.user.phone_number,
            order_type: notif.order.type,
            end_lat: notif.order.finish_location.latitude,
            end_long: notif.order.finish_location.longitude,
            end_loc: notif.order.finish_location.name,
            chat_id: notif.order.conversation_id,
          });
          dispatch({type: ORDER_TRIP});
          dispatch({type: ONTRIP});
        } else if (notif.order.type == 'time' && notif.later === false) {
          const tmp = notif.transaction.total_price.split('.');
          price = tmp[0];
          console.log(price);
          dispatch({
            type: ORDER,
            order_id: notif.order.id,
            user_id: notif.user.id,
            user_name: notif.user.name,
            car_type: notif.order.car_type_id,
            identifier_id: notif.order.identifier,
            notes: notif.order.notes,
            total_distance: notif.order.total_distance,
            payment_status: notif.transaction.status,
            price: parseInt(price, 10),
            start_lat: notif.order.start_location.latitude,
            start_long: notif.order.start_location.longitude,
            start_loc: notif.order.start_location.name,
            user_pict:
              'http://mysupir.com/get_image?img_path=' +
              notif.user.foto,
            user_phone: notif.user.phone_number,
            order_type: notif.order.type,
            start_dateTime: notif.order.start_datetime,
            end_dateTime: notif.order.finish_datetime,
            chat_id: notif.order.conversation_id,
          });
          dispatch({type: ORDER_TIME});
          dispatch({type: ONTIME});
        } else if (notif.order.type == 'trip' && notif.later === true) {
          const tmp = notif.transaction.total_price.split('.');
          price = tmp[0];
          console.log(price);
          dispatch({
            type: ORDER,
            order_id: notif.order.id,
            user_id: notif.user.id,
            user_name: notif.user.name,
            car_type: notif.order.car_type_id,
            identifier_id: notif.order.identifier,
            notes: notif.order.notes,
            total_distance: notif.order.total_distance,
            payment_status: notif.transaction.status,
            price: parseInt(price, 10),
            start_lat: notif.order.start_location.latitude,
            start_long: notif.order.start_location.longitude,
            start_loc: notif.order.start_location.name,
            user_pict:
              'http://mysupir.com/get_image?img_path=' +
              notif.user.foto,
            user_phone: notif.user.phone_number,
            order_type: notif.order.type,
            end_lat: notif.order.locations[1].latitude,
            end_long: notif.order.locations[1].longitude,
            end_loc: notif.order.locations[1].name,
            later: notif.later,
            later_datetime: notif.order.start_datetime,
            chat_id: notif.order.conversation_id,
          });
          dispatch({type: ORDER_LATER, later_trip: notif});
        } else if (notif.order.status == 'sedang berjalan') {
          dispatch({type: DONE, done: true});
        } else if (notif.order.transaction.status == 'dibayar') {
          dispatch({
            type: PAYED,
            chat_id: notif.order.conversation_id,
            payment_status: notif.order.transaction.status,
          });
          dispatch({type: ACCEPT});
        } else if (
          notif.type === 'App\\Notifications\\OrderCanceledNotification'
        ) {
          navigation.navigate('Home');
          dispatch({type: 'CANCELED', canceled: true});
        } else if (
          notif.type === 'App\\Notifications\\TriggerStartNotification'
        ) {
          dispatch({type: 'TIME_START'});
        }
      });
    } catch (error) {
      console.log(error, 'error');
    }
  };
};

export const reportStart = (body, id) => {
  return async (dispatch) => {
    try {
      const url = EndPoint.START_ORDER + id;
      const token = await AsyncStorage.getItem('userToken');
      const res = await Axios.post(
        // `${API_ORDER}init/${id}`,
        url,
        body,
        {
          headers: {
            Authorization: 'Bearer ' + token,
            // accept: 'application/json',
            // 'Content-Type': 'application/json',
          },
        },
      );
      if (res !== null) {
        console.log(res.data);
        dispatch({type: REPORT, report: true});
      }
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  };
};

export const reportEnd = (body, id) => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await Axios.post(`${API_ORDER}finish/${id}`, body, {
        headers: {
          Authorization: 'Bearer ' + token,
          // accept: 'application/json',
          // 'Content-Type': 'application/json',
        },
      });
      if (res !== null) {
        console.log(res.data);
        dispatch({type: REPORT, report: true});
      }
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  };
};
