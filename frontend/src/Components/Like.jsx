import { motion } from 'framer-motion';
import React, { useContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ENTITY } from '../Enums/Entity.js';
import {
    reactToCommentThunk
} from '../Modules/Posts.js';
import {
    Text
} from './CommonComponent.jsx';
import { CommentContainerContext } from './Post.jsx';
const LazyEmojiPicker = React.lazy(() => import('@emoji-mart/react'));
export const Like = ({ comment, index }) => {
    const likeButtonRef = useRef();
    const dispatch = useDispatch();
    const { CCIDOfPicker, setCCIDOfPicker } = useContext(
        CommentContainerContext
    );
    let timer;
    const user_id = useSelector((state) => state.profile.user_id);
    const MarkAsLiked = () => {
        return comment.reactions.some(
            (reaction) => reaction.reactor_id == user_id
        );
    };

    const HandleMouseEnter = () => {
        timer = setTimeout(() => {
            setCCIDOfPicker(comment.id);
        }, 700);
    };
    const HandleMouseLeave = () => {
        setCCIDOfPicker(0); // turn off all picker in the comment section
        clearTimeout(timer);
    };
    const React = (emoji) => {
        setCCIDOfPicker(0); // turn off all picker in the comment section

        dispatch(
            reactToCommentThunk(comment, {
                entity_id: comment.id,
                entity_type: ENTITY.COMMENT,
                emoji: emoji.native,
            })
        );
    };
    const zIndex = 100 - index;
    const color = MarkAsLiked() ? 'red' : 'initial';
    const fontWeight = MarkAsLiked() ? 600 : 300;
    return (
        <div
            className='relative'
            onMouseLeave={HandleMouseLeave}
            onMouseEnter={HandleMouseEnter}
        >
            <div ref={likeButtonRef}>
                <Text style={{ color, fontWeight }}>React</Text>
            </div>
            <div style={{ zIndex }} className='absolute bottom-[100%]'>
                {CCIDOfPicker == comment.id && (
                    <motion.div initial={{ y: '20%', opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                        <LazyEmojiPicker
                            set='facebook'
                            onEmojiSelect={React}
                        ></LazyEmojiPicker>
                    </motion.div>

                )}
            </div>
        </div>
    );
};