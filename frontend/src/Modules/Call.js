import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    visible: false,
    mode: '',
};

const callSlice = createSlice({
    initialState,
    name: 'call',
    reducers: {
        displayOutGoingCallModal: (state) => {
            return {
                visible: true,
                mode: 'OUTGOING',
            };
        },
        displayIncomingCallModal: (state) => {
            return {
                visible: true,
                mode: 'INCOMING',
            };
        },
        hideCallModal: (state) => {
            return { visible: false };
        },
    },
});
export const {
    displayIncomingCallModal,
    displayOutGoingCallModal,
    hideCallModal,
} = callSlice.actions;
export default callSlice.reducer;
