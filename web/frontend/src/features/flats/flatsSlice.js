import { createSlice } from '@reduxjs/toolkit';
import {ActionTypes} from 'kepler.gl/actions'
import config from '../../config'

export const flatsSlice = createSlice({
  name: 'flats',
  initialState: {
    all: [],
    current: null,
    cords: null,
    percentiles: null,
    updatedFlats: false,
  },
  reducers: {
    setUpdatedFlats: (state, val) => {
      state.updatedFlats = val
    },
    setFlats: (state, action) => {
      state.all = action.payload;
      state.updatedFlats = true;
    },
    setPercentiles: (state, action) => {
      state.percentiles = action.payload;
    },
  },
});

export const { setFlats, setPercentiles, setUpdatedFlats } = flatsSlice.actions;

const { apiUrl } = config

export const loadFlats = (minLat, maxLat, minLong, maxLong) => dispatch => {
  fetch(`${apiUrl}/flats?minLat=${minLat}&maxLat=${maxLat}&minLong=${minLong}&maxLong=${maxLong}`)
    .then(res => res.json())
    .then(res => { 
      dispatch(setFlats(res))
    })
}

export const loadFlatsInCity = (city) => dispatch => {
  fetch(`${apiUrl}/flats?city=${city}`)
    .then(res => res.json())
    .then(res => {
      dispatch(setFlats(res))
    })
}

export const loadPercentiles = () => dispatch => {  
  fetch(`${apiUrl}/percentiles`)
    .then(res => res.json())
    .then(res => { dispatch(setPercentiles(res)) })
}

export const setUpdatedFlatsThunk = (val) => dispatch => {
  dispatch(setUpdatedFlats(val))
}

export const selectFlats = state => state.flats.all

export default flatsSlice.reducer;
