import {
  ORDER,
  ORDER_TRIP,
  ORDER_TIME,
  CANCEL,
  ACCEPT,
  ORDER_LATER,
  LATER_COUNT,
  PAYED,
  DONE,
} from '../case type/OrderCase';

const initialState = {
  order_id: null,
  user_id: null,
  user_name: null,
  car_type: null,
  identifier_id: null,
  notes: null,
  total_distance: null,
  payment_status: null,
  price: null,
  start_lat: null,
  start_long: null,
  user_pict: null,
  user_phone: null,
  conver_id: null,
  end_lat: null,
  eng_long: null,
  start_loc: null,
  end_loc: null,
  order_trip: false,
  order_type: null,
  order_time: false,
  start_dateTime: null,
  end_dateTime: null,
  later_datetime: null,
  later_order: null,
  later: false,
  trip: null,
  done: false,
  chat_id: null,
  canceled: false,
  start: false,
};

export const OrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ORDER:
      return {
        ...state,
        order_id: action.order_id,
        start_dateTime: action.start_dateTime,
        end_dateTime: action.end_dateTime,
        user_id: action.user_id,
        user_name: action.user_name,
        car_type: action.car_type,
        identifier_id: action.identifier_id,
        notes: action.notes,
        total_distance: action.total_distance,
        payment_status: action.payment_status,
        price: action.price,
        start_lat: action.start_lat,
        start_long: action.start_long,
        start_loc: action.start_loc,
        end_lat: action.end_lat,
        end_long: action.end_long,
        end_loc: action.end_loc,
        user_pict: action.user_pict,
        user_phone: action.user_phone,
        order_type: action.order_type,
        later_datetime: action.later_datetime,
        chat_id: action.chat_id,
      };
    case ORDER_TRIP:
      return {
        ...state,
        order_trip: true,
      };
    case ORDER_TIME:
      return {
        ...state,
        order_time: true,
      };
    case CANCEL:
      return {
        ...initialState,
      };
    case ACCEPT:
      return {
        ...state,
        order_trip: false,
        order_time: false,
        later: false,
      };
    case ORDER_LATER:
      return {
        ...state,
        later: true,
        trip: action.later_trip,
      };
    case LATER_COUNT:
      return {
        ...state,
        later_order: state.later_order + 1,
        later: false,
      };
    case PAYED:
      return {
        ...state,
        chat_id: action.chat_id,
        payment_status: action.payment_status,
      };
    case DONE:
      return {
        ...state,
        done: action.done,
      };
    case 'CANCELED':
      return {
        ...state,
        canceled: action.canceled,
      };
    default:
      return state;
  }
};
