import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import {
    addComment,
    fetchPostsThunk,
    removeComment,
    removePost,
    updateComment,
    updatePost,
} from '../../Reducers/Posts';
import Loading from '../Common/Loading';
import { Post } from './Post';
import NoPosts from './NoPosts';
import { useSecondEffectHook } from '../../Hooks/useSecondEffectHook';

export const PostContainer = () => {

    const posts = useSelector(state => state.posts);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        dispatch(fetchPostsThunk());
    }, []);
    useEffect(() => {
        setIsLoading(false);
    }, [posts]);

    return (
        <div>
            {
                isLoading ? <div className='h-screen'><Loading></Loading></div>
                    : (posts.length > 0) ?
                        posts.map(post => (
                            <Post key={post.id} post={post}
                                  action={{ removePost, addComment, removeComment, updateComment, updatePost }} />

                        ))
                        : <NoPosts />
            }
        </div>

    );
};