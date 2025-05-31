// import React from "react";
// import mqtt from "mqtt";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../app/store";
// import { setLightState } from "../features/light/lightSlice";

// interface Props {
//   client: mqtt.MqttClient | null;
//   topic: string;
// }

// const LightControl: React.FC<Props> = ({ client, topic }) => {
//   const dispatch = useDispatch();
//   const lightState = useSelector((state: RootState) => state.light.lightState);

//   const toggleLight = () => {
//     if (client) {
//       const newState = lightState === "ON" ? "OFF" : "ON";
//       client.publish(topic, newState, { qos: 1 });
//       dispatch(setLightState(newState));
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
      <button
        onClick={toggleLight}
        className={`px-6 py-3 rounded-lg text-white text-lg font-semibold ${
          lightState === "ON" ? "bg-red-500" : "bg-green-600"
        }`}
      >
        Turn {lightState === "ON" ? "OFF" : "ON"}
      </button>
      <p className="mt-4">Current Light State: {lightState}</p>
    </div>
  );
};

export default LightControl;