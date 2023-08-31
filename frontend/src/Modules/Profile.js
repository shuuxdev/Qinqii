import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const fetchProfileAction = (profile) => ({
    type: FETCH_PROFILE,
    payload: profile,
});



export const profileApiSlice = createApi({
    reducerPath: 'profileAPI',
    baseQuery: fetchBaseQuery({baseUrl: 'https://localhost:7084/'}),
    endpoints: (builder) => ({
        getProfile: builder.query({query: (user_id) => `user?id=${user_id}`}),
        getPosts: builder.query({query: (user_id) => `user/posts?id=${user_id}`}),
        getImages: builder.query({query: (user_id) => `user/images?id=${user_id}`}),
        getVideos: builder.query({query: (user_id) => `user/videos?id=${user_id}`}),
        getFriends: builder.query({query: (user_id) => `user/friends?id=${user_id}`})

    })
})

export const FETCH_PROFILE = 'FETCH_PROFILE';
const def = {
    id: 0,
    name: '',
    background: '',
    avatar: '',
};
const Reducer = (state = def, action) => {
    switch (action.type) {
        case FETCH_PROFILE:
            return action.payload;
        default:
            return state;
    }
};

export const {useGetFriendsQuery,useGetProfileQuery, useGetPostsQuery, useGetImagesQuery, useGetVideosQuery} = profileApiSlice
export default Reducer;
