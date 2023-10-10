import { useDispatch, useSelector } from 'react-redux';
import { Post } from '../Post/Post';
import {
    addComment,
    fetchPostsThunk,
    removeComment,
    removePost,
    updateComment,
    updatePost,
} from '../../Reducers/Profile';
import { useParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import {NoPosts} from './NoPosts.jsx';

export const PostsTab = () => {
    const posts = useSelector(state => state.profile.posts);
    const param = useParams();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchPostsThunk({ user_id: param.id, page: 1, pageSize: 10 }));
    }, [param.id]);
    return (<>
        {
            (posts.length > 0) ?
                posts.map(post => (
                    <Post key={post.id} post={post}
                          action={{ removePost, addComment, removeComment, updateComment, updatePost }} />

                ))
                : <NoPosts />
        }
    </>);
};