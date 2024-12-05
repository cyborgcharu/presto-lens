// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { bleReducer } from '../services/BLEManager';

export const store = configureStore({
  reducer: {
    ble: bleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore BLE device objects which aren't serializable
        ignoredActions: ['ble/setConnectedDevice'],
        ignoredPaths: ['ble.connectedDevice'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;