import { AnimatePresence, motion } from 'framer-motion';
import { useScroll } from '../../Helper/useScroll';
import React, { createContext, useEffect, useRef, useState } from 'react';
import { AiOutlineBell } from 'react-icons/ai';
import { twMerge } from 'tailwind-merge';
import '../../SCSS/Notification.scss';
import {
    CommentNotificationItem,
    FriendRequestAcceptedNotificationItem,
    FriendRequestNotificationItem,
    LikeCommentNotificationItem,
    LikePostNotificationItem,
    ReplyNotificationItem,
} from './NotificationItem.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { addNotifications } from '../../Reducers/Notifications.js';
import { NotificationType } from '../../Enums/NotificationType.js';
import { useMediaQuery } from 'react-responsive';
import { ScreenWidth } from '../../Enums/ScreenWidth';
import { NoNotifications } from './NoNotifications';
import Color from '../../Enums/Color.js';
import { useAxios } from '../../Hooks/useAxios';

export const NotificationDropdownContext = createContext();


export const NotificationDropdown = () => {
    const bellIcon = useRef(null);
    const dropdownRef = useRef(null)
    const notifications = useSelector(state => state.notifications);
    const [notification, setNotification] = useState(false);
    const [position, setPosition] = useState({ right: 0, top: 0, width: 0 });
    const [CCIDOfNotification, setCCIDOfNotification] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const dispatch = useDispatch();
    const ctxValue = {
        CCIDOfNotification, setCCIDOfNotification,
        notification,setNotification
    }
    const isPhoneScreen = useMediaQuery({ query: `(max-width: ${ScreenWidth.sm}px)` });
    const reachEnd = useRef(false);
    const Toggle = () => {
        setNotification(prev => !prev);
    }
    let unreadNotifications = notifications.filter(notification => !notification.read);
    const fetchMoreNotifications = async (page) => {
        const response = await axios.GET_Notifications(page, 10);
        if(response.status === 200)
        {
            dispatch(addNotifications(response.data));
        }
        return response.data;
    }
    const notificationRef = useRef(null);

    const {page, isEnd} = useScroll(notificationRef, fetchMoreNotifications);

    const variants = {
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.3
            }
        },
        hidden: {

            opacity: 0,
            y: -30,
            transition: {
                duration: 0.3
            }
        }

    }
    const setupDropdownPosition = () => {
        if (bellIcon.current) {



            if(!isPhoneScreen) {
                const { right, width } = bellIcon.current.getBoundingClientRect();
                setPosition({ top: 100, right, width });
                return;
            }
            setPosition({ top: 100, right: 0, width: window.innerWidth });

        }
    }
    const renderNotification = (notification, index) => {
        switch (notification.type) {
            case NotificationType.FRIEND_REQUEST:
                return <FriendRequestNotificationItem index={index}  key={notification.id} data={notification}></FriendRequestNotificationItem>
            case NotificationType.COMMENT:
                return <CommentNotificationItem index={index} key={notification.id} data={notification}></CommentNotificationItem>
            case NotificationType.LIKE_COMMENT:
                return <LikeCommentNotificationItem index={index} key={notification.id} data={notification}></LikeCommentNotificationItem>
            case NotificationType.LIKE_POST:
                return <LikePostNotificationItem  index={index} key={notification.id} data={notification}></LikePostNotificationItem>
            case NotificationType.FRIEND_ACCEPT:
                return <FriendRequestAcceptedNotificationItem index={index} key={notification.id} data={notification} />
            case NotificationType.REPLY:
                return <ReplyNotificationItem index={index} key={notification.id} data={notification} />
            default:
                return <div></div>
        }
    }
    const axios  = useAxios();


    useEffect(() => {
        if(showAll) {
            fetchMoreNotifications(2);
        }
    }, [showAll]);
    useEffect(() => {
        window.onresize = setupDropdownPosition;

    }, [])
    const handleClickOutside = (e) => {

            if(bellIcon.current && bellIcon.current.contains(e.target)) {
                return;
            }
            if (dropdownRef.current && !dropdownRef.current.contains(e.target) ) {
                setNotification(false);
                setShowAll(false)
            }

    }
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    })
    useEffect(() => {
        setupDropdownPosition();
    }, [notification])

    let className = twMerge("absolute  w-[350px] top-full z-[100] ");
    return (
        <NotificationDropdownContext.Provider value={ctxValue}>
            <AnimatePresence>
                {
                    notification &&
                    <div ref={dropdownRef} className={className} style={{width: isPhoneScreen ? "100%" : "", right: window.innerWidth - position.right - position.width, marginTop: 3 }}>
                        <motion.div className='rounded-[20px] qinqii-thin-shadow' variants={variants} initial="hidden" animate="visible" exit="hidden">
                            <div className="notification_header">
                                <div className="text-xl font-bold">Thông báo</div>
                            </div>
                            <div style={{overflowY: showAll ? 'scroll' : 'hidden', maxHeight:  'clamp(300px,100vh,400px)'}} ref={notificationRef} className={`notification w-full`} >

                                {
                                    notifications.length > 0 ?
                                        notifications.map((notification, index) => (
                                            renderNotification(notification, index)
                                        ))
                                        : <NoNotifications/>
                                }
                            </div>
                            <div className={`notification_footer  cursor-pointer hover:bg-[${Color.Hover}]`}>
                                {
                                 showAll ?
                                     <div onClick={() => setShowAll(false)} className="text-center w-full h-full text-blue-500 ">Thu gọn</div>
                                     :
                                    <div onClick={() => setShowAll(true)} className="text-center w-full h-full text-blue-500 ">Xem tất cả</div>
                                }
                            </div>
                        </motion.div>
                    </div>
                }
            </AnimatePresence>
            <div ref={bellIcon} onClick={Toggle} className="relative cursor-pointer">

                {
                    unreadNotifications.length > 0 &&
                    <div className="absolute top-[-0.2em] left-[-0.2em]">
                        <div className="rounded-full bg-red-500 w-[15px] h-[15px] flex justify-center items-center">
                            <div className="text-[0.5em] font-bold text-white">{unreadNotifications.length}</div>
                        </div>
                    </div>
                }

                <AiOutlineBell size={26}></AiOutlineBell>
            </div>
        </NotificationDropdownContext.Provider>
    )
}


