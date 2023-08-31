import { AnimatePresence, motion } from 'framer-motion';
import React, { useContext, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import Color from '../Enums/Color';
import { ENTITY } from '../Enums/Entity.js';
import {
    deleteCommentThunk,
    undoReactThunk
} from '../Modules/Posts.js';
import {
    Avatar,
    DropdownItem,
    DropdownMenu,
    QinqiiImage,
    Text
} from './CommonComponent.jsx';
import { EditComment } from './EditComment.jsx';
import { Like } from './Like.jsx';
import { CommentContainerContext } from './Post.jsx';
import { Reply } from './Reply.jsx';
import { ReplyComment } from './ReplyComment.jsx';
import { TopReactions } from './TopReactions.jsx';
const LazyEmojiPicker = React.lazy(() => import('@emoji-mart/react'));

const DeleteOption = ({ comment, post }) => {
    const dispatch = useDispatch();
    const DeleteComment = () => {
        dispatch(deleteCommentThunk(comment, post));
    };
    return (
        <DropdownItem cb={DeleteComment}>
            <Text className='w-fit group-hover:text-white'> Xóa bình luận</Text>
            <AiOutlineDelete className='group-hover:text-white' />
        </DropdownItem>
    );
};
const EditOption = ({ EditComment }) => {
    const dispatch = useDispatch();

    return (
        <DropdownItem cb={EditComment}>
            <Text className='w-fit group-hover:text-white'>
                Chỉnh sửa bình luận
            </Text>
            <AiOutlineDelete className='group-hover:text-white' />
        </DropdownItem>
    );
};



export const Comment = ({ comment, post, index }) => {
    const dispatch = useDispatch();
    const { CCIDOfOptionsMenu, setCCIDOfOptionsMenu, CCIDOfEditComment, setCCIDOfEditComment, CCIDOfReply, setCCIDOfReply } = useContext(
        CommentContainerContext
    );
    const [showReply, setShowReply] = useState(false);
    const ShowReply = () => {
        setCCIDOfReply(comment.id);
    }
    const CloseReply = () => {
        setCCIDOfReply(null);
    }
    const user_id = useSelector((state) => state.profile.user_id);
    const zIndex = 100 - index;

    const editComment = () => {

        setCCIDOfEditComment(comment.id);
    };
    const CloseEdit = () => {
        setCCIDOfEditComment(null);

    };

    const ToggleOptionsMenu = () => {
        if (CCIDOfOptionsMenu == comment.id) CloseOptionsMenu();
        else setCCIDOfOptionsMenu(comment.id);
    };
    const CloseOptionsMenu = () => {
        setCCIDOfOptionsMenu(0);
    };
    const Trigger = (index) => (
        <div
            style={{ zIndex: zIndex }}
            onClick={ToggleOptionsMenu}
            className={`p-[5px]   self-end w-fit rounded-full cursor-pointer hover:bg-[${Color.Hover}]`}
        >
            <BsThreeDots size={16}></BsThreeDots>
        </div>
    );
    const UndoReaction = (reaction) => {
        dispatch(undoReactThunk({ post_id: post.id, id: comment.id, type: ENTITY.COMMENT }, reaction.id))
    }

    return (
        <div className=' w-full py-[10px]'>
            <div className='flex gap-[10px] relative'>
                <div className='flex-shrink-0'>
                    <Avatar sz={35} src={comment.author_avatar} />
                </div>

                {
                    CCIDOfEditComment == comment.id ?
                        <motion.div className='w-full' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

                            <EditComment
                                onCancel={CloseEdit}
                                comment={comment}
                                initAttachments={comment.attachments}
                                initValue={comment.content}
                                post={post}
                            />
                        </motion.div>
                        : (
                            <div className='flex relative w-full  flex-col'>
                                <div className='relative  flex flex-col w-fit rounded-[15px] p-[10px]  grow bg-[#F0F2F5]'>
                                    <Text bold>{comment.author_name} </Text>
                                    <Text> {comment.content}</Text>
                                    <div
                                        style={{ zIndex }}
                                        className='absolute  top-0 right-[-50px]'
                                    >
                                        {
                                            comment.author_id == user_id &&
                                            <DropdownMenu
                                                TriggerElement={Trigger}
                                                isOpen={CCIDOfOptionsMenu == comment.id}
                                                handleItemClick={CloseOptionsMenu}
                                            >
                                                <DeleteOption
                                                    comment={comment}
                                                    post={post}
                                                />
                                                <EditOption EditComment={editComment} />
                                            </DropdownMenu>
                                        }

                                    </div>
                                    <div className='absolute right-0 bottom-0 translate-x-[100%] '>
                                        <TopReactions UndoReaction={UndoReaction} reactions={comment.reactions} />
                                    </div>

                                </div>
                                <div className='flex gap-[10px] flex-wrap'>
                                    {comment.attachments.map((att) => (
                                        <div className='rounded-[10px]  overflow-hidden'>
                                            <QinqiiImage
                                                className={`max-h-[150px]`}
                                                src={att.link}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className='flex mt-[5px] gap-[10px] w-fit px-[10px]'>
                                    <Like comment={comment} index={index} />
                                    <Reply comment={comment} onClick={ShowReply} index={index} />

                                </div>
                                <AnimatePresence mode='wait' >
                                    {
                                        CCIDOfReply == comment.id &&
                                        <motion.div initial={{ height: 0 }} transition={{ duration: 0.3 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden w-full">


                                            <ReplyComment onCancel={CloseReply} comment={comment} key={comment.id} post={post} ></ReplyComment>
                                        </motion.div>
                                    }
                                </AnimatePresence>

                                {
                                    comment.childrens.map((child, i) => (
                                        <Comment comment={child} post={post} key={child.id} index={index + i + 1} />
                                    ))
                                }

                            </div>
                        )
                }

            </div>
        </div>
    );
};
