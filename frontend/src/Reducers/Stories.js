import { POST_UpdateStoryViewer } from '../Helper/Axios.js';

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const storiesSlice = createSlice({
    name: "stories",
    initialState: [],

    reducers: {
        fetchStories: (state, action) => {
            return [ ...action.payload]
        },
        fetchMoreStories: (state, action) => {
            return [...state, ...action.payload]
        },
        markStoryAsSeen: (state, action) => {
            const story = state.find(story => story.id === action.payload)
            if (story) {
                story.seen = true
            }
        }
        
    },
})

export const updateViewerThunk = createAsyncThunk(
    'stories/updateViewerThunk',
    async (story_id, thunkAPI) => {
        const [statusCode, error] = await POST_UpdateStoryViewer(story_id)
        if (statusCode === 200) {
            thunkAPI.dispatch(markStoryAsSeen(story_id))
        }
    }
)

export const {fetchStories,markStoryAsSeen,fetchMoreStories} = storiesSlice.actions
export default storiesSlice.reducer;