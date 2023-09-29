const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const friendSlice = createSlice({
    initialState: [],
    name: 'friends',
    reducers: {
        fetchFriends: (state, action) => {
            return action.payload;
        }
    },
    
})



export const {fetchFriends} = friendSlice.actions;
export default friendSlice.reducer;
