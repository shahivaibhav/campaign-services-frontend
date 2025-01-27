
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

//Here we have to define store
//in store define the reducers

const store = configureStore({
  reducer: {
    user: userReducer, // Add reducers here
  },
});

export default store;
