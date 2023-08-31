import { createSlice } from "@reduxjs/toolkit";

 const StoryUISlice = createSlice({
    initialState: {currentSelectedStoryIndex: 0},
    name: "storyUI",
    reducers: {
        goToStory: (state, action) => {
           state.currentSelectedStoryIndex = action.payload.index;
        }
    }
})

export  default StoryUISlice.reducer;
export const {goToStory} = StoryUISlice.actions