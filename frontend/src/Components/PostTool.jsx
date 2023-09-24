import React, { forwardRef, Suspense, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Color from '../Enums/Color';
import { Avatar, Button, UploadImage } from './CommonComponent.jsx';
import { Alert, Dialog, DialogActions, DialogTitle, Snackbar } from '@mui/material';
import { CloseDialog, HideNotification, OpenDialog } from '../Modules/UI.js';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { BsEmojiSunglassesFill, BsImages, BsThreeDots } from 'react-icons/bs';
import Loading from '../Components/Loading.jsx';
import { createNewPostThunk } from '../Thunks/Posts.js';
import { getVideoFirstFrame } from '../Helper/GetVideoFirstFrame';
import { twMerge } from 'tailwind-merge';
import { QinqiiEmojiPicker } from './QinqiiEmojiPicker';


const DialogBody = ({ children }) => {
    return <div className='p-[20px] flex-col gap-[20px]'>{children}</div>;
};


const Uploader = ({ HandleUpload, OpenUpload, uploadButtonRef }) => {
    return (
        <div>
            <input
                ref={uploadButtonRef}
                onChange={HandleUpload}
                type='file'
                multiple
                className='hidden'
            />
            <BsImages
                className='cursor-pointer'
                onClick={OpenUpload}
                color='green'
                size={24}
            />
        </div>
    );
};
const PostManager = () => {

    const uploadButtonRef = useRef();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [images, setImages] = useState([]);
    const { name, avatar } = useSelector((state) => state.profile);
    const shouldDialogOpen = useSelector((state) => state.UI.create_post_open);
    const focusBorder = twMerge("border-blue-500 border-[2px] p-[10px] border-solid rounded-[5px]")
    const textareaRef = useRef();
    const [showPicker, setShowPicker] = useState(false);
    const dispatch = useDispatch();
    const Close = () => {
        dispatch(CloseDialog());
    };
    const HandleUpload = (e) => {
        const files = uploadButtonRef.current.files;
        setUploadedFiles(files);
    };
    const RemoveFileFromUploadFiles = (file_id) => {
        let files = Array.from([...uploadedFiles]);
        setUploadedFiles(
            files.filter(
                (file) => files.indexOf(file) != file_id
            ),
        );
    };
    const OpenUpload = (e) => {
        uploadButtonRef.current.click();
    };

    const CreateNewPost = () => {
        dispatch(createNewPostThunk({ content: textareaRef.current.value, attachments: uploadedFiles }));
    }

    useEffect(() => {
        const renderAttachments = async () => {
            const filesToRender = await Promise.all(Array.from(uploadedFiles).map(async (file, i) => {

                if (file.type.includes("video")) {
                    let url = await getVideoFirstFrame(file);
                    return (
                        <UploadImage
                            cb={() => RemoveFileFromUploadFiles(i)}
                            src={url}
                        />
                    )
                }
                return (
                    <UploadImage
                        cb={() => RemoveFileFromUploadFiles(i)}
                        src={URL.createObjectURL(file)}
                    />
                )
            }))
            setImages(filesToRender);
        }
        renderAttachments();
    }, [uploadedFiles])
    return (
        <Dialog
            maxWidth={700}
            PaperProps={{
                sx: {
                    width: '100%',
                    maxWidth: '720px',
                    overflowY: 'visible',
                },
            }}
            open={shouldDialogOpen}
            onClose={Close}
        >
            <DialogTitle className='relative'>
                <ModalHeader/>
                <div
                    className='absolute right-[20px] top-[20px]'
                    onClick={Close}
                >
                    <AiOutlineCloseCircle size={28}></AiOutlineCloseCircle>
                </div>
            </DialogTitle>
            <DialogBody>
                <Suspense fallback={<div className='flex justify-center items-center w-full h-full'><Loading /></div>}>

                   <Header/>
                    <div className={focusBorder}>
                        <Textarea ref={textareaRef}/>
                       <AttachmentPreview images={images}/>
                    </div>
                    <div className='border-[1px]  border-solid rounded-[10px] p-[15px]   border-[#DDDEE1]'>
                        <div className='relative flex justify-between '>
                            <div className='font-semibold'>Thêm vào post</div>
                            <div className='absolute right-0 flex gap-[15px]'>
                                {
                                    showPicker &&
                                    <QinqiiEmojiPicker ref={textareaRef}/>
                                }
                                    <BsEmojiSunglassesFill

                                        className='cursor-pointer'
                                        onClick={() => setShowPicker(!showPicker)}
                                        color={`${Color.Primary}`}
                                        size={24}
                                    ></BsEmojiSunglassesFill>
                                <Uploader
                                    HandleUpload={HandleUpload}
                                    uploadButtonRef={uploadButtonRef}
                                    OpenUpload={OpenUpload}
                                />
                                <BsThreeDots size={24} />
                            </div>
                        </div>
                    </div>
                </Suspense>
            </DialogBody>
            <DialogActions>
                <Button onClick={CreateNewPost}>Đăng</Button>
            </DialogActions>

        </Dialog>
    );
};



export function CreatePost() {
    const dispatch = useDispatch();
    const Open = (e) => {
        e.target.blur();
        dispatch(OpenDialog());
    };
    const { avatar } = useSelector((state) => state.profile);

    const notification = useSelector(state => state.UI.notification);



    return (
        <div
            className={`rounded-[10px] bg-[${Color.White}] gap-[20px] flex w-full  p-[15px_20px] items-center`}
        >
            <div>
                <Avatar src={avatar} />
            </div>
            <div className='flex-[12]'>
                <input
                    onFocus={Open}
                    type='text'
                    className='rounded-[10px] p-[10px] outline-none border-none w-full'
                    placeholder="What's new Shuu"
                />
            </div>
            <div>
                <Button>Post it</Button>
            </div>
            <PostManager />
            <Snackbar open={notification.visible} autoHideDuration={6000} onClose={() => dispatch(HideNotification())}>
                <Alert severity={notification.severity} onClose={() => dispatch(HideNotification())}>
                    {notification.content}
                </Alert>
            </Snackbar>
        </div>
    );
}

export const AttachmentPreview = ({images}) => {
    return (
        <div className='max-h-[200px] w-full grid grid-cols-3 overflow-y-scroll gap-[10px]'>
            {images}
        </div>
    )
}
const Textarea = forwardRef((props,ref ) => {
    return (
        <div className='my-[10px]'>
                        <textarea
                            ref={ref}
                            rows={4}
                            placeholder='Úm ba la xì bum'
                            className='rounded-[10px] outline-none resize-none w-full p-[10px] text-[19px]'
                        />
        </div>
    )
})
const Header = () => {
    const profile = useSelector(state => state.profile)
    const {avatar, name} = profile;
    return (
        <div className='flex  gap-[10px] '>
            <Avatar src={avatar}></Avatar>
            <div className='flex flex-col'>
                <div>{name}</div>
                <div>Only me</div>
            </div>
        </div>
    )
}
const ModalHeader = () => {
    return (
        <div className='py-[10px] border-b-[2px]  border-solid  border-slate-200 w-full'>
            <div className=" font-['Alexandria']">
                Tạo bài viết mới
            </div>
        </div>
    )
}