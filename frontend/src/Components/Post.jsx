import { AnimatePresence, motion } from 'framer-motion';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BiHeart, BiMessage, BiShareAlt } from 'react-icons/bi';
import { BsThreeDots } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import Color from '../Enums/Color';
import { ENTITY } from '../Enums/Entity.js';

import { Comment } from './Comment.jsx';
import { Avatar, DropdownItem, DropdownMenu, Text } from './CommonComponent.jsx';
import { CreateComment } from './CreateComment.jsx';
import Loading from './Loading.jsx';
import { TopReactions } from './TopReactions.jsx';
import { showModal } from '../Modules/Modals';
import { ModalType } from '../Enums/Modal';
import { ImageGrid } from './ImageGrid';
import { deletePostThunk,  reactToPostThunk } from '../Thunks/Posts.js';
import { addComment, fetchPostsThunk, removeComment, updateComment, updatePost } from '../Modules/Posts.js';


const LazyEmojiPicker = React.lazy(() => import('@emoji-mart/react'))

export const PostContainer = () => {

    const posts = useSelector(state => state.posts)
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchPostsThunk());
    }, [])

    return (
        <div >
            {
                posts.length === 0 ? <Loading></Loading> : posts.map(post => (
                    <Post post={post} action={{addComment,  removeComment, updateComment, updatePost}}/>
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


const PostOptionsMenu = ({ post }) => {

    const [open, setOpen] = useState(false);
    const ToggleDropdown = () => setOpen(!open)
    const CloseDropdown = () => setOpen(false);
    const user_id = useSelector(state => state.profile.user_id)
    const Trigger = () => (
        <div onClick={ToggleDropdown} className={`p-[10px]   self-end w-fit rounded-full cursor-pointer hover:bg-[${Color.Hover}]`}>
            <BsThreeDots size={22}></BsThreeDots>
        </div>)
    return (
        <DropdownMenu TriggerElement={Trigger} isOpen={open} handleItemClick={CloseDropdown}>
            {user_id == post.author_id && <DeleteOption post={post} />}
        </DropdownMenu>
    )


}
export const PostActionContext = createContext()
export const Post = ({ post, action }) => {
    const avatar = useSelector(state => state.profile.avatar)


    return (
        <PostActionContext.Provider value={{...action}}>
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
                    <ImageGrid attachments={post.attachments}/>
                    <div className="flex justify-between w-full">
                        <div className="flex">
                            <TopReactions entity_type={ENTITY.POST} action={updatePost} entity={post} reactions={post.reactions} />
                            {
                                post.reactions.length > 0 &&
                                <Text className='text-[14px] h-fit self-end'>{post.reactions.length}   reactions was sent</Text>
                            }
                        </div>

                        <Text>{post.comments.length} bình luận</Text>
                    </div>
                    <div></div>
                    <Toolbar post={post} />
                    <div className="flex gap-[10px] items-start">
                        <div className="flex-shrink-0">
                            <Avatar src={avatar} />
                        </div>
                        <CreateComment post={post} initValue="" initAttachments={[]} isOpen={true} />
                    </div>
                    <CommentContainer post={post} />

                </div>
            </motion.div>
        </PostActionContext.Provider>


    )
}
export const CommentContainerContext = createContext();

const CommentContainer = ({ post }) => {
    const [CCIDOfPicker, setCCIDOfPicker] = useState();
    const [CCIDOfOptionsMenu, setCCIDOfOptionsMenu] = useState();
    const [CCIDOfEditComment, setCCIDOfEditComment] = useState();
    const [CCIDOfReply, setCCIDOfReply] = useState();
    const findParentComment = (comment, parent_id) => {
        if (!comment) return null;

        if (comment.id === parent_id) {
            return comment;
        }
        if (!comment.childrens) return null;
        for (let i = 0; i < comment.childrens.length; i++) {
            let ans = findParentComment(comment.childrens[i], parent_id)
            if (ans) {
                return ans;
            };
        }
        return null;
    }
    const comments = useMemo(() => {
        let dict = {} // dictionary
        let sorted = [...post.comments];
        if (post.comments.length > 0) {
            sorted.sort((a, b) => a.id - b.id);
            sorted.forEach((comment) => {
                comment = { ...comment, childrens: [] };
                let parent = null;
                Object.keys(dict).some((key) => {
                    parent = findParentComment(dict[key], comment.parent_id);
                    if (parent) return true;
                    //break the loop when parent is found
                })

                if (parent == null) {
                    // comment is root
                    dict[comment.id] = comment
                }
                else {
                    // comment is child
                    parent.childrens.push(comment);
                }

            })
        }
        return Object.values(dict) ?? [];
    }, [post.comments])

    const findNestedLevelWrapper = (target) => {

        let parent = null, level = null;
        comments.forEach((c) => {
            [parent, level] = findNestedLevel(c, 1, target, null);
        })
        return [parent, level];
    }
    const findNestedLevel = (comment, level, target, parent) => {
        // 
        // 
        // 
        // 
        if (comment.id === target.id) return [parent, level]; //return parent and level of target comment
        for (let i = 0; i < comment.childrens.length; i++) {
            let [_parent, _level] = findNestedLevel(comment.childrens[i], level + 1, target, comment);

            if (_level != null) //if target comment is found
                return [_parent, _level]; //return parent and level of target comment
        }
        return [null, null];
    }


    const contextValue = {
        CCIDOfPicker, setCCIDOfPicker,
        CCIDOfOptionsMenu, setCCIDOfOptionsMenu,
        CCIDOfEditComment, setCCIDOfEditComment,
        CCIDOfReply, setCCIDOfReply,
        findNestedLevelWrapper,
        findParentComment
    }



    return (
        <CommentContainerContext.Provider value={contextValue}>

            <div className="flex flex-col gap-[10px]">
                {
                    comments.map((comment, i) => (
                        <Comment comment={comment} index={i} post={post} />
                    ))
                }
            </div>
        </CommentContainerContext.Provider>


    )
}


const ReactToPost = ({ post }) => {
    let timer;
    const dispatch = useDispatch();
    const {updatePost} = useContext(PostActionContext)
    const SendReaction = (emoji) => {
        dispatch(
            reactToPostThunk({ ...post }, {
                entity_id: post.id,
                entity_type: ENTITY.POST,
                emoji: emoji.native,
            },updatePost)
        );
        setShowEmoji(false);
    }
    const HandleMouseEnter = () => {
        timer = setTimeout(() => setShowEmoji(true), 500);
    }
    const HandleMouseLeave = () => {
        setShowEmoji(false);
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
        <div onMouseEnter={HandleMouseEnter} onMouseLeave={HandleMouseLeave} className="flex-1 relative">
            <AnimatePresence>
                {
                    showEmoji &&
                    <div className="absolute z-[200] bottom-[100%]">
                        <motion.div initial={{ y: '50px', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}>
                            <LazyEmojiPicker
                                set="facebook"
                                onEmojiSelect={SendReaction}
                            ></LazyEmojiPicker>
                        </motion.div>
                    </div>

                }
            </AnimatePresence>

            <div
                className="h-full w-full flex items-center gap-[6px] cursor-pointer justify-center">
                <BiHeart size={22} />
                <Text>Like</Text>
            </div>
        </div>

    )
}

const Toolbar = ({ post }) => {
    const dispatch = useDispatch()
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

            <ReactToPost post={post} />
            <div className="flex-1 cursor-pointer">
                <motion.div

                    className="h-full w-full flex items-center gap-[6px] justify-center">
                    <BiMessage size={22} />
                    <Text>Comment</Text>
                </motion.div>
            </div>
            <div className="flex-1 cursor-pointer" onClick={() => dispatch(showModal({modalType: ModalType.SHARE}))}>
                <div
                    className="h-full w-full flex items-center gap-[6px] justify-center">
                    <BiShareAlt size={22} />
                    <Text>Send</Text>
                </div>
            </div>

        </div>
    )
}
