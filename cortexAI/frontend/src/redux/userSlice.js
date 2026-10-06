import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload
        }
    }
})

//export reducers 
export const { setUserData } = userSlice.actions

//export slice 
export default userSlice.reducer