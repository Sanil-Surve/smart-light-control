import React from "react";
import { signInWithGoogle } from "../utils/firebase";

const Login: React.FC = () => {
    const handleLogin = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error("Google sign-in failed:", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
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