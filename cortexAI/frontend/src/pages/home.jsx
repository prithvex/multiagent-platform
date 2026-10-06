import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase";
import api from "../../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Home() {

  // accessing the data in user state 
  const { userData } = useSelector(state => state.user)
  const dispatch = useDispatch()
  console.log(userData)
  // Send Firebase ID token to backend
  const handleLogin = async (token) => {
    try {
      const { data } = await api.post("/api/auth/login", { token });

      dispatch(setUsetdata(data))

    } catch (error) {
      console.error(
        "Backend login failed:",
        error.response?.data || error.message
      );
    }
  };

  // Google login
  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      // Get Firebase ID token
      const token = await result.user.getIdToken();

      console.log("Firebase user:", result.user);
      console.log("Firebase ID token:", token);

      // Send token to backend
      await handleLogin(token);
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      {/* show login popup only when there is no user data  */}
      {!userData && <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-500 mb-6">
          Sign in to continue
        </p>

        <button
          onClick={googleLogin}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-200"
        >
          Continue with Google
        </button>
      </div>}

    </div>
  );
}

export default Home;