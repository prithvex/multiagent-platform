import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase";
import api from "../utils/axios";
import Home from "./pages/home.jsx"
import { useEffect } from "react";
import getCurrentUser from "./features/getCurrentUser";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";

function App() {
  const dispatch = useDispatch()
  //dispatch(setUserData(data))
  useEffect(() => {
    const getUser = async () => {
      const data = await getCurrentUser();
      if (data) dispatch(setUserData(data));
    };
    getUser();
  }, [dispatch]);


  return (
    <>
      <Home />
    </>
  )
}

export default App;


