import React, { useContext, useRef, useState } from 'react';
import { Input, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { hideModal } from '../../Reducers/Modals';
import { motion } from 'framer-motion';
import { AiOutlineCamera } from 'react-icons/ai';
import { ShowNotification } from '../../Reducers/UI';
import { Severity } from '../../Enums/FetchState';
import { useAxios } from '../../Hooks/useAxios';
import { QinqiiCustomImage } from '../Common/QinqiiCustomImage';
import { UserOutlined } from '@ant-design/icons';
import { MdCancel } from 'react-icons/md';
import { isEmpty } from 'lodash';
import { fetchProfile } from '../../Reducers/Profile';
import { AntdNotificationContext } from '../../App';

export function UploadAvatarModal() {
    const dispatch = useDispatch();
    const avatarInputRef = useRef(null);
    const backgroundInputRef = useRef(null);
    const nameInputRef = useRef(null);
    const me = useSelector(state => state.user);
    const [avatar, setAvatar] = useState((me.avatar));
    const [background, setBackground] = useState((me.background));
    const [nameClick, setNameClick] = useState(false);
    const axios = useAxios();
    const handleClose = () => {
        dispatch(hideModal());
    };

    const handleAvatarClick = () => {
        avatarInputRef.current.click();
    };
    const notify = useContext(AntdNotificationContext)
    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file.type.startsWith('image/')) {
            const src = URL.createObjectURL(file);
            setAvatar(src);
            URL.revokeObjectURL(file);
        } else {
            notify.open({
                message: 'File không hợp lệ',
                type: 'error',
                duration: 5,
                placement: 'bottomLeft'
            })
        }
    };
    const handleBackgroundClick = () => {
        backgroundInputRef.current.click();
    };
    const handleBackgroundUpload = (e) => {
        const file = e.target.files[0];
        if (file.type.startsWith('image/')) {
            const src = URL.createObjectURL(file);
            setBackground(src);
            URL.revokeObjectURL(file);
        } else dispatch(ShowNotification({ content: 'File không hợp lệ', severity: Severity.ERROR }));
    };


    const uploadAvatar = async () => {
        let _name = nameInputRef.current.input.value;
        let _avatar = avatarInputRef.current.files[0];
        let _background = backgroundInputRef.current.files[0];
        const [statusCode, error] = await axios.POST_UpdateProfile({
            avatar: _avatar,
            background: _background,
            name: isEmpty(_name) ? me.name : _name,
        });
        if (statusCode !== 200) {
            notify.open({
                message: 'Cập nhật avatar thất bại',
                type: 'error',
                duration: 5,
                placement: 'bottomLeft'
            })
        }
        else {
            dispatch(fetchProfile({...me, avatar, background, name: _name}))
            notify.open({
                message: 'Cập nhật avatar thành công',
                type: 'success',
                duration: 5,
                placement: 'bottomLeft'
            })
        }
        dispatch(hideModal());
    };
    return (
        <Modal onOk={uploadAvatar} okType={'default'} cancelButtonProps={null} open={true}
               className='avatar-upload-modal' onCancel={handleClose}>
            <div className='w-full  aspect-video relative'>
                <div onClick={handleBackgroundClick} className='relative w-full h-full'>
                    <motion.div
                        className='absolute z-9 h-full cursor-pointer flex w-full items-center justify-center bg-white'
                        initial={{ opacity: 0 }} whileHover={{ opacity: 0.3 }}>
                        <AiOutlineCamera size={28} />
                    </motion.div>
                    <QinqiiCustomImage className='rounded-[9px] qinqii-thin-shadow object-cover w-full h-full'
                                       src={background} alt='' />
                    <input onChange={handleBackgroundUpload} ref={backgroundInputRef} className='hidden' type='file'
                           alt='avatar' />
                </div>
                <div onClick={handleAvatarClick}
                     className='absolute bottom-0 left-[50%] translate-x-[-50%] translate-y-[50%] flex flex-col justify-between items-center overflow-hidden rounded-[50%]'>
                    <motion.div
                        className='absolute z-10 h-full cursor-pointer flex w-full items-center justify-center bg-white'
                        initial={{ opacity: 0 }} whileHover={{ opacity: 0.3 }}>
                        <AiOutlineCamera size={28} />
                    </motion.div>
                    <div
                        className='shrink-0 border-[5px] relative   border-white box-border   overflow-hidden h-[150px] w-[150px] bg-[black] rounded-[50%]'>
                        <QinqiiCustomImage src={avatar} className='w-full shrink-0 h-full object-cover' alt='' />
                    </div>
                    <input onChange={handleAvatarUpload} ref={avatarInputRef} className='hidden' type='file'
                           alt='avatar' />

                </div>
                <div className='absolute cursor-pointer bottom-[-110px] left-[50%] translate-x-[-50%]'>

                    <div className='relative' style={{ display: nameClick ? 'initial' : 'none' }}>
                        <Input size='middle' placeholder='large size' ref={nameInputRef} prefix={<UserOutlined />} />
                        <div className='absolute right-[-20px] top-[50%] translate-y-[-50%]'>
                            <MdCancel size={18} onClick={() => setNameClick(false)} className='text-red-400' />
                        </div>
                    </div>
                    <h1 onClick={() => setNameClick(true)} style={{ display: nameClick ? 'none' : 'initial' }}
                        className='text-[28px] font-bold'>{me.name}</h1>

                </div>
            </div>


        </Modal>
    );
}

