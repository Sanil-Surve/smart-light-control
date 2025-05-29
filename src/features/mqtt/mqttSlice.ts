import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MqttState {
  isConnected: boolean;
}

const initialState: MqttState = {
  isConnected: false,
};

const mqttSlice = createSlice({
  name: "mqtt",
  initialState,
  reducers: {
    setConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
  },
});

export const { setConnected } = mqttSlice.actions;
export default mqttSlice.reducer;