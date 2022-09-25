import {PHONE, OTP, EMAIL} from '../case type/AuthCase';

const initialState = {
  username: null,
  phone: null,
  email: null,
  otp: null,
};

export const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case PHONE:
      return {
        ...state,
        phone: action.phone,
      };
    case EMAIL:
      return {
        ...state,
        email: action.email,
      };
    case OTP:
      return {
        ...state,
        otp: action.otp,
      };
    default:
      return state;
  }
};
