import { AnimatePresence, motion } from "framer-motion";
import React, { createContext, useEffect, useRef, useState } from "react";
import { AiOutlineBell } from 'react-icons/ai';
import { twMerge } from "tailwind-merge";
import '../../SCSS/Notification.scss';
import { CommentNotificationItem, FriendRequestAcceptedNotificationItem, FriendRequestNotificationItem, LikeCommentNotificationItem, LikePostNotificationItem, NotificationItem } from "./NotificationItem.jsx";
import { useDispatch, useSelector } from "react-redux";
import connection from '../../Helper/SignalR.js'
import { addNotification } from "../../Reducers/Notifications.js";
import { NotificationType } from "../../Enums/NotificationType.js";
import { useMediaQuery } from 'react-responsive';
import { ScreenWidth } from '../../Enums/ScreenWidth';
import { MessageDropdown } from '../MessageDropdown/MessageDropdown';
export const NotificationDropdownContext = createContext();


export const NotificationDropdown = () => {
    const [notification, setNotification] = useState(false);
    const bellIcon = useRef(null);
    const [position, setPosition] = useState({ right: 0, top: 0, width: 0 });
    const notifications = useSelector(state => state.notifications);
    const [CCIDOfNotification, setCCIDOfNotification] = useState(null);
    const dispatch = useDispatch();
    const ctxValue = {
        CCIDOfNotification, setCCIDOfNotification
    }
    const isPhoneScreen = useMediaQuery({ query: `(max-width: ${ScreenWidth.sm}px)` });
    const Toggle = () => {
        setNotification(!notification);
    }
    const variants = {
        visible: {
            height: "auto",
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.3
            }
        },
        hidden: {

            opacity: 0.5,
            y: -30,
            height: 0,
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
                return <LikePostNotificationItem index={index} key={notification.id} data={notification}></LikePostNotificationItem>
            case NotificationType.FRIEND_ACCEPT:
                return <FriendRequestAcceptedNotificationItem index={index} key={notification.id} data={notification} />
            default:
                return <div></div>
        }
    }

    useEffect(() => {
        window.onresize = setupDropdownPosition;

    }, [])

    useEffect(() => {
        setupDropdownPosition();
    }, [notification])

    let className = twMerge("absolute top-full z-[100] rounded-[10px]");
    return (
        <NotificationDropdownContext.Provider value={ctxValue}>
            <AnimatePresence>
                {
                    notification &&
                    <div className={className} style={{width: isPhoneScreen ? "100%" : "", right: window.innerWidth - position.right - position.width, marginTop: 3 }}>
                        <motion.div  variants={variants} initial="hidden" animate="visible" exit="hidden">
                            <div className="notification_header">
                                <div className="text-xl font-bold">Notification</div>
                            </div>
                            <div className="notification w-full" >

                                {
                                    notifications.length > 0 ?
                                        notifications.slice(0,5).map((notification, index) => (
                                            renderNotification(notification, index)
                                        ))
                                        : <EmptyNotification />
                                }
                            </div>
                        </motion.div>
                    </div>
                }
            </AnimatePresence>
            <div ref={bellIcon} onClick={Toggle} className="relative ">

                {
                    notifications.length > 0 &&
                    <div className="absolute top-[-0.2em] left-[-0.2em]">
                        <div className="rounded-full bg-red-500 w-[15px] h-[15px] flex justify-center items-center">
                            <div className="text-[0.5em] font-bold text-white">{notifications.length}</div>
                        </div>
                    </div>
                }

                <AiOutlineBell size={26}></AiOutlineBell>
            </div>
        </NotificationDropdownContext.Provider>
    )
}
const EmptyNotification = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="text-2xl font-bold">No Notification</div>
            <div className="text-gray-400">You will see your notification here</div>
        </div>
    )
}

