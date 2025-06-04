// import React from "react";
// import mqtt from "mqtt";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../app/store";
// import { setLightState } from "../features/light/lightSlice";
// import { doc, setDoc } from "firebase/firestore";
// import { db } from "../utils/firebase";

// interface Props {
//   client: mqtt.MqttClient | null;
//   topic: string;
// }

// const LightControl: React.FC<Props> = ({ client, topic }) => {
//   const dispatch = useDispatch();
//   const lightState = useSelector((state: RootState) => state.light.lightState);
//   const user = useSelector((state: RootState) => state.auth.user);

//   const toggleLight = async () => {
//     if (client) {
//       const newState = lightState === "ON" ? "OFF" : "ON";
//       client.publish(topic, newState, { qos: 1 });
//       dispatch(setLightState(newState));
//       if (user) {
//         const userDoc = doc(db, "lightStates", user.email);
//         await setDoc(userDoc, { state: newState }, { merge: true });
//       }
//     }
//   };

//   return (
//     <div className="flex flex-col items-center">
//       <button
//         onClick={toggleLight}
//         className={`px-6 py-3 rounded-lg text-white text-lg font-semibold ${
//           lightState === "ON" ? "bg-red-500" : "bg-green-600"
//         }`}
//       >
//         Turn {lightState === "ON" ? "OFF" : "ON"}
//       </button>
//       <p className="mt-4">Current Light State: {lightState}</p>
//     </div>
//   );
// };

// export default LightControl;

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
    <div className="flex flex-col items-center">
      <Switch
        checked={lightState === "ON"}
        onChange={toggleLight}
        color="success"
        sx={{
          transform: "scale(1.5)", // Increase size by 1.5x
          "& .MuiSwitch-thumb": {
            width: 28,
            height: 28,
          },
          "& .MuiSwitch-switchBase": {
            padding: 1,
          },
          "& .MuiSwitch-track": {
            borderRadius: 26 / 2,
            height: 20,
            width: 100
          },
        }}
      />
      {/* <div className="flex flex-row items-center rounded-2xl mt-3">
        <h3 className={`text-white ${lightState === "OFF" ? "bg-red-500" : "bg-green-600"}`}>{lightState}</h3>
      </div> */}
      <div className="flex items-center mt-5">
        <h3
          className={`px-4 py-2 rounded-2xl text-white text-sm font-semibold shadow-md ${lightState === "OFF" ? "bg-red-500" : "bg-green-600"
            }`}
        >
          {lightState === "OFF" ? "Light is OFF" : "Light is ON"}
        </h3>
      </div>
    </div>
  );
};

export default LightControl;