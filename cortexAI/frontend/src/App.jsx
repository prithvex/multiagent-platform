import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase";
import api from "../utils/axios";

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      const response = await api.post("/auth/google", {
        token,
      });

      console.log("Login successful:", response.data);
    } catch (error) {
      console.error(error);
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md mx-4 rounded-2xl bg-white p-8 shadow-xl" onClick={handleGoogleLogin}>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-gray-500">
            Login to continue
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="mt-8 w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <span className="text-xl font-bold text-blue-500">G</span>

          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        {error && (
          <p className="mt-4 text-center text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;


