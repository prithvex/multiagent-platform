import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name: "message",
    initialState: {
        messages: [], // all messages are here 
    },
    reducers: {
        // all data is overrided here
        setMessages: (state, action) => {
            state.messages = action.payload
        },
        // add one conversation
        addMessage: (state, action) => {
            // push at the start of the array
            state.messages.push(action.payload)
        },
        updateMessage: (state, action) => {
            const { messageId, content } = action.payload;
            const msg = state.messages.find((m) => (m._id || m.id) === messageId);
            if (msg) {
                msg.content = content;
            }
        },
        removeMessage: (state, action) => {
            const messageId = action.payload;
            state.messages = state.messages.filter(
                (m) => (m._id || m.id) !== messageId
            );
        }
    }
})

//export reducers 
export const {
    setMessages,
    addMessage,
    updateMessage,
    removeMessage
} = messageSlice.actions

//export slice 
export default messageSlice.reducer