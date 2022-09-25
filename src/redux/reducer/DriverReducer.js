import {
  REPORT_IMAGE,
  REPORT,
  ONTIME,
  ONTRIP,
  FINISH,
  ENGLISH,
  INDONESIA,
  ORDER_ON,
  LOCATION,
} from '../case type/DriverCase';
import {LICENSES, RATING} from '../case type/DriverProfileCase';

const initialState = {
  reportImage: [],
  report: false,
  onTime: false,
  onTrip: false,
  english: false,
  order_on: 0,
  token: null,
  licenses: [],
  rating: null,
  lat: null,
  long: null,
  start: false,
};

export const DriverReducer = (state = initialState, action) => {
  switch (action.type) {
    case REPORT_IMAGE:
      return {
        ...state,
        reportImage: action.reportImage,
      };
    case REPORT:
      return {
        ...state,
        report: action.report,
      };
    case LOCATION:
      return {
        ...state,
        lat: action.lat,
        long: action.long,
      };
    case ONTIME:
      return {
        ...state,
        onTime: true,
      };
    case ONTRIP:
      return {
        ...state,
        onTrip: true,
      };
    case FINISH:
      return {
        ...state,
        onTrip: false,
        onTime: false,
        report: false,
        order_on: 0,
      };
    case ENGLISH:
      return {
        ...state,
        english: true,
      };
    case INDONESIA:
      return {
        ...state,
        english: false,
      };
    case LICENSES:
      return {
        ...state,
        licenses: action.licenses,
      };
    case RATING:
      return {
        ...state,
        rating: action.rating,
      };
    case ORDER_ON:
      return {
        ...state,
        order_on: action.order_on,
      };
    case 'TIME_START':
      return {
        ...state,
        start: true,
      };
    case 'TIME_STOP':
      return {
        ...state,
        start: false,
      };
    default:
      return state;
  }
};
