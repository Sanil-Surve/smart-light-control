import React from "react";
import mqtt from "mqtt";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { setLightState } from "../features/light/lightSlice";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import Switch from "@mui/material/Switch";
// import FormControlLabel from "@mui/material/FormControlLabel";

interface Props {
  client: mqtt.MqttClient | null;
  topic: string;
}

const LightControl: React.FC<Props> = ({ client, topic }) => {
  const dispatch = useDispatch();
  const lightState = useSelector((state: RootState) => state.light.lightState);
  const user = useSelector((state: RootState) => state.auth.user);

  const toggleLight = async () => {
    if (client) {
      const newState = lightState === "ON" ? "OFF" : "ON";
      client.publish(topic, newState, { qos: 1 });
      dispatch(setLightState(newState));
      if (user) {
        const userDoc = doc(db, "lightStates", user.email);
        await setDoc(userDoc, { state: newState }, { merge: true });
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl shadow-md w-full max-w-sm">
      <Switch
        checked={lightState === "ON"}
        onChange={toggleLight}
        color="success"
        sx={{
          transform: "scale(1.5)",
          "& .MuiSwitch-thumb": {
            width: 25,
            height: 25,
          },
          "& .MuiSwitch-switchBase": {
            padding: 1,
          },
          "& .MuiSwitch-track": {
            borderRadius: 13,
            height: 20,
            width: 64,
            backgroundColor: lightState === "ON" ? "#22c55e" : "#ef4444",
            opacity: 1,
          },
        }}
      />
      <div className="mt-6">
        <h3
          className={`px-6 py-2 rounded-full text-white text-base font-medium ${lightState === "OFF" ? "bg-red-500" : "bg-green-600"
            }`}
        >
          {lightState === "OFF" ? "Light is OFF" : "Light is ON"}
        </h3>
      </div>
    </div>
  );
};

export default LightControl;