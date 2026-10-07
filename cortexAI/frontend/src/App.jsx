import React, { useEffect } from "react";
import Home from "./pages/home.jsx";
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


