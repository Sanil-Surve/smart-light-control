import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import mqttReducer from "../features/mqtt/mqttSlice";
import lightReducer from "../features/light/lightSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["light"], // Persist light state only
};

const rootReducer = combineReducers({
  mqtt: mqttReducer,
  light: lightReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;