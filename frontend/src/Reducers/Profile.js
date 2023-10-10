import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    GET_Posts,
    GET_UserFriends,
    GET_UserImages,
    GET_UserPosts,
    GET_UserProfile,
    GET_UserVideos,
} from '../Helper/Axios';
import Cookies from 'react-cookie/cjs/Cookies';
export const fetchProfileAction = (profile) => ({
    type: FETCH_PROFILE,
    payload: profile,
});



export const profileApiSlice = createApi({
    reducerPath: 'profileAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/',
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + new Cookies().get('Token'),
        }
    }),
    
    endpoints: (builder) => ({
        getProfile: builder.query({query: (user_id) => `user?id=${user_id}`}),
        getPosts: builder.query({query: ({user_id, page, pageSize}) => `user/posts?id=${user_id}&page=${page}&pageSize=${pageSize}`}),
        getImages: builder.query({query: ({user_id, page, pageSize}) => `user/images?id=${user_id}&page=${page}&pageSize=${pageSize}`}),
        getVideos: builder.query({query: ({user_id, page, pageSize}) => `user/videos?id=${user_id}&page=${page}&pageSize=${pageSize}`}),
        getFriends: builder.query({query: ({user_id, page, pageSize}) => `user/friends?id=${user_id}&page=${page}&pageSize=${pageSize}`}),
        getPeopleYouMayKnow: builder.query({query: ({pageSize, page}) => `user/people-you-may-know?page_size=${pageSize}&page=${page}`})
    })
})

export const FETCH_PROFILE = 'FETCH_PROFILE';
const def = {
    id: 0,
    name: '',
    background: '',
    avatar: '',
    posts: [],
    videos: [],
    images: [],
    friends: [],
    isLoading: false,
    isSucceed: false,
    error: null,
};


const profileSlice = createSlice({
    name: 'profile',
    initialState: def,
    reducers: {
        fetchProfile: (state,action) => {
            return {...state, ...action.payload}
        },
        fetchPosts: (state, action) => {
            state.posts = action.payload;
        },
        fetchVideos: (state, action) => {
            state.videos = action.payload;
        },
        fetchImages: (state, action) => {
            state.images = action.payload;
        },
        fetchFriends: (state, action) => {
            state.friends = action.payload;
        },
        addComment: (state, action) => {
            state.posts.map((post) => {
                if (post.id === action.payload.post_id) {
                    post.comments = [...post.comments, action.payload];
                }
                return post;
            })
        },
        removeComment: (state, action) => {
            state.posts.map((post) => {
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
            state.posts.map((post) => {
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
            state.posts = [...state.posts.map((post) => {
                if (post.id === action.payload.id) {
                    post.reactions = action.payload.reactions;
                }
                return post;
            })]
        },
        removePost: (state, action) => {
            state.posts = state.posts.filter(post => post.id !== action.payload);
            state.videos = state.videos.filter(video => video.post_id !== action.payload);
            state.images = state.images.filter(image => image.post_id !== action.payload);
        }

    },
    extraReducers: (builder) => {
        const {getProfile,getPosts, getVideos} = profileApiSlice.endpoints;

        builder.addCase(fetchPostsThunk.pending, (state, action) => {
            state.posts = [];
            state.isLoading = true;
            state.isSucceed = false;
            state.error = null;
        });
        builder.addCase(fetchPostsThunk.fulfilled, (state, action) => {
            state.posts = action.payload;
            state.isLoading = false;
            state.isSucceed = true;
            state.error = null;
        });
        builder.addCase(fetchPostsThunk.rejected, (state, action) => {
            state.posts = [];
            state.isLoading = false;
            state.isSucceed = false;
            state.error = action.error;
        });
        builder.addCase(fetchProfileThunk.pending, (state, action) => {
            state.isLoading = true;
            state.isSucceed = false;
            state.error = null;
        })
        builder.addCase(fetchProfileThunk.fulfilled, (state, action) => {
            Object.assign(state, action.payload);
            state.isLoading = false;
            state.isSucceed = true;
            state.error = null;
        });

        builder.addCase(fetchProfileThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.isSucceed = false;
            state.error = action.error;
        });
        builder.addCase(fetchVideosThunk.pending, (state, action) => {
            state.isLoading = true;
            state.isSucceed = false;
            state.error = null;
        });
        builder.addCase(fetchVideosThunk.fulfilled, (state, action) => {
            state.videos = action.payload;
            state.isLoading = false;
            state.isSucceed = true;
            state.error = null;
        });
        builder.addCase(fetchVideosThunk.rejected, (state, action) => {
            state.videos = [];
            state.isLoading = false;
            state.isSucceed = false;
            state.error = action.error;
        })
        builder.addCase(fetchImagesThunk.pending, (state, action) => {
            state.isLoading = true;
            state.isSucceed = false;
            state.error = null;
        })
        builder.addCase(fetchImagesThunk.fulfilled, (state, action) => {
            state.images = action.payload;
            state.isLoading = false;
            state.isSucceed = true;
            state.error = null;
        })
        builder.addCase(fetchImagesThunk.rejected, (state, action) => {
            state.images = [];
            state.isLoading = false;
            state.isSucceed = false;
            state.error = action.error;
        })
        builder.addCase(fetchFriendsThunk.pending, (state, action) => {
            state.isLoading = true;
            state.isSucceed = false;
            state.error = null;
        })
        builder.addCase(fetchFriendsThunk.fulfilled, (state, action) => {
            state.friends = action.payload;
            state.isLoading = false;
            state.isSucceed = true;
            state.error = null;
        });
        builder.addCase(fetchFriendsThunk.rejected, (state, action) => {
            state.friends = [];
            state.isLoading = false;
            state.isSucceed = false;
            state.error = action.error;
        })
        builder.addMatcher(getProfile.matchFulfilled, (state, action) => {
            state = action.payload;
        });
        builder.addMatcher(getPosts.matchFulfilled,(state, action) => {
            state.posts = action.payload;
        });
        builder.addMatcher(getVideos.matchFulfilled,(state, action) => {
            state.videos = action.payload;
        });
    }
})
export const fetchPostsThunk = createAsyncThunk('profile/fetchPostsThunk', async (params, thunkAPI) => {
    const [data, error] = await GET_UserPosts(params);
    if (error) {
        return thunkAPI.rejectWithValue(error);
    }
    return data;
})
export const fetchProfileThunk = createAsyncThunk('profile/fetchProfileThunk', async (user_id, thunkAPI) => {

    const [data,error] = await GET_UserProfile(user_id);
    if (error) {
        return thunkAPI.rejectWithValue(error);
    }
    return data;
})
export const fetchVideosThunk = createAsyncThunk('profile/fetchVideosThunk', async (params, thunkAPI) => {
    const [data, error] = await GET_UserVideos(params);
    if (error) {
        return thunkAPI.rejectWithValue(error);
    }
    return data;
})
export const fetchImagesThunk = createAsyncThunk('profile/fetchImagesThunk', async (params, thunkAPI) => {
    const [data, error] = await GET_UserImages(params);
    if (error) {
        return thunkAPI.rejectWithValue(error);
    }
    return data;
})
export const fetchFriendsThunk = createAsyncThunk('profile/fetchFriendsThunk', async (params, thunkAPI) => {
    const [data, error] = await GET_UserFriends(params);
    if (error) {
        return thunkAPI.rejectWithValue(error);
    }
    return data;
})
export const {useGetFriendsQuery,useGetProfileQuery, useGetPostsQuery, useGetImagesQuery, useGetVideosQuery, useGetPeopleYouMayKnowQuery} = profileApiSlice
export const {removePost,fetchProfile, fetchPosts,updatePost, updateComment, removeComment,addComment} = profileSlice.actions
export default profileSlice.reducer;
