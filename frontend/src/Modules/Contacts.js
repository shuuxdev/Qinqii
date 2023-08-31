const { createSlice } = require("@reduxjs/toolkit");


export const FETCH_CONTACTS = 'FETCH_CONTACTS';


const contactSlice = createSlice({
    initialState: [],
    name: 'contacts',
    reducers: {
        updateOnlineStatus: (state, action) => {
             state.forEach((contact) => {
                if(contact.recipient_id == action.payload.user_id)
                {
                    contact.status = action.payload.status;
                }
            })
        },
        fetchContacts: (state, action) => {
            return action.payload
        }
    }
})

export const {updateOnlineStatus, fetchContacts} = contactSlice.actions;
export default contactSlice.reducer;
