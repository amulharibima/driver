import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';

let middlewares = applyMiddleware(thunk);

export const store = createStore(reducer, middlewares);
