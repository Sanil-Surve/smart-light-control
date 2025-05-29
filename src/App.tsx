// import React, { useEffect, useState } from "react";
// import mqtt from "mqtt";
// import Lottie from "react-lottie-player";
// import lightData from "./assets/bulb-animation.json";

// const MQTT_BROKER = import.meta.env.VITE_MQTT_BROKER;
// const MQTT_USERNAME = import.meta.env.VITE_MQTT_USERNAME;
// const MQTT_PASSWORD = import.meta.env.VITE_MQTT_PASSWORD;
// const HOME_ID = import.meta.env.VITE_HOME_ID;
// const TOPIC_LIGHT = `${HOME_ID}/light`;

// const App: React.FC = () => {
//   const [client, setClient] = useState<mqtt.MqttClient | null>(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [lightState, setLightState] = useState<"ON" | "OFF">("OFF");

//   // Connect to MQTT broker
//   useEffect(() => {
//     const mqttClient = mqtt.connect(MQTT_BROKER, {
//       username: MQTT_USERNAME,
//       password: MQTT_PASSWORD,
//       connectTimeout: 4000,
//       clean: true,
//       reconnectPeriod: 1000,
//     });

//     mqttClient.on("connect", () => {
//       console.log("Connected to MQTT broker!");
//       setIsConnected(true);
//       mqttClient.subscribe(TOPIC_LIGHT);
//     });

//     mqttClient.on("error", (err) => {
//       console.error("MQTT Connection error:", err);
//       mqttClient.end();
//     });

//     mqttClient.on("message", (topic, message) => {
//       if (topic === TOPIC_LIGHT) {
//         setLightState(message.toString() as "ON" | "OFF");
//       }
//     });

//     setClient(mqttClient);

//     return () => {
//       mqttClient.end();
//     };
//   }, []);

//   const toggleLight = () => {
//     if (client && isConnected) {
//       const newState = lightState === "ON" ? "OFF" : "ON";
//       client.publish(TOPIC_LIGHT, newState, { qos: 1 });
//       setLightState(newState);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
//       <h1 className="text-3xl font-bold mb-4">Smart Light Control</h1>
//       <div className="mb-4 text-lg">
//         Status:{" "}
//         <span className={isConnected ? "text-green-500" : "text-red-500"}>
//           {isConnected ? "Connected" : "Disconnected"}
//         </span>
//       </div>
//       <div className="w-64 h-64 mb-4 flex items-center justify-center">
//           <Lottie
//             loop
//             animationData={lightData}
//             play
//             className="w-full h-full rounded-full overflow-hidden"
//           />
//       </div>
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

// export default App;

import React, { useEffect, useState } from "react";
import mqtt from "mqtt";
import Lottie from "react-lottie-player";
import lightData from "./assets/bulb-animation.json";
import { useDispatch, useSelector } from "react-redux";
import { setConnected } from "./features/mqtt/mqttSlice";
import { setLightState } from "./features/light/lightSlice";
import LightControl from "./components/LightControl";
import { RootState } from "./app/store";

const MQTT_BROKER = import.meta.env.VITE_MQTT_BROKER;
const MQTT_USERNAME = import.meta.env.VITE_MQTT_USERNAME;
const MQTT_PASSWORD = import.meta.env.VITE_MQTT_PASSWORD;
const HOME_ID = import.meta.env.VITE_HOME_ID;
const TOPIC_LIGHT = `${HOME_ID}/light`;

const App: React.FC = () => {
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const isConnected = useSelector((state: RootState) => state.mqtt.isConnected);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const mqttClient = mqtt.connect(MQTT_BROKER, {
  //     username: MQTT_USERNAME,
  //     password: MQTT_PASSWORD,
  //     connectTimeout: 4000,
  //     clean: true,
  //     reconnectPeriod: 1000,
  //   });

  //   mqttClient.on("connect", () => {
  //     dispatch(setConnected(true));
  //     mqttClient.subscribe(TOPIC_LIGHT);
  //   });

  //   mqttClient.on("error", (err) => {
  //     console.error("MQTT Error:", err);
  //     dispatch(setConnected(false));
  //     mqttClient.end();
  //   });

  //   mqttClient.on("message", (topic, message) => {
  //     if (topic === TOPIC_LIGHT) {
  //       dispatch(setLightState(message.toString() as "ON" | "OFF"));
  //     }
  //   });

  //   setClient(mqttClient);

  //   return () => mqttClient.end();
  // }, []);

  //   // Connect to MQTT broker
  useEffect(() => {
    const mqttClient = mqtt.connect(MQTT_BROKER, {
      username: MQTT_USERNAME,
      password: MQTT_PASSWORD,
      connectTimeout: 4000,
      clean: true,
      reconnectPeriod: 1000,
    });

    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker!");
      dispatch(setConnected(true));
      mqttClient.subscribe(TOPIC_LIGHT);
    });

    mqttClient.on("error", (err) => {
      console.error("MQTT Connection error:", err);
      dispatch(setConnected(false));
      mqttClient.end();
    });

    mqttClient.on("message", (topic, message) => {
      if (topic === TOPIC_LIGHT) {
        setLightState(message.toString() as "ON" | "OFF");
      }
    });

    setClient(mqttClient);

    return () => {
      mqttClient.end();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <h1 className="text-3xl font-bold mb-4">Smart Light Control</h1>
      <div className="mb-4 text-lg">
        Status:{" "}
        <span className={isConnected ? "text-green-500" : "text-red-500"}>
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>
      <div className="w-64 h-64 mb-4 flex items-center justify-center">
        <Lottie loop animationData={lightData} play className="w-full h-full rounded-full overflow-hidden" />
      </div>
      <LightControl client={client} topic={TOPIC_LIGHT} />
    </div>
  );
};

export default App;