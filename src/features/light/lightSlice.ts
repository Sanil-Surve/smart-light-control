import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LightState {
  lightState: "ON" | "OFF";
}

const initialState: LightState = {
  lightState: "OFF",
};

const lightSlice = createSlice({
  name: "light",
  initialState,
  reducers: {
    setLightState(state, action: PayloadAction<"ON" | "OFF">) {
      state.lightState = action.payload;
    },
  },
});

export const { setLightState } = lightSlice.actions;
export default lightSlice.reducer;