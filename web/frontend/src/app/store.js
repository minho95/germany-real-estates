// import { taskMiddleware } from 'react-palm'
import keplerGlReducer from 'kepler.gl/reducers';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { enhanceReduxMiddleware } from 'kepler.gl/middleware';
import thunk from 'redux-thunk';

import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';

import flatsReducer from '../features/flats/flatsSlice'

const initialState = {};
const reducers = combineReducers({
  // <-- mount kepler.gl reducer in your app
  keplerGl: keplerGlReducer,
  flats: flatsReducer,
});

const middlewares = enhanceReduxMiddleware([thunk])
const enhancers = [applyMiddleware(...middlewares)]

export default createStore(
  reducers,
  initialState,
  compose(...enhancers)
);
