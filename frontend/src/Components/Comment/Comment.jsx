import { AnimatePresence, motion } from 'framer-motion';
import React, { useContext, useEffect, useRef } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import Color from '../../Enums/Color';
import { ENTITY } from '../../Enums/Entity.js';
import { deleteCommentThunk, reactToCommentThunk } from '../../Thunks/Posts.js';
import { DropdownItem } from '../Common/DropdownMenu.jsx';
import { EditComment } from '../Forms/EditComment.jsx';
import { CommentContainerContext, PostActionContext } from '../Post/Post.jsx';
import { ReplyComment } from '../Forms/ReplyComment.jsx';
import { TopReactions } from '../Common/TopReactions.jsx';
import { QinqiiImage } from '../Common/QinqiiImage';
import { Text } from '../Common/Text';
import { Avatar } from '../Common/Avatar';
import { DropdownMenu } from '../Common/DropdownMenu';
import { AntdNotificationContext } from '../../App';
import { showModal } from '../../Reducers/Modals';
import { ModalType } from '../../Enums/Modal';

const LazyEmojiPicker = React.lazy(() => import('@emoji-mart/react'));

const DeleteOption = ({ comment, post }) => {
    const dispatch = useDispatch();
    const {removeComment} = useContext(PostActionContext);
    const notify = useContext(AntdNotificationContext);
    const DeleteComment = () => {
        dispatch(deleteCommentThunk(comment, post, removeComment, notify));
        notify.open({
            message: 'Xóa bình luận thành công',
            type: 'success',
            placement: 'bottomLeft',
            duration: 5
        });
    };
    return (
        <>
            <DropdownItem cb={DeleteComment}>
                <Text className='w-fit group-hover:text-white'> Xóa bình luận</Text>
                <AiOutlineDelete className='group-hover:text-white' />
            </DropdownItem>
        </>

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
    const {updateComment, updatePost} = useContext(PostActionContext)
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
    const OpenInMediaViewer = (index) => {

        let selectedIndex = 0;
        comment.attachments.forEach((attachment, i) => {
            if (attachment.id === comment.attachments[index].id) selectedIndex = i;
        });

        dispatch(showModal({ modalType: ModalType.MEDIA, modalProps: { attachments: comment.attachments, selected: selectedIndex } }));
    };
    return (
        <div id={`comment-[${comment.id}]`} className={` w-full py-[10px]`}>
            <div className='flex w-[calc(100%-100px)] gap-[10px] relative'>
                <div className='flex-shrink-0'>
                    <Avatar sz={35} src={comment.author_avatar} user_id={comment.author_id}/>
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
                                        <TopReactions entity_type={ENTITY.COMMENT} action={updateComment} entity={comment} reactions={comment.reactions} />
                                    </div>

                                </div>
                                <div className='flex gap-[10px] flex-wrap'>
                                    {comment.attachments.map((att,i ) => (
                                        <div onClick={() => OpenInMediaViewer(i)} className='rounded-[10px] cursor-pointer overflow-hidden'>
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
 const Reply = ({ comment, index, onClick }) => {

    return (

        <div className='cursor-pointer ' onClick={onClick}>
            <Text>Reply</Text>
        </div>)
}

 const Like = ({ comment, index }) => {
    const likeButtonRef = useRef();
    const pickerRef = useRef()
    const dispatch = useDispatch();
    const { CCIDOfPicker, setCCIDOfPicker } = useContext(
        CommentContainerContext
    );
    const {updateComment} = useContext(PostActionContext)
    let timer;
    const user_id = useSelector((state) => state.profile.user_id);
    const MarkAsLiked = () => {
        return comment.reactions.some(
            (reaction) => reaction.reactor_id == user_id
        );
    };

    const HandleMouseEnter = () => {
        let h = 435;
        let w = 352;

        let client = likeButtonRef.current.getBoundingClientRect();
        let emojiPicker = pickerRef.current;
        if (emojiPicker) {

            console.log(client);
            emojiPicker.style.left = `${client.left}px`;
            emojiPicker.style.top = `${client.top}px`;
            let transY = '-100%', transX = '-100%';
            if(client.top - h < 0) {
                transY = '0%';
            }
            if(client.left - w < 0) {
                transX = '0%';
            }
            emojiPicker.style.transform = `translate(${transX}, ${transY})`;

            emojiPicker.style.height = '435px'; //hard code because fixed position doesnt adjust height base on content

        }
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
            reactToCommentThunk({ ...comment }, {
                entity_id: comment.id,
                entity_type: ENTITY.COMMENT,
                emoji: emoji.native,
            },updateComment)
        );
    };
    const zIndex = 100 - index;
    const color = MarkAsLiked() ? 'red' : 'initial';
    const fontWeight = MarkAsLiked() ? 600 : 300;
     useEffect(() => {


     }, []);

    return (
        <div
            className='relative'
            onMouseLeave={HandleMouseLeave}
            onMouseEnter={HandleMouseEnter}
        >
            <div className='cursor-pointer' ref={likeButtonRef}>
                <Text style={{ color, fontWeight }}>React</Text>
            </div>
            <div ref={pickerRef} style={{ zIndex }} className='fixed bottom-[100%]'>
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