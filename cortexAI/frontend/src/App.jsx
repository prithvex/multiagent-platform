import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase";
import api from "../utils/axios";
import Home from "./pages/home"
import { useEffect } from "react";
import getCurrentUser from "./features/getCurrentUser";
import { useDispatch } from "react-redux";
import { setUsetdata } from "./redux/user";

function App() {
 const dispatch = useDispatch()
 dispatch(setUsetdata(data))
  useEffect(()=>{
    const getUser= async () =>{
      const data= await getCurrentUser()
    }
    getUser()
  }, [])

  return (
    <>
    <Home/> 
    </>
  )
}

export default App;


