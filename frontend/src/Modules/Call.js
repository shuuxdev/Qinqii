import { createSlice } from "@reduxjs/toolkit"

import { CallModal } from "../Enums/CallModal.js"

const callSlice = createSlice({

    name: 'call',
    initialState: {
        call: null,
        param: null
    },
    reducers: {
        showCallModal: (state, action) => {
            return {
                ...state,
                call: CallModal.ONGOING,
                param: action.payload
            }
        },
        showIncomingCallModal: (state, action) => {
            return {
                ...state,
                call: CallModal.INCOMING,
                param: action.payload
            }
        },
        endCall: (state) => {
            return {
                ...state,
                call: CallModal.ENDED,
                param: null
            }
        }
    }
})
export const { showCallModal, showIncomingCallModal, endCall } = callSlice.actions
export default callSlice.reducer