import { TextareaAutosize } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { BsCameraFill, BsEmojiLaughingFill } from 'react-icons/bs';
import { FiAtSign } from "react-icons/fi";
import { IoMdClose, IoMdSend } from "react-icons/io";
import { useDispatch} from "react-redux";
import { twMerge } from "tailwind-merge";
import Color from '../Enums/Color';
import { commentThunk, editCommentThunk, uploadAttachmentsThunk } from "../Modules/Posts.js";



const DropdownContext = createContext();
export const CreateComment = ({ post, initValue, initAttachments = [] }) => {

    const dispatch = useDispatch();
    const [files, setFiles] = useState(initAttachments)
    const fileRef = useRef();
    const contentRef = useRef(null);
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
    }, [])
    const OpenUpload = () => {
        fileRef.current.click();
    }
    const HandleUpload = () => {
        const _files = fileRef.current.files;
        setFiles([...files, ..._files]);
    }
    const Comment = () => {

        const data = { content: contentRef.current.value, post_id: post.id, attachments: files }
        dispatch(commentThunk(data));
        setFiles([]);
        fileRef.current.value = "";
        contentRef.current.value = "";
    }

    return (

        <div className="rounded-[15px] w-full overflow-hidden grow bg-[#F0F2F5]">
            <TextareaAutosize
                ref={contentRef}
                maxRows={3}
                minRows={1}
                className='resize-none rounded-[10px] p-[12px] bg-transparent outline-none border-none  w-full text-[14px] font-light'
                placeholder="Bình Luận"
            />
            <div className="flex flex-col p-[10px]">
                <div className="flex gap-[10px] flex-wrap">

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
                <div className="flex justify-between w-full p-[12px] items-center">
                    <div className="flex gap-[10px]">
                        <BsEmojiLaughingFill size={18} />
                        <BsCameraFill onClick={OpenUpload} size={18} />
                    </div>
                    <div onClick={Comment}>
                        <IoMdSend size={22} />
                    </div>
                </div>
                <input onChange={HandleUpload} ref={fileRef} type="file" multiple className="hidden" />

            </div>

        </div>
    )

}

export const EditComment = ({ isOpen, comment, initValue, initAttachments = [], onCancel }) => {

    const Cancel = () => {

        onCancel();
    }

    const dispatch = useDispatch();
    const [preAttachments, setPreAttachments] = useState(initAttachments);
    const [newAttachments, setNewAttachments] = useState([]);
    const fileRef = useRef();
    const contentRef = useRef();
    const removeList = useRef([]);
    const RemoveNewAttachments = (index) => {
        setNewAttachments(
            newAttachments.filter(
                (attachment) => newAttachments.indexOf(attachment) != index
            ),
        );
    };
    const RemovePreAttachments = (_attachment) => {
        removeList.current.push(_attachment)
        setPreAttachments(
            preAttachments.filter(
                (attachment) => attachment.id != _attachment.id
            ),
        );
    };
    useEffect(() => {

        contentRef.current.value = initValue ?? '';
        setPreAttachments(initAttachments);
    }, [initAttachments, initValue])
    const OpenUpload = () => {
        fileRef.current.click();
    }
    const HandleUpload = () => {
        const _files = fileRef.current.files;
        setNewAttachments([..._files]);
    }
    const Reset = () => {
        setNewAttachments([]);
        setPreAttachments([]);
        fileRef.current.value = "";
        contentRef.current.value = "";
    }
    const Comment = async () => {
        const GetAttType = (att_type) => att_type === 0 ? "IMAGE" : "VIDEO"
        let insertList = []
        let _removeList = removeList.current.map((attachment) => {
            return { attachment_id: attachment.id, action: "DELETE" }
        })
        if (newAttachments.length > 0) {
            let [results, err] = await dispatch(uploadAttachmentsThunk(newAttachments));
            if (!err) {
                insertList = results.map((attachment) => ({ attachment_type: GetAttType(attachment.type), attachment_link: attachment.link, action: "INSERT" }))
            }
        }


        const _comment = { content: contentRef.current.value, comment_id: comment.id, attachments: [...insertList, ..._removeList] }
        dispatch(editCommentThunk(_comment));
        Reset();
        Cancel();
    }
    return (
        <div style={{ display: isOpen ? 'initial' : 'none' }} className="rounded-[15px] w-full overflow-hidden grow bg-[#F0F2F5]">
            <TextareaAutosize
                ref={contentRef}

                maxRows={3}
                minRows={1}
                className='resize-none rounded-[10px] p-[12px] bg-transparent outline-none border-none  w-full text-[14px] font-light'
                placeholder="Bình Luận"
            />
            <div className="flex flex-col p-[10px]">
                <div className="flex gap-[10px] flex-wrap">

                    {
                        preAttachments.map(att => {
                            return (
                                <div className="max-w-[150px]">
                                    <UploadImage key={att.id} src={att.link} cb={() => RemovePreAttachments(att)} />
                                </div>
                            )
                        })
                    }
                    {
                        newAttachments.map((att, i) => {
                            return (
                                <div className="max-w-[150px]">
                                    <UploadImage src={URL.createObjectURL(att)} cb={() => RemoveNewAttachments(i)} />
                                </div>
                            )
                        })

                    }

                </div>
                <div className="flex justify-between w-full p-[12px] items-center">
                    <div className="flex gap-[10px]">
                        <BsEmojiLaughingFill size={18} />
                        <BsCameraFill onClick={OpenUpload} size={18} />
                    </div>
                    <div onClick={Comment}>
                        <IoMdSend size={22} />
                    </div>
                </div>
                <input onChange={HandleUpload} ref={fileRef} type="file" multiple className="hidden" />

            </div>
            <div onClick={Cancel} className="px-[10px]">
                <Text color={Color.Primary}>Cancel</Text>
            </div>
        </div>


    )

}

export const DropdownItem = ({ children, cb }) => {
    const { handleItemClick } = useContext(DropdownContext); // this one is default handler for dropdown item
    const Callback = () => {
        handleItemClick()
        cb();//this one is additional function
    }
    return (
        <div className={`p-[10px] relative z-10 cursor-pointer hover:bg-[#E53935] group`}
            onClick={Callback}>
            <div className=" flex justify-between items-center ">
                {children}
            </div>
        </div>

    )
}

export const DropdownMenu = ({ children, TriggerElement, isOpen, handleItemClick }) => {

    return (

        <div className="relative flex flex-col">
            <TriggerElement />
            <DropdownContext.Provider value={{ handleItemClick }}>
                <AnimatePresence >
                    {
                        isOpen &&
                        <motion.div initial={{ opacity: 0, y: '-30px' }}
                            animate={{ opacity: 1, y: "10px" }}
                            exit={{ opacity: 0, y: "0px" }}
                        >

                            <div className="qinqii-thin-shadow z-11 absolute  w-[200px] bg-white overflow-hidden rounded-[10px]">
                                <div className="p-[10px]">
                                    {children}
                                </div>
                            </div>
                        </motion.div>
                    }
                </AnimatePresence>
            </DropdownContext.Provider>

        </div >
    )
}
export const UploadImage = ({ src, cb: Remove }) => {
    const [hover, setHover] = useState(false);
    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={`border-[2px] border-blue-300 border-solid rounded-[10px] overflow-hidden relative aspect-square`}
        >
            <div
                style={{ display: hover ? 'initial' : 'none' }}
                className=' absolute inset-0 bg-black opacity-10'
            ></div>
            <IoMdClose
                style={{ display: hover ? 'initial' : 'none' }}
                onClick={Remove}
                color='red'
                size={24}
                className=' cursor-pointer absolute top-[10px] right-[10px]'
            >
            </IoMdClose>
            {src.includes("http") ?
                <img src={src} className="w-full  object-cover h-full"></img>
                :
                <img src={`/assets/${src}`} className="w-full object-cover h-full"></img>}
        </div>
    );
};

export function Avatar({ sz, src }) {
    return (
        <div className="overflow-hidden rounded-[50%]" style={{
            height: sz ? sz : 43, width: sz ? sz : 43
        }}>
            {
                src.includes("http") ?
                    <img src={src} className="w-full object-cover h-full"></img>
                    :
                    <img src={`/assets/${src}`} className="w-full object-cover h-full"></img>
            }
        </div>

    )
}
export function Text({ children, color, fontSize, className }) {
    const c = twMerge(`text-[${color ?? Color.Text}] text-[${(fontSize ?? 16)}px] font-normal`, className);
    return (
        (<span style={{ fontFamily: "Nunito" }} className={c}>
            {children}
        </span>)

    )
}

export function Button({ children, color, outline, background, onClick, className }) {
    let c = twMerge(`flex gap-[5px] text-[${color ?? Color.White}] text-[14px] cursor-pointer rounded-[10px] justify-center items-center p-[10px_28px] bg-[${background ? background : Color.Primary}]`, className)
    let b = twMerge(`flex  gap-[5px] text-[${color ?? Color.Text}] text-[14px] cursor-pointer rounded-[10px]  justify-center items-center p-[10px_28px] bg-[${background ? background : Color.White}] border-[1px] border-solid border-gray-400`, className)
    return (
        !outline ?
            <div onClick={onClick} className={c}>
                {children}
            </div>
            :
            <div onClick={onClick} className={b}>
                {children}
            </div>

    )
}
export function Header({ title, count }) {
    return (

        <div className="flex justify-between items-center w-full p-[20px_20px]">
            <div className={`text-[13px] font-bold text-[${Color.Title}]`}>{title}</div>
            <div className={`flex justify-center items-center text-[11px] w-[25px]  h-[25px] rounded-[10px] bg-[${Color.Primary}] text-[${Color.White}]`}>{count}</div>
        </div>
    )
}

export function QinqiiPostImage({ src }) {
    return (
        <div className="overflow-hidden rounded-[10px] w-full h-full aspect-video">
            {
                src.includes("http") ?
                    <img src={src} className="w-full  object-cover h-full"></img>
                    :
                    <img src={`/assets/${src}`} className="w-full object-cover h-full"></img>
            }
        </div>
    )

}
export function QinqiiImage({ src, className }) {
    return (
        <div className="rounded-[10px] overflow-hidden">
            {
                src.includes("http") ?
                    <img src={src} className={className}></img>
                    :
                    <img src={`/assets/${src}`} className={className}></img>
            }
        </div>
    )

}
export const WebFavicon = () => {
    return (
        <div className="flex gap-[10px] items-center">

            <div className={`flex items-center justify-center p-[10px] bg-[${Color.LightPrimary}] gap-[10px] rounded-[10px] overflow-hidden`}>
                <FiAtSign color={Color.Primary} size={24}></FiAtSign>
            </div>
            <div>
                <Text bold fontSize={21}> Qinqii</Text>
            </div>
        </div>
    )
}