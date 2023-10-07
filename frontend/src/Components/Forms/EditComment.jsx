import { TextareaAutosize } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { BsCameraFill, BsEmojiLaughingFill } from 'react-icons/bs';
import { IoMdSend } from 'react-icons/io';
import { useDispatch } from 'react-redux';
import { editCommentThunk, uploadAttachmentsThunk } from '../../Thunks/Posts.js';
import { PostActionContext } from '../Post/Post';
import { UploadImage } from '../Common/UploadImage';

export const EditComment = ({
                                comment = {}, initValue, initAttachments, onCancel = () => {
    },
                            }) => {

    const Cancel = () => {

        onCancel();
    };

    const dispatch = useDispatch();
    const [preAttachments, setPreAttachments] = useState(initAttachments);
    const [newAttachments, setNewAttachments] = useState([]);
    const fileRef = useRef();
    const contentRef = useRef();
    const removeList = useRef([]);
    const { updateComment } = useContext(PostActionContext);
    const RemoveNewAttachments = (index) => {
        setNewAttachments(
            newAttachments.filter(
                (attachment) => newAttachments.indexOf(attachment) != index,
            ),
        );
    };
    const RemovePreAttachments = (_attachment) => {
        removeList.current.push(_attachment);
        setPreAttachments(
            preAttachments.filter(
                (attachment) => attachment.id != _attachment.id,
            ),
        );
    };
    useEffect(() => {

        contentRef.current.value = initValue ?? '';
        setPreAttachments(initAttachments);
    }, [initAttachments, initValue]);

    const OpenUpload = () => {
        fileRef.current.click();
    };
    const HandleUpload = () => {
        const _files = fileRef.current.files;
        setNewAttachments([..._files]);
    };
    const Reset = () => {
        setNewAttachments([]);
        setPreAttachments([]);
        fileRef.current.value = '';
        contentRef.current.value = '';
    };
    const Comment = async () => {
        let _removeList = removeList.current.map((att) => att.id);
        const _comment = {
            content: contentRef.current.value,
            comment_id: comment.id,
            deleted_attachments: _removeList,
            new_attachments: newAttachments,
        };
        dispatch(editCommentThunk(_comment, updateComment));
        Reset();
        Cancel();
    };
    return (
        <div className='rounded-[15px] bg-[#F0F2F5]   w-full overflow-hidden   grow '>
            <TextareaAutosize
                ref={contentRef}

                maxRows={3}
                minRows={1}
                className='resize-none  p-[12px] outline-none border-none  bg-[#F0F2F5]  w-full text-[14px] font-light'
                placeholder='Bình Luận'
            />
            <div className='h-auto flex flex-col bg-[#F0F2F5]  '>
                <div className='flex gap-[10px] flex-wrap'>

                    {
                        preAttachments.map(att => {
                            return (
                                <div className='max-w-[150px]'>
                                    <UploadImage key={att.id} src={att.link} cb={() => RemovePreAttachments(att)} />
                                </div>
                            );
                        })
                    }
                    {
                        newAttachments.map((att, i) => {
                            return (
                                <div className='max-w-[150px]'>
                                    <UploadImage src={URL.createObjectURL(att)} cb={() => RemoveNewAttachments(i)} />
                                </div>
                            );
                        })

                    }

                </div>
                <div className='flex justify-between h-auto w-full p-[12px] items-center'>
                    <div className='flex gap-[10px]'>
                        <BsEmojiLaughingFill size={18} />
                        <BsCameraFill onClick={OpenUpload} size={18} />
                    </div>
                    <div onClick={Comment}>
                        <IoMdSend size={22} />
                    </div>
                </div>
                <input onChange={HandleUpload} ref={fileRef} type='file' multiple className='hidden' />


            </div>

        </div>


    );

};