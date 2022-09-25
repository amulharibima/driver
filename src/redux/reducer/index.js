import {combineReducers} from 'redux';
import {DriverReducer} from './DriverReducer';
import {AuthReducer} from './AuthReducer';
import {DriverProfileReducer} from './DriverProfileReducer';
import {OrderReducer} from './OrderReducer';

const reducer = combineReducers({
  driver: DriverReducer,
  auth: AuthReducer,
  profile: DriverProfileReducer,
  order: OrderReducer,
});

export default reducer;
