import { createSlice } from "@reduxjs/toolkit";
import { use } from "react";

const userSlice = createSlice({
    name: "user",
    initialState:{
        userData:null,
    },
    reducers:{
        setUsetdata: (state, action)=>{
            state.userData= action.payload
        }
    }
})

//export reducers 
export const {setUsetdata} = userSlice.actions

//export slice 
export default userSlice.reducer