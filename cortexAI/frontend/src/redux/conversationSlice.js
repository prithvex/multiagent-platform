import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
    name: "conversation",
    initialState: {
        conversations: [],
        selectedConversation: null
    },
    reducers: {
        // all data is overrided here
        setConversation: (state, action) => {
            state.conversations = action.payload
        },
        // add one conversation
        addConversation: (state, action) => {
            // push at the start of the array
            state.conversations.unshift(action.payload)
        },
        setSelectedConversation: (state, action) => {
            state.selectedConversation = action.payload
        },
        updateConversationTitle: (state, action) => {
            const { conversationId, title } = action.payload;
            const conv = state.conversations.find((c) => (c._id || c.id) === conversationId);
            if (conv) {
                conv.title = title;
            }
            if (state.selectedConversation && (state.selectedConversation._id || state.selectedConversation.id) === conversationId) {
                state.selectedConversation.title = title;
            }
        },
        removeConversation: (state, action) => {
            const conversationId = action.payload;
            state.conversations = state.conversations.filter(
                (c) => (c._id || c.id) !== conversationId
            );
            if (state.selectedConversation && (state.selectedConversation._id || state.selectedConversation.id) === conversationId) {
                state.selectedConversation = state.conversations[0] || null;
            }
        }
    }
})

//export reducers 
export const { 
    setConversation, 
    addConversation, 
    setSelectedConversation, 
    updateConversationTitle, 
    removeConversation 
} = conversationSlice.actions

//export slice 
export default conversationSlice.reducer