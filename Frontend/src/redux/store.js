
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import {persistReducer, persistStore} from "redux-persist"
import storage from "redux-persist/lib/storage"
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
//Here we have to define store
//in store define the reducers

const persistConfig = {
  key: "auth",
  storage
}

const persistedUserReducer = persistReducer(persistConfig, userReducer)

const store = configureStore({
  reducer: {
    user: persistedUserReducer, // Add reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  
});

const persistor = persistStore(store)

export {store, persistor};
