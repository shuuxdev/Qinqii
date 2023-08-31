import { Severity } from "../Enums/FetchState.js";
import { GET_Story } from "../Helper/Axios.js";
import { goToStory } from "./StoryUI.js";
import { ShowNotification } from "./UI.js";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const storiesSlice = createSlice({
    name: "stories",
    initialState: [],

    reducers: {
        fetchStories: (state, action) => {
            return [...action.payload]
        },
        addFrames: (state, action) => 
        {
            state.forEach(story => {
                if(story.id == action.payload.id) 
                {
                    story.frames = action.payload.frames; 
                    story.viewers = action.payload.viewers;
                }
            })
        }
            
        
    },
    // extraReducers: (builder) => {
    //     builder.addCase(addFramesThunk.rejected, (state, action) => {
    //         console.log(action.error)
    //     })
    // }
    
})

export const addFramesThunk = createAsyncThunk('stories/addFramesThunk', async ({story_id,navigate}, thunkAPI) => {
    const [story, error] =await GET_Story(story_id)
    if(error)
    {
        thunkAPI.dispatch(ShowNotification({severity: Severity.ERROR, content: 'Load story không thành công'}))
    }
    else {
        const {addFrames} = storiesSlice.actions
        thunkAPI.dispatch(addFrames(story))
        const index = thunkAPI.getState().stories.findIndex((story) => story.id == story_id)
        thunkAPI.dispatch(goToStory({ index }))
        navigate(`/story/${story.id}`)
    }
    
})

export const {fetchStories, addFrames} = storiesSlice.actions
export default storiesSlice.reducer;