import React, { useRef, useState } from 'react';
import { Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { hideModal, showModal } from '../../Modules/Modals';
import { motion } from 'framer-motion';
import { AiOutlineCamera } from 'react-icons/ai';
import { faker } from '@faker-js/faker';
import { QinqiiCustomImage } from '../CommonComponent';
import { ModalType } from '../../Enums/Modal';
import { ShowNotification } from '../../Modules/UI';
import { Severity } from '../../Enums/FetchState';
import { useAxios } from '../../Hooks/useAxios';

export function UploadAvatarModal({src}) {
    const dispatch = useDispatch();
    const inputRef = useRef(null);
    const axios = useAxios();
    const handleClose = () => {
        dispatch(hideModal());
    }
    const [chosenImage, setChosenImage] = useState(null);
    const [source, setSource] = useState(src);

    const handleClick = () => {
        inputRef.current.click();
    }
    const handleUpload = (e) => {
        const file = e.target.files[0];
        if(file.type.startsWith('image/') ) {
            const src = URL.createObjectURL(file);
            setSource(src);
            setChosenImage(file);
            URL.revokeObjectURL(file);
        }
        else dispatch(ShowNotification({content: 'File không hợp lệ', severity: Severity.ERROR}))
    }
    const uploadAvatar = async () => {
        const [statusCode, error] = await axios.POST_ChangeAvatar(chosenImage);
        if(statusCode !== 200) {
            dispatch(ShowNotification({content: 'Khong thể cập nhật avatar: ' + error, severity: Severity.ERROR}))
        }
        dispatch(hideModal());
        
    }
    return (
        <Modal onOk={uploadAvatar} okType={'default'} cancelButtonProps={null} open={true} className='avatar-upload-modal' onCancel={handleClose} >
            <div onClick={handleClick} className="relative flex flex-col justify-between items-center overflow-hidden rounded-[50%]">
                <motion.div className='absolute z-10 h-full cursor-pointer flex w-full items-center justify-center bg-white' initial={{opacity:0}} whileHover={{opacity: 0.3}}>
                    <AiOutlineCamera size={28}/>
                </motion.div>
                <div  className="shrink-0 border-[5px] relative   border-white box-border   overflow-hidden h-[150px] w-[150px] bg-[black] rounded-[50%]">
                    <QinqiiCustomImage src={source} className='w-full shrink-0 h-full object-cover' alt="" />
                </div>
                <input onChange={handleUpload} ref={inputRef} className='hidden' type="file" alt="avatar"  />
            </div>
        </Modal>
    );
}

