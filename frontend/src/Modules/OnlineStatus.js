const { createSlice } = require("@reduxjs/toolkit");



const onlineStatusSlice = createSlice({
    initialState: [],
    name: 'online-status',
    reducers: {
        updateOnlineStatus: (state, action) => {
            state.forEach((contact) => {
               if(contact.recipient_id == action.payload.user_id)
               {
                   contact.status = action.payload.status;
               }
           })
       }
    }
})

export const {updateOnlineStatus} = onlineStatusSlice.actions;
export default onlineStatusSlice.reducer;