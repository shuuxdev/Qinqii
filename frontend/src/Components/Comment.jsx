import React, { useContext } from "react";
import Color from '../Enums/Color';
import { Avatar, CreateComment, DropdownItem, DropdownMenu, EditComment, QinqiiImage, QinqiiPostImage, Text } from './CommonComponent.jsx';
import { TopReactions } from "./TopReactions.jsx";
import { BsThreeDots } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { deleteCommentThunk, editCommentThunk, reactToCommentThunk } from "../Modules/Posts.js";
import { useState } from "react";
import { CommentContainerContext } from "./Post.jsx";
import { ENTITY } from "../Enums/Entity.js";
const LazyEmojiPicker = React.lazy(() => import('@emoji-mart/react'))


const DeleteOption = ({ comment_id, post_id }) => {
    const dispatch = useDispatch();
    const DeleteComment = () => {
        dispatch(deleteCommentThunk(comment_id, post_id));

    }
    return (
        <DropdownItem cb={DeleteComment}>

            <Text className="w-fit group-hover:text-white"  > Xóa bình luận</Text>
            <AiOutlineDelete className="group-hover:text-white" />
        </DropdownItem>

    )
}
const EditOption = ({ EditComment }) => {
    const dispatch = useDispatch();

    return (
        <DropdownItem cb={EditComment}>
            <Text className="w-fit group-hover:text-white"  >Chỉnh sửa bình luận</Text>
            <AiOutlineDelete className="group-hover:text-white" />
        </DropdownItem>

    )
}

const Like = ({ comment, index }) => {
    const dispatch = useDispatch();
    const { CCIDOfPicker, setCCIDOfPicker } = useContext(CommentContainerContext)
    let timer;
    const HandleMouseEnter = () => {
        timer = setTimeout(() => {
            setCCIDOfPicker(comment.id);
        }, 1000)

    }
    const HandleMouseLeave = () => {
        clearTimeout(timer);
    }
    const React = (emoji) => {
        setCCIDOfPicker(0); // turn off all picker in the comment section

        dispatch(reactToCommentThunk(comment, { entity_id: comment.id, entity_type: ENTITY.COMMENT, emoji: emoji.native }))
    }
    const zIndex = 100 - index;
    return (
        <div className="relative" onMouseLeave={HandleMouseLeave} onMouseEnter={HandleMouseEnter}>

            <Text>Like</Text>
            <div style={{ zIndex }} className="absolute left-0 top-0 ">
                {
                    CCIDOfPicker == comment.id &&
                    <LazyEmojiPicker set="facebook"
                        onEmojiSelect={React}
                    >

                    </LazyEmojiPicker>
                }
            </div>

        </div>
    )
}

export const Comment = ({ comment, post, index }) => {
    const [showDropDown, setShowDropDown] = useState(false)
    const { CCIDOfOptionsMenu, setCCIDOfOptionsMenu } = useContext(CommentContainerContext);
    const [showEditComment, setShowEditComment] = useState(false);

    const zIndex = 100 - index;

    const editComment = () => {
        setShowEditComment(true);
    }
    const CloseEdit = () => {
        setShowEditComment(false);
    }

    const ToggleOptionsMenu = () => {
        if (CCIDOfOptionsMenu == comment.id)
            CloseOptionsMenu()
        else setCCIDOfOptionsMenu(comment.id);
    }
    const CloseOptionsMenu = () => {
        setCCIDOfOptionsMenu(0);
    }
    const Trigger = (index) => (
        <div style={{ zIndex: zIndex }} onClick={ToggleOptionsMenu} className={`p-[10px]   self-end w-fit rounded-full cursor-pointer hover:bg-[${Color.Hover}]`}>
            <BsThreeDots size={22}></BsThreeDots>
        </div>)
    return (
        <div className=" w-full ">
            <div className="flex gap-[10px] relative">
                <avatar className="flex-shrink-0">
                    <Avatar sz={35} src={comment.author_avatar} />
                </avatar>
                <EditComment isOpen={showEditComment} onCancel={CloseEdit} comment={comment} initAttachments={comment.attachments} initValue={comment.content} post={post} />
                {
                    !showEditComment &&
                    <div className="flex relative flex-col">
                        <content className="relative flex flex-col w-fit rounded-[15px] p-[10px]  grow bg-[#F0F2F5]">
                            <Text bold>{comment.author_name} </Text>
                            <Text> {comment.content}</Text>
                            <div style={{ zIndex }} className="absolute  translate-y-[-50%] top-[50%] right-[-50px]">
                                <DropdownMenu TriggerElement={Trigger} isOpen={CCIDOfOptionsMenu == comment.id} handleItemClick={CloseOptionsMenu}>
                                    <DeleteOption comment_id={comment.id} post_id={post.id} />
                                    <EditOption EditComment={editComment} />
                                </DropdownMenu>
                            </div>
                        </content>
                        <attachment className="flex gap-[10px] flex-wrap">
                            {
                                comment.attachments.map((att) => (
                                    <div className="rounded-[10px]  overflow-hidden">
                                        <QinqiiImage className={`max-h-[150px]`} src={att.link} />
                                    </div>
                                ))
                            }
                        </attachment>
                        <action className="flex mt-[15px] gap-[10px] w-fit px-[10px]">
                            <Like comment={comment} index={index} />
                            <Text>Reply</Text>
                        </action>
                        <reaction className="absolute right-0 bottom-0 translate-x-[100%] translate-y-[-50%]">
                            <TopReactions reactions={comment.reactions} />
                        </reaction>

                    </div>
                }
            </div>
        </div>


    )
}