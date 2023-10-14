import { AnimatePresence, motion } from 'framer-motion';
import Color from '../../Enums/Color';
import { Text } from '../Common/Text';
import {MdDone,MdDelete} from 'react-icons/md'
import React, { useContext } from 'react';
import { NotificationDropdownContext } from './NotificationDropdown';
import { deleteNotificationThunk, markAsReadThunk } from '../../Reducers/Notifications';
import { useDispatch } from 'react-redux';
import { AntdNotificationContext } from '../../App';

export const NotificationMenu = ({ isOpen, TriggerElement, index }) => {
    const dispatch = useDispatch();
    const {CCIDOfNotification,setCCIDOfNotification} = useContext(NotificationDropdownContext);
    const handleMarkAsRead = () => {
        setCCIDOfNotification(null);
        dispatch(markAsReadThunk(CCIDOfNotification));
    }
    const handleDelete = () => {
        setCCIDOfNotification(null);
        dispatch(deleteNotificationThunk(CCIDOfNotification, notify))
    }
    const notify = useContext(AntdNotificationContext);
    let variant = {
        visible: {
            opacity: 1,
            y: 0,
        },
        hidden: {
            opacity: 0,
            y: -30,
        },
    };
    return (
        <>
            <TriggerElement/>
            <AnimatePresence >
                {
                    isOpen &&
                    <motion.div style={{zIndex:index}}  className='p-[5px] qinqii-thin-shadow   bg-white w-[200px] absolute right-0 top-[calc(100%+10px)] rounded-[7px]'
                                variants={variant} animate='visible' initial='hidden' exit='hidden'>
                        <MenuItem onClick={handleDelete}>
                            <Text className={`w-fit text-[14px] group-hover:text-white`}> Xóa bình luận</Text>
                            <MdDelete className='text-red-500' />
                        </MenuItem>
                        <MenuItem onClick={handleMarkAsRead}>
                            <Text className='w-fit text-[14px] group-hover:text-white'> Đánh dấu là đã đọc</Text>
                            <MdDone className='text-green-500' />
                        </MenuItem>
                    </motion.div>
                }
            </AnimatePresence>
        </>

    );
};
const MenuItem = ({ children, onClick }) => {
    return (
        <div

            onClick={onClick}
            className={`border-t-[${Color.Border}]  cursor-pointer hover:bg-[${Color.Hover}] rounded-[5px] border-1px border-solid px-[12px] py-[7px] flex justify-between items-center`}>
            {children}
        </div>
    );
};