import {
  ID,
  NAME,
  EMAIL,
  PHONE_PROFILE,
  PICTURE,
  ADDRESS,
} from '../case type/DriverProfileCase';
import Avatar from '../../assets/profile.png';
import { Image } from 'react-native';

const avatar = Image.resolveAssetSource(Avatar).uri;
const initialState = {
  id: null,
  name: null,
  email: null,
  phone_profile: avatar,
  picture: null,
  address: null,
  income: null,
  identify: null,
  is_suspended: false,
  alasan_suspend: ''
};

export const DriverProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case ID:
      return {
        ...state,
        id: action.id,
      };
    case NAME:
      return {
        ...state,
        name: action.name,
      };
    case EMAIL:
      return {
        ...state,
        email: action.email,
      };
    case PHONE_PROFILE:
      return {
        ...state,
        phone_profile: action.phone_profile,
      };
    case PICTURE:
      return {
        ...state,
        picture: action.picture,
      };
    case ADDRESS:
      return {
        ...state,
        address: action.address,
      };
    case 'INCOME':
      return {
        ...state,
        income: action.income,
      };
    case 'IDENTIFY':
      return {
        ...state,
        identify: action.identify,
      };
    case 'IS_SUSPENDED':
      return {
        ...state,
        is_suspended: action.is_suspended,
        alasan_suspend: action.alasan_suspend,
      };
    default:
      return state;
  }
};
