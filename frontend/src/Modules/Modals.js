import { ModalType } from "../Enums/Modal.js";

const { createSlice } = require("@reduxjs/toolkit");


const modalSlice = createSlice({
    name: 'modals',
    initialState: {
        modalType: ModalType.MEDIA,
        modalProps: {}
    },
    reducers: {
        showModal: (state, action) => {
            state.modalType = action.payload.modalType;
            state.modalProps = action.payload.modalProps;
        },
        hideModal: (state, action) => {
            state.modalType = null;
            state.modalProps = {};
        }
    }
    
})
export default modalSlice.reducer;
export const { showModal, hideModal } = modalSlice.actions;