import { AnimatePresence, motion } from 'framer-motion';
import { ScreenWidth } from '../../Enums/ScreenWidth';
import { useMediaQuery } from 'react-responsive';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from '../Common/Avatar';
import { Text } from '../Common/Text';
import { MdMessage } from 'react-icons/md';
import React, { useEffect, useRef, useState } from 'react';
import Color from '../../Enums/Color';
import { openChat } from '../../Reducers/Chats';
import { useUserID } from '../../Hooks/useUserID';
import { timeSinceCreatedAt } from '../../Helper/GetTimeSince';
import '../../SCSS/MessageDropdown.scss';
import { CallContext } from '../../Layouts/DefaultLayout';
import { useWebRTC } from '../../Hooks/useWebRTC';
import { useNavigate } from 'react-router-dom';
import { ChatSearch } from '../Search/ChatSearch';

export const MessageDropdown = () => {
    // const isPhoneScreen = useMediaQuery(`(max-width: ${ScreenWidth.sm})px`);
    const variant = {
        visible: {
            opacity: 1,
            y: 0,
        },
        hidden: {
            y: '-30px',
            opacity: 0,
        },
    };
    const [isOpen, setIsOpen] = useState(false);

    const [position, setPosition] = useState({ right: 0, top: 0, width: 0 });
    const isPhoneScreen = useMediaQuery({ query: `(max-width: ${ScreenWidth.sm}px)` });
    const [selectedContactIndex, setSelectedContactIndex] = useState(0);
    const messageIcon = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const setupDropdownPosition = () => {
            if (messageIcon.current) {
            if (!isPhoneScreen) {
                const { right, width } = messageIcon.current.getBoundingClientRect();
                setPosition({ top: 100, right, width });
                return;
            }
            setPosition({ top: 100, right: 0, width: window.innerWidth });
        }
    };
    const Toggle = () => setIsOpen(!isOpen);

    const handleItemClick = async (index) => {
        Toggle();
        const selected = contacts[index];
        if(isPhoneScreen)
        navigate(`/message/${selected.conversation_id}`)
        else {
            dispatch(openChat(selected.conversation_id));
        }
    }
    useEffect(() => {
        window.onresize = setupDropdownPosition;
    }, []);
    useEffect(() => {
        setupDropdownPosition();
    }, [isOpen]);

    const contacts = useSelector(state => state.contacts);
    let unreadConversations = contacts.filter(contact => contact.unread_messages > 0).length;

    return (
        <CallContext.Provider value={useWebRTC()}>
            <div ref={messageIcon} className='messages-icon relative cursor-pointer' onClick={Toggle}>
                <MdMessage size={24} />
                {
                    unreadConversations > 0 &&
                    <div className='absolute top-[-0.2em] left-[-0.2em]'>
                        <div className="rounded-full bg-red-500 w-[15px] h-[15px] flex justify-center items-center">
                            <div className="text-[0.5em] font-bold text-white">{unreadConversations}</div>
                        </div>
                    </div>
                }

            </div>
            <AnimatePresence>
                {
                    isOpen &&
                    <motion.div className='absolute z-[200]  bg-white  qinqii-thin-shadow  w-[400px]  overflow-hidden rounded-[10px] top-[100%]' initial='hidden' exit='hidden' animate='visible'
                                variants={variant} style={{
                        width: isPhoneScreen ? '100%' : '',
                        right: window.innerWidth - position.right - position.width,
                        marginTop: 3,
                    }}>
                        <div className='message-dropdown p-[10px]'>
                            <div className="text-xl font-bold p-[10px]">Tin nhắn</div>
                            <ChatSearch/>
                            {
                                contacts.map((contact,index) => (
                                    <MessageDropdownItem  onClick={() => handleItemClick(index)} contact={contact} key={contact.conversation_id}/>
                                ))
                            }
                        </div>
                    </motion.div>
                }

            </AnimatePresence>
        </CallContext.Provider>
    );

};

const MessageDropdownItem = ({ contact, onClick}) => {
    const me = useUserID();


    return (
        <div className={` relative message-dropdown-item cursor-pointer my-[5px] hover:bg-[${Color.Hover}] flex items-center gap-[10px] p-[10px]`} onClick={onClick}>
                <Avatar src={contact.recipient_avatar} user_id={contact.recipient_id} />
            <div className='grow flex flex-col'>
                <Text>{contact.recipient_name}</Text>
                <div className='flex items-center gap-[20px]'>
                    <Text>{contact.last_message_sender_id === me ? 'Bạn: ' : ''}{contact.last_message}</Text>
                    <Text fontSize={13}>{contact.last_message_sent_at ? timeSinceCreatedAt(contact.last_message_sent_at) : ''}</Text>
                </div>
                <div className='absolute top-[50%] translate-y-[-50%] right-[20px]'>
                    {
                        contact.unread_messages > 0 &&
                        <div className="absolute top-[-0.2em] left-[-0.2em]">
                            <div className="rounded-full bg-red-500 w-[15px] h-[15px] flex justify-center items-center">
                                <div className="text-[0.5em] font-bold text-white">{contact.unread_messages}</div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}