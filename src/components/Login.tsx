import React from "react";
import { signInWithGoogle } from "../utils/firebase";
import Lottie from "react-lottie-player";
import loginAnimation from "../assets/login.json"; 

const Login: React.FC = () => {
  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-100 h-100 mb-6">
        <Lottie
          loop
          animationData={loginAnimation}
          play
          className="w-full h-full"
        />
      </div>
      <button
        onClick={handleLogin}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
      >
        Login with Google
      </button>
    </div>
  );
};

export default Login;