import { Button } from "antd";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from 'react';
import { BsCameraFill, BsEmojiLaughingFill } from 'react-icons/bs';
import { useDispatch } from "react-redux";
import { commentThunk } from "../../Thunks/Posts.js";
import { useContext } from "react";
import { CommentContainerContext, PostActionContext } from '../Post/Post.jsx';
import { useLayoutEffect } from "react";
import { UploadImage } from '../Common/UploadImage';
export const ReplyComment = ({ onCancel, post, comment, initValue, initAttachments = [] }) => {
    const controls = useAnimation();

    const dispatch = useDispatch();
    const [files, setFiles] = useState(initAttachments)
    const fileRef = useRef();
    const contentRef = useRef(null);
    const {addComment} = useContext(PostActionContext)
    const RemoveFileFromUploadFiles = (file_id) => {
        let _files = Array.from([...files]);
        setFiles(
            _files.filter(
                (file) => _files.indexOf(file) != file_id
            ),
        );
    };
    const { findNestedLevelWrapper } = useContext(CommentContainerContext);


    const OpenUpload = () => {
        fileRef.current.click();
    }
    const HandleUpload = () => {
        const _files = fileRef.current.files;
        setFiles([...files, ..._files]);
    }
    const Reply = () => {

        const [parent, level] = findNestedLevelWrapper(comment);
        let parent_id = comment.id;
        let content = contentRef.current.value;
        if (level >= 3) {
            parent_id = parent.id;
            content = '@' + comment.author_name + ' ' + contentRef.current.value;
        }
        const data = { content, post_id: post.id, attachments: files, parent_id }
        dispatch(commentThunk(data, addComment));
        setFiles([]);
        fileRef.current.value = "";
        contentRef.current.value = "";
    }


    const Close = async () => {
        await controls.start({ height: 0 });
        onCancel();
    }
    return (

        <motion.div animate={controls} className=" rounded-[15px]  w-full overflow-hidden grow bg-[#F0F2F5]">
            <textarea
                ref={contentRef}
                rows={1}
                // minRows={1}
                className='resize-none rounded-[10px] grow p-[12px] overflow-y-hidden  bg-transparent outline-none border-none  w-full text-[14px] font-light'
                placeholder="Bình Luận"
            />
            <div className=" flex flex-col shrink-0 bg-transparent ">
                <div className="flex gap-[10px]  flex-wrap">
                    {
                        files.map((file, i) => {
                            if (file.link) {
                                return (
                                    <div className="max-w-[150px]">
                                        <UploadImage src={file.link} cb={() => RemoveFileFromUploadFiles(i)} />
                                    </div>
                                )
                            }
                            return (
                                <div className="max-w-[150px]">
                                    <UploadImage src={URL.createObjectURL(file)} cb={() => RemoveFileFromUploadFiles(i)} />
                                </div>
                            )
                        })
                    }
                </div>
                <input onChange={HandleUpload} ref={fileRef} type="file" multiple className="hidden" />
            </div>
            <div initial={{ height: 0 }} className=" p-[10px] flex justify-between w-full  items-center">
                <div className="flex gap-[10px]">
                    <BsEmojiLaughingFill size={18} />
                    <BsCameraFill onClick={OpenUpload} size={18} />
                </div>
                <div className="flex gap-[10px]">
                    <Button onClick={Close} type="default" size="small" danger>
                        Hủy
                    </Button>
                    <Button onClick={Reply} type="primary" size="small" ghost>
                        Gửi
                    </Button>
                    {/* < IoMdSend onClick={Comment} size={22} /> */}
                </div>
            </div>
        </motion.div>


    )

}