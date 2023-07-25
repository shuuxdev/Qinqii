import React, { createContext, useEffect, useMemo, useRef, useState } from "react";
import { BsCameraFill, BsEmojiLaughingFill, BsThreeDots } from 'react-icons/bs';
import Color from '../Enums/Color';
import { Avatar, CreateComment, DropdownItem, DropdownMenu, QinqiiPostImage, Text, UploadImage } from './CommonComponent.jsx';
import { useDispatch, useSelector } from "react-redux";
import fetchDataThunk from "../Thunks/fetchDataThunk.js";
import { FETCH_POSTS, commentThunk, deletePostThunk } from "../Modules/Posts.js";
import Loading from "./Loading.jsx";
import { TextareaAutosize } from "@mui/material";
import { IoMdSend } from "react-icons/io";
import { Comment } from "./Comment.jsx";
import { BiHeart, BiMessage, BiShareAlt } from 'react-icons/bi'
import { TopReactions } from "./TopReactions.jsx";
import { AiOutlineDelete } from "react-icons/ai";
import { ShowNotification } from "../Modules/UI.js";
import { Severity } from "../Enums/FetchState.js";
import { AnimatePresence, motion } from "framer-motion";
const LazyEmojiPicker = React.lazy(() => import('@emoji-mart/react'))

export const PostContainer = () => {

    const posts = useSelector(state => state.posts)
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchDataThunk(FETCH_POSTS));
    }, [])

    return (
        <div >
            {
                posts.length == 0 ? <Loading></Loading> : posts.map(post => (
                    <Post post={post} />
                ))
            }
        </div>

    )
}


const DeleteOption = ({ post }) => {

    const dispatch = useDispatch();

    const DeletePost = () => {
        dispatch(deletePostThunk(post.id))
    }
    return (

        <DropdownItem cb={DeletePost}>
            <Text className="w-fit group-hover:text-white"  > Xóa bài viết</Text>
            <AiOutlineDelete className="group-hover:text-white" />
        </DropdownItem>
    )
}
const EditOption = ({ cb: EditPost }) => {

}

const PostOptionsMenu = ({ post }) => {

    const [open, setOpen] = useState(false);
    const ToggleDropdown = () => setOpen(!open)
    const CloseDropdown = () => setOpen(false);
    const Trigger = () => (
        <div onClick={ToggleDropdown} className={`p-[10px]   self-end w-fit rounded-full cursor-pointer hover:bg-[${Color.Hover}]`}>
            <BsThreeDots size={22}></BsThreeDots>
        </div>)
    return (
        <DropdownMenu TriggerElement={Trigger} isOpen={open} handleItemClick={CloseDropdown}>
            <DeleteOption post={post} />
        </DropdownMenu>
    )
}
const Post = ({ post }) => {
    const avatar = useSelector(state => state.profile.avatar)

    //current comment id of  picker

    return (

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} >
            <div className={`flex flex-col gap-[20px] my-[10px] rounded-[10px] bg-[${Color.White}] p-[20px]`}>
                <div className="flex justify-between items-center">
                    <div className="flex gap-[10px]">
                        <Avatar src={post.author_avatar}></Avatar>
                        <div className="flex flex-col">
                            <Text bold>Shuu Leo</Text>
                            <Text> 12 hours ago</Text>
                        </div>
                    </div>
                    <div>
                        <PostOptionsMenu post={post} />
                    </div>
                </div>
                <div>
                    <Text color="black">
                        {post.content}
                    </Text>
                </div>
                <div className="w-full ">
                    {
                        post.attachments.map(attachment => {
                            return (
                                <QinqiiPostImage src={attachment.link} />
                            )
                        })
                    }

                </div>
                <div className="flex justify-between w-full">
                    <div className="flex">
                        <TopReactions reactions={post.reactions} />
                        {
                            post.reactions.length > 0 &&
                            <Text className='text-[14px] h-fit self-end'>{post.reactions.length} people reacted to this post</Text>
                        }
                    </div>

                    <Text>{post.comments.length} bình luận</Text>
                </div>
                <div></div>
                <Toolbar />
                <div className="flex gap-[10px] items-start">
                    <div className="flex-shrink-0">
                        <Avatar src={avatar} />
                    </div>
                    <CreateComment post={post} />
                </div>
                <CommentContainer post={post} />

            </div>
        </motion.div>

    )
}
export const CommentContainerContext = createContext();

const CommentContainer = ({ post }) => {
    const [CCIDOfPicker, setCCIDOfPicker] = useState();
    const [CCIDOfOptionsMenu, setCCIDOfOptionsMenu] = useState();
    const contextValue = {
        CCIDOfPicker, setCCIDOfPicker,
        CCIDOfOptionsMenu, setCCIDOfOptionsMenu
    }
    return (
        <CommentContainerContext.Provider value={contextValue}>

            <div className="flex flex-col gap-[10px]">
                {
                    post.comments.map((comment, i) => (
                        <Comment comment={comment} index={i} post={post} />
                    ))
                }
            </div>
        </CommentContainerContext.Provider>


    )
}


const ReactToPost = () => {
    let timer;
    const HandleClick = () => {
        setShowEmoji(false);
    }
    const HandleMouseEnter = () => {
        timer = setTimeout(() => setShowEmoji(true), 500);
    }
    const HandleMouseLeave = () => {
        clearTimeout(timer);
    }
    const hoverVariant = {
        hidden: {
            background: 'white'
        },
        visible: {
            background: Color.Hover
        }
    }
    const [showEmoji, setShowEmoji] = useState(false);
    return (
        <div className="flex-1 ">
            {
                showEmoji &&
                <div >
                    <div className="absolute z-20">
                        <LazyEmojiPicker
                            set="facebook"
                            onEmojiSelect={HandleClick}
                        ></LazyEmojiPicker>
                    </div>
                </div>
            }
            <motion.div onMouseEnter={HandleMouseEnter} onMouseLeave={HandleMouseLeave} variants={hoverVariant}
                initial="hidden"
                whileHover="visible"
                className="h-full w-full flex items-center gap-[6px] cursor-pointer justify-center">
                <BiHeart size={22} />
                <Text>Like</Text>
            </motion.div>
        </div>

    )
}

const Toolbar = () => {
    const hoverVariant = {
        hidden: {
            background: 'white'
        },
        visible: {
            background: Color.Hover
        }
    }
    return (
        <div className="flex  border-[#F0F2F5] h-[50px]  qinqii-thin-shadow">

            <ReactToPost />
            <div className="flex-1 cursor-pointer">
                <motion.div variants={hoverVariant}
                    initial="hidden"
                    whileHover="visible"
                    className="h-full w-full flex items-center gap-[6px] justify-center">
                    <BiMessage size={22} />
                    <Text>Comment</Text>
                </motion.div>
            </div>
            <div className="flex-1 cursor-pointer">
                <motion.div variants={hoverVariant}
                    initial="hidden"
                    whileHover="visible"
                    className="h-full w-full flex items-center gap-[6px] justify-center">
                    <BiShareAlt size={22} />
                    <Text>Send</Text>
                </motion.div>
            </div>

        </div>
    )
}
