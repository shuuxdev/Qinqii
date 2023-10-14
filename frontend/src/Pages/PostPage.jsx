import { addComment, fetchPosts, removeComment, removePost, updateComment, updatePost } from '../Reducers/Posts';
import { Post } from '../Components/Post/Post';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAxios } from '../Hooks/useAxios';
import { AntdNotificationContext } from '../App';
import Loading from '../Components/Common/Loading';
import { useDispatch, useSelector } from 'react-redux';

export const PostPage = () => {
    const param = useParams();
    const axios = useAxios();
    const post = useSelector(state => state.posts.find(post => post.id == param.id));
    const notify = useContext(AntdNotificationContext);
    const dispatch = useDispatch();
    const getPostById = async () => {
        const [data, error] = await axios.GET_POST(param.id);
        if(error) {
            notify.open({
                message: 'Load post không thành công: ' + error.response.data.Message,
                type: 'error',
                placement: 'bottomLeft',
                duration: 10
            })
            return;
        }
        dispatch(fetchPosts([{...data}]));
    }
    let {comment_id, id} = useParams();

    useEffect(() => {
        getPostById();
    }, [id]);
    useEffect(() => {
        console.log(comment_id);
        if(comment_id)
        {
            let element = document.getElementById(`comment-[${comment_id}]`);

            if(element) {
                element.scrollIntoView({behavior: 'smooth'});
            }
        }

    });
    return (
        <>
            {
                post  ? <Post key={param.id} post={post}
                              action={{ removePost, addComment, removeComment, updateComment, updatePost }} />
                    : <div className='w-full h-[500px]'>
                        <Loading/>
                    </div>
            }
        </>

    )
}