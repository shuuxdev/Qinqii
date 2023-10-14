import { AnimatePresence, motion } from 'framer-motion';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BiHeart, BiMessage, BiShareAlt } from 'react-icons/bi';
import { BsThreeDots } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import Color from '../../Enums/Color';
import { ENTITY } from '../../Enums/Entity.js';

import { Comment } from '../Comment/Comment.jsx';
import { DropdownItem } from '../Common/DropdownMenu.jsx';
import { CreateComment } from '../Forms/CreateComment.jsx';
import { TopReactions } from '../Common/TopReactions.jsx';
import { showModal } from '../../Reducers/Modals';
import { ModalType } from '../../Enums/Modal';
import { ImageGrid } from '../Common/ImageGrid';
import { deletePostThunk, reactToPostThunk } from '../../Thunks/Posts.js';
import { addComments, updateComment, updatePost } from '../../Reducers/Posts.js';
import { Text } from '../Common/Text';
import { Avatar } from '../Common/Avatar';
import { DropdownMenu } from '../Common/DropdownMenu';
import { useUserID } from '../../Hooks/useUserID';
import MediaQuery from 'react-responsive';
import { ScreenWidth } from '../../Enums/ScreenWidth';
import { timeSinceCreatedAt } from '../../Helper/GetTimeSince';
import { useNavigate } from 'react-router-dom';
import { AntdNotificationContext } from '../../App';
import { useAxios } from '../../Hooks/useAxios';
import { twMerge } from 'tailwind-merge';
import { useScroll } from '../../Helper/useScroll';


const LazyEmojiPicker = React.lazy(() => import('@emoji-mart/react'))

const DeleteOption = ({ post }) => {

    const notify = useContext(AntdNotificationContext)
    const dispatch = useDispatch();
    const {removePost} = useContext(PostActionContext)
    const DeletePost = () => {
        dispatch(deletePostThunk(post.id, removePost, notify))
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
export const PostActionContext = createContext()
export const Post = ({ post, action }) => {
    const avatar = useSelector(state => state.profile.avatar)
    const user_id = useUserID();
    const navigate = useNavigate();
    return (
        <PostActionContext.Provider value={{...action}}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} >
                <div className={`flex flex-col gap-[20px] my-[10px] rounded-[10px] bg-[${Color.White}] p-[20px]`}>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-[10px]">
                            <Avatar src={post.author_avatar} user_id={post.author_id}></Avatar>
                            <div className="flex flex-col">
                                <Text bold>{post.author_name}</Text>
                                <Text fontSize={13}> {timeSinceCreatedAt(post.created_at)} trước</Text>
                            </div>
                        </div>
                        {/*{*/}
                        {/*    user_id === post.author_id &&*/}
                        {/*}*/}
                        <PostOptionsMenu post={post} />

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
                        <div className="flex-shrink-0" >
                            <Avatar src={avatar} user_id={post.author_id} />
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

    const [loadMore, setLoadMore] = useState(false);

    const axios = useAxios();
    const notify = useContext(AntdNotificationContext);
    const dispatch = useDispatch();
    const fetchMoreComment = async (page)   => {
        const [data, error] = await axios.GET_CommentsByPostId(post.id, page, 5);
        if(error) {
            console.log(error);
            notify.open({
                message: 'Lỗi',
                description: 'Không thể tải thêm bình luận',
                type: 'error',
                duration: 3
            })
        }
        else {
            dispatch(addComments({
                post_id: post.id,
                comments: data
            }))
        }
        return data;
    }

    let postName = 'post-' + post.id
    const commentContainerRef = useRef();
    const {page, isEnd, data} = useScroll(commentContainerRef, fetchMoreComment)

  /*  useEffect(() => {
        if(loadMore) {
            fetchMoreComment(2);
        }
    }, [loadMore]);*/
    let container = twMerge(postName, ` flex flex-col gap-[10px] max-h-[500px] `, loadMore ? 'overflow-y-auto' : 'overflow-y-hidden')
    comments.sort((a, b) => b.id - a.id);
    return (
        <CommentContainerContext.Provider value={contextValue}>

            <div ref={commentContainerRef} className={container}>
                {
                    comments.map((comment, i) => (
                        <Comment key={comment.id} comment={comment} index={i} post={post} />
                    ))
                }
            </div>
            {
                !loadMore && post.total_comments > 5 &&
                <div className="flex justify-center">
                    <button onClick={() => setLoadMore(true)} className="text-[14px] text-[#65676B] hover:text-[#1877F2]">Xem thêm bình luận</button>
                </div>
            }
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
                <MediaQuery minWidth={ScreenWidth.sm}>
                <Text>Like</Text>
                </MediaQuery>
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
        <div className="flex  border-[#F0F2F5] h-[50px] rounded-[10px]  qinqii-thin-shadow">

            <ReactToPost post={post} />
            <div className="flex-1 cursor-pointer">
                <motion.div

                    className="h-full w-full flex items-center gap-[6px] justify-center">
                    <BiMessage size={22} />
                    <MediaQuery minWidth={ScreenWidth.sm}>

                    <Text>Comment</Text>
                    </MediaQuery>
                </motion.div>
            </div>
            {/*<div className="flex-1 cursor-pointer" onClick={() => dispatch(showModal({modalType: ModalType.SHARE}))}>*/}
            {/*    <div*/}
            {/*        className="h-full w-full flex items-center gap-[6px] justify-center">*/}
            {/*        <BiShareAlt size={22} />*/}
            {/*        <MediaQuery minWidth={ScreenWidth.sm}>*/}
            {/*        <Text>Send</Text>*/}
            {/*        </MediaQuery>*/}
            {/*    </div>*/}
            {/*</div>*/}

        </div>
    )
}
