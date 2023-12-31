import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ENTITY } from '../Enums/Entity.js';
import { Severity } from '../Enums/FetchState.js';
import {
    CREATE_Comment,
    DELETE_Comment,
    DELETE_Post,
    EDIT_Comment,
    GET_Posts,
    POST_CreateNewPost, POST_UploadAttachments,
    SEND_React,
    UNDO_REACT,
    UPLOAD_Attachments,
} from '../Helper/Axios.js';
import {
    CloseDialog,
    ShowNotification,
} from './UI.js';
import { getVideoFirstFrame } from '../Helper/GetVideoFirstFrame';
import { GetAttachmentType } from '../Helper/GetAttachmentType';

export const FETCH_POSTS = 'FETCH_POSTS';




const postSlice = createSlice({
     name: 'posts',
     initialState: [],
     reducers:{
            fetchPosts: (state, action) => {
                return action.payload;
            },
            addComment: (state, action) => {
                    state.map((post) => {
                        if (post.id === action.payload.post_id) {
                            post.comments = [...post.comments, action.payload];
                        }
                        return post;
                    })
            },
            removeComment: (state, action) => {
                state.map((post) => {
                        if (post.id === action.payload.post_id) {
                            post.comments = [
                                ...post.comments.filter(
                                    (comment) =>
                                        comment.id !== action.payload.comment_id
                                ),
                            ];
                        }
                        return post;
                    })
               
            },
            updateComment: (state, action) => {
                state.map((post) => {
                        if (post.id === action.payload.post_id) {
                            post.comments = [
                                ...post.comments.map((comment) => {
                                    if (comment.id === action.payload.id)
                                        comment = action.payload;
                                    return comment;
                                }),
                            ];
                        }
                        return post;
                    })
                
            },
            updatePost: (state, action) => {
                state.map((post) => {
                        if (post.id === action.payload.id) {
                            post.reactions = action.payload.reactions;
                        }
                        return post;
                    })
                
            },
            addComments: (state, action) => {
                state.map((post) => {
                        if (post.id === action.payload.post_id) {
                            post.comments = [...post.comments, ...action.payload.comments];
                        }
                        return post;
                    })

            },
            removePost: (state, action) => {
                return state.filter(post => post.id !== action.payload);
            }
     },
    extraReducers: (builder) => {
         builder.addCase(fetchPostsThunk.fulfilled, (state, action) => {
             Object.assign(state, action.payload);
         });

    }
})

export const fetchPostsThunk = createAsyncThunk("posts/fetchPosts", async () => {
    const response = await GET_Posts();
    if(response.status === 200){
        return response.data;
    }
    return [];
})
export const {removePost,addComments, fetchPosts, addComment, removeComment, updateComment, updatePost } = postSlice.actions;
export default postSlice.reducer;
