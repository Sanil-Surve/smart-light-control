import React, { useEffect, useState } from "react";
import mqtt from "mqtt";
import Lottie from "react-lottie-player";
import lightData from "./assets/bulb-animation.json";
import { useDispatch, useSelector } from "react-redux";
import { setConnected } from "./features/mqtt/mqttSlice";
import { setLightState } from "./features/light/lightSlice";
import { getLightState, logout } from "./utils/firebase";
import { setUser, clearUser } from "./features/auth/authSlice";
import LightControl from "./components/LightControl";
import { AppDispatch, RootState } from "./app/store";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "./utils/firebase";
import Login from "./components/Login";

const MQTT_BROKER = import.meta.env.VITE_MQTT_BROKER;
const MQTT_USERNAME = import.meta.env.VITE_MQTT_USERNAME;
const MQTT_PASSWORD = import.meta.env.VITE_MQTT_PASSWORD;
const HOME_ID = import.meta.env.VITE_HOME_ID;
const TOPIC_LIGHT = `${HOME_ID}/light`;

const App: React.FC = () => {
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const isConnected = useSelector((state: RootState) => state.mqtt.isConnected);
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUser({ name: user.displayName!, email: user.email!, photoURL: user.photoURL! }));
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

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
    });

    mqttClient.on("error", (err) => {
      console.error("MQTT Connection error:", err);
      dispatch(setConnected(false));
      mqttClient.end();
    });

    mqttClient.on("message", (topic, message) => {
      if (topic === TOPIC_LIGHT) {
        const lightState = message.toString() as "ON" | "OFF";
        dispatch(setLightState(lightState));
        if (user) {
          // const userDoc = doc(db, "lightStates", user.email);
          // setDoc(userDoc, { state: lightState }, { merge: true });
          const docRef = doc(db, "lightStates", HOME_ID); // or deviceId
          setDoc(docRef, { state: lightState }, { merge: true });
        }
      }
    });

    const fetchLightState = async () => {
      if (user) {
        const state = await getLightState(HOME_ID);
        if (state === "ON" || state === "OFF") {
          dispatch(setLightState(state));
        }
      }
    };

    fetchLightState();

    mqttClient.subscribe(TOPIC_LIGHT);
    setClient(mqttClient);

    return () => {
      mqttClient.unsubscribe(TOPIC_LIGHT);
      mqttClient.end();
    };
  }, [dispatch, user]);


  return (
    <React.Fragment>
      {user ? (
        <>
          <header className="text-gray-600 body-font text-shadow-amber-50">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
              <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                <p className="mr-5 hover:text-gray-900 text-2xl" >Welcome, {user.name}</p>
              </nav>
              <button className="hover:text-red-900 text-red-500" onClick={logout}>Logout</button>
            </div>
          </header>

          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
            <h1 className="text-3xl font-extrabold mb-4 text-blue-500">Smart Light Control</h1>
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
        </>
      ) : (
        <Login />
      )}
    </React.Fragment>

  );
};

export default App;