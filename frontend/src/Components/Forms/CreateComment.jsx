import { useContext, useEffect, useRef, useState } from 'react';
import { BsCameraFill, BsEmojiLaughingFill } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { commentThunk } from '../../Thunks/Posts.js';
import { motion, useAnimation } from 'framer-motion';
import { Button } from 'antd';
import { PostActionContext } from '../Post/Post';
import { UploadImage } from '../Common/UploadImage';
import { useValidateMedia } from '../../Hooks/useValidateMedia';
import { AntdNotificationContext } from '../../App';

export const CreateComment = ({ post, initValue, initAttachments = [], parent_id }) => {
    const controls = useAnimation();
    const [validateMedia] = useValidateMedia();
    const dispatch = useDispatch();
    const [files, setFiles] = useState(initAttachments)
    const fileRef = useRef();
    const contentRef = useRef(null);
    const [showToolbox, setShowToolbox] = useState(false);
    const {addComment} = useContext(PostActionContext)
    const RemoveFileFromUploadFiles = (file_id) => {
        let _files = Array.from([...files]);
        setFiles(
            _files.filter(
                (file) => _files.indexOf(file) != file_id
            ),
        );
    };
    useEffect(() => {
        contentRef.current.value = initValue ?? '';
        controls.start({ height: contentRef.current.scrollHeight });

    }, [])
    const OpenUpload = () => {
        fileRef.current.click();
    }
    const HandleUpload = () => {
        const _files = fileRef.current.files;


        let ok = true;
        ok = validateMedia([..._files]);
        if (!ok) return;
        setFiles([...files, ..._files]);
    }
    const notify = useContext(AntdNotificationContext)
    const Comment = () => {

        const data = { content: contentRef.current.value, post_id: post.id, attachments: files, parent_id }
        dispatch(commentThunk(data, addComment, notify));
        setFiles([]);
        fileRef.current.value = "";
        contentRef.current.value = "";
    }
    const HandleFocus = async () => {
        //initialy set this component to 100px after focus animate to height 200px
        controls.start({ height: "auto" });
        setShowToolbox(true);

    }
    const Close = async () => {
        controls.start({ height: contentRef.current.scrollHeight });
        setShowToolbox(false);
    }
    return (

        <motion.div  animate={controls} className="relative  rounded-[15px]  w-full overflow-hidden grow bg-[#F0F2F5]">
            <input
                type="text"
                onFocus={HandleFocus}
                ref={contentRef}
                // minRows={1}
                className='resize-none rounded-[10px] grow p-[12px] overflow-y-hidden  bg-transparent outline-none border-none  w-full text-[14px] font-light'
                placeholder="Bình Luận"
            />
            <div className="shrink-0 bg-transparent ">
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
                <div className=" p-[10px] flex justify-between w-full  items-center">
                    <div className="flex gap-[10px]">
                        <BsEmojiLaughingFill size={18} />
                        <BsCameraFill onClick={OpenUpload} size={18} />
                    </div>
                    <div className="flex gap-[10px]">
                        <Button onClick={Close} type="default" size="small" danger>
                            Hủy
                        </Button>
                        <Button onClick={Comment} type="primary" size="small" ghost>
                            Gửi
                        </Button>
                        {/* < IoMdSend onClick={Comment} size={22} /> */}
                    </div>
                </div>

                <input onChange={HandleUpload} ref={fileRef} type="file"         accept=".jpg,.jpeg,.png" multiple className="hidden" />

            </div>

        </motion.div>
    )

}