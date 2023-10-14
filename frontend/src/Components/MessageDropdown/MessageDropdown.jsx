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
import { useAxios } from '../../Hooks/useAxios';
import { addContact } from '../../Reducers/Contacts';
import NewMessageAudio from '../../Assets/new-message.wav';
import { useSecondEffectHook } from '../../Hooks/useSecondEffectHook';
import { ChatItem } from '../Chat/ChatItem';


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
    const [founded, setFounded] = useState([]);
    const isPhoneScreen = useMediaQuery({ query: `(max-width: ${ScreenWidth.sm}px)` });
    const messageIcon = useRef(null);
    const messageDropdown = useRef(null);
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
        if (isPhoneScreen)
            navigate(`/message/${selected.conversation_id}`);
        else {
            dispatch(openChat(selected.conversation_id));
        }
    };
    const handleClickOutside = (e) => {
        if (messageIcon.current && messageDropdown.current && !messageIcon.current.contains(e.target) && !messageDropdown.current.contains(e.target)) {
            setIsOpen(false);
        }
    };
    useEffect(() => {

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };

    });
    const axios = useAxios();
    const handleSearchItemClick = async (people_id) => {
        Toggle();
        setFounded([]);
        let selected = contacts.find(contact => contact.recipient_id === people_id);
        if (!selected) {
            let [data, error] = await axios.GET_ConversationWithUser(people_id);
            if (!error)
                selected = data;
        }
        if (isPhoneScreen)
            navigate(`/message/${selected.conversation_id}`);
        else {
            dispatch(addContact(selected));
            dispatch(openChat(selected.conversation_id));
        }
    };

    useEffect(() => {
        window.onresize = setupDropdownPosition;

    }, []);
    useEffect(() => {
        setupDropdownPosition();


    }, [isOpen]);

    const handleSearch = (searchResults) => {
        setFounded(searchResults);
    };
    var newMessageSound = async (note) => {

        var audio = new Audio(NewMessageAudio);
        audio.type = 'audio/wav';
        try {
            await audio.play();
            console.log('Playing audio' + audio);
        } catch (err) {
            console.log('Failed to play, error: ' + err);
        }
    };
    const contacts = useSelector(state => state.contacts);
    let unreadConversations = contacts.filter(contact => contact.unread_messages > 0).length;
    let allUnreadMessages = contacts.reduce((acc, contact) => acc + contact.unread_messages, 0);
    const previousUnreadConversations = useRef(allUnreadMessages);
    useSecondEffectHook(() => {
        if (allUnreadMessages < previousUnreadConversations.current) {
            previousUnreadConversations.current = allUnreadMessages;
            return;
        }
        if (allUnreadMessages === 0) {
            previousUnreadConversations.current = 0;
            return;
        }
        previousUnreadConversations.current = allUnreadMessages;
        newMessageSound();
    }, [allUnreadMessages]);
    return (
        <>
            <div ref={messageIcon} className='messages-icon relative cursor-pointer' onClick={Toggle}>
                <MdMessage size={24} />
                {
                    unreadConversations > 0 &&
                    <div className='absolute top-[-0.2em] left-[-0.2em]'>
                        <div className='rounded-full bg-red-500 w-[15px] h-[15px] flex justify-center items-center'>
                            <div className='text-[0.5em] font-bold text-white'>{unreadConversations}</div>
                        </div>
                    </div>
                }

            </div>
            <AnimatePresence>
                {
                    isOpen &&
                    <motion.div ref={messageDropdown}
                                className='absolute z-[200]  bg-white  qinqii-thin-shadow  w-[400px]  overflow-hidden rounded-[10px] top-[100%]'
                                initial='hidden' exit='hidden' animate='visible'
                                variants={variant} style={{
                        width: isPhoneScreen ? '100%' : '',
                        right: window.innerWidth - position.right - position.width,
                        marginTop: 3,
                    }}>
                        <div className='message-dropdown p-[10px]'>
                            <div className='text-xl font-bold p-[10px]'>Tin nhắn</div>
                            <ChatSearch onFinished={handleSearch} />

                            {
                                founded.length > 0 ?
                                    founded.map((people) => (
                                        <SearchItem onClick={() => handleSearchItemClick(people.id)} people={people}
                                                    key={people.id} />
                                    )) :
                                    contacts.map((contact, index) => (
                                        <ChatItem onClick={() => handleItemClick(index)} contact={contact}
                                                             key={contact.conversation_id} />
                                    ))
                            }
                        </div>
                    </motion.div>
                }

            </AnimatePresence>
        </>
    );

};

const SearchItem = ({ people, onClick }) => {

    return (
        <div
            className={`flex items-center p-[10px] gap-[10px] my-[3px] hover:border-r-2 hover:border-blue-500 hover:border-solid hover:bg-[${Color.Background}]`}
            onClick={onClick}>
            <div className='shrink-0'>
                <Avatar sz={45} src={people.avatar} user_id={people.id} />

            </div>
            <div className='grow'>
                <Text>{people.name}</Text>
            </div>
        </div>
    );
};

const MessageDropdownItem = ({ contact, onClick }) => {
    const me = useUserID();


    return (
        <div
            className={` relative message-dropdown-item cursor-pointer my-[5px] hover:bg-[${Color.Hover}] flex items-center gap-[10px] p-[10px]`}
            onClick={onClick}>
            <Avatar src={contact.recipient_avatar} user_id={contact.recipient_id} />
            <div className='grow flex flex-col'>
                <Text>{contact.recipient_name}</Text>
                <div className='flex items-center gap-[20px]'>
                    <Text>{contact.last_message_sender_id === me ? 'Bạn: ' : ''}{contact.last_message}</Text>
                    <Text
                        fontSize={13}>{contact.last_message_sent_at ? timeSinceCreatedAt(contact.last_message_sent_at) : ''}</Text>
                </div>
                <div className='absolute top-[50%] translate-y-[-50%] right-[20px]'>
                    {
                        contact.unread_messages > 0 &&
                        <div className='absolute top-[-0.2em] left-[-0.2em]'>
                            <div className='rounded-full bg-red-500 w-[15px] h-[15px] flex justify-center items-center'>
                                <div className='text-[0.5em] font-bold text-white'>{contact.unread_messages}</div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};