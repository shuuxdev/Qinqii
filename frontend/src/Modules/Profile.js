import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { createSlice } from '@reduxjs/toolkit';

export const fetchProfileAction = (profile) => ({
    type: FETCH_PROFILE,
    payload: profile,
});

function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }
}

export const profileApiSlice = createApi({
    reducerPath: 'profileAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://localhost:7084/',
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + getCookie('Token'),
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
};


const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        posts: []
    },
    reducers: {
        fetchProfile: (state,action) => {
            return {...state, ...action.payload}
        },
        fetchPosts: (state, action) => {
            state.posts = action.payload;
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
        }

    },
    extraReducers: (builder) => {
        const {getProfile,getPosts} = profileApiSlice.endpoints;
        builder.addMatcher(getProfile.matchFulfilled, (state, action) => {
            state = action.payload;
        });
        builder.addMatcher(getPosts.matchFulfilled,(state, action) => {
            state.posts = action.payload;
        })
    }
})

export const {useGetFriendsQuery,useGetProfileQuery, useGetPostsQuery, useGetImagesQuery, useGetVideosQuery, useGetPeopleYouMayKnowQuery} = profileApiSlice
export const {fetchProfile, fetchPosts,updatePost, updateComment, removeComment,addComment} = profileSlice.actions
export default profileSlice.reducer;
