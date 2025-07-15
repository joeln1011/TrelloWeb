import { configureStore } from '@reduxjs/toolkit';
import { activeBoardReducer } from './activeBoard/activeBoardSlice';
import { userReducer } from './user/userSlice';
import { activeCardReducer } from './activeCard/activeCardSlice';
import { notificationsReducer } from './notifications/notificationsSlice';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootPersistConfig = {
  key: 'root',
  storage, // Local storage for persistence
  whitelist: ['user'], // Only persist the user slice
};

// Import reducers
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer,
  activeCard: activeCardReducer,
  notifications: notificationsReducer,
});

const persistReducers = persistReducer(rootPersistConfig, reducers);

export const store = configureStore({
  reducer: persistReducers,

  // Fix warning error when implementing redux-persist
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
