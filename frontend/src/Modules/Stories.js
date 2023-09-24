import { Severity } from "../Enums/FetchState.js";
import { GET_Story, POST_UpdateStoryViewer } from '../Helper/Axios.js';
import { goToStory } from "./StoryUI.js";
import { ShowNotification } from "./UI.js";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const storiesSlice = createSlice({
    name: "stories",
    initialState: [],

    reducers: {
        fetchStories: (state, action) => {
            return [ ...action.payload]
        },

        
    },
})

export const updateViewerThunk = createAsyncThunk(
    'stories/updateViewerThunk',
    async (story_id, thunkAPI) => {
        const [statusCode, error] = await POST_UpdateStoryViewer(story_id)

    }
)

export const {fetchStories} = storiesSlice.actions
export default storiesSlice.reducer;