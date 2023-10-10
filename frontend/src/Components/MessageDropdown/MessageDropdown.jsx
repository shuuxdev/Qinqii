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
    const messageIcon = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [founded, setFounded] = useState([]);

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
    const axios = useAxios();
    const handleSearchItemClick = async (people_id) => {
        Toggle();
        setFounded([])
        let selected = contacts.find(contact => contact.recipient_id === people_id);
        if(!selected) {
            let [data,error] = await  axios.GET_ConversationWithUser(people_id);
            if(!error)
                selected = data;
        }
        if(isPhoneScreen)
            navigate(`/message/${selected.conversation_id}`)
        else {
            dispatch(addContact(selected));
            dispatch(openChat(selected.conversation_id));
        }
    }
    useEffect(() => {
        window.onresize = setupDropdownPosition;
    }, []);
    useEffect(() => {
        setupDropdownPosition();
    }, [isOpen]);

    const handleSearch =  (searchResults) => {
        setFounded(searchResults);
    }

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
                            <ChatSearch onFinished={handleSearch}/>

                            {
                                founded.length  > 0 ?
                                founded.map((people) => (
                                    <SearchItem  onClick={() =>  handleSearchItemClick(people.id)} people={people} key={people.id}/>
                                )) :
                                contacts.map((contact, index) => (
                                    <MessageDropdownItem onClick={() => handleItemClick(index)} contact={contact} key={contact.conversation_id}/>
                                ))
                            }
                        </div>
                    </motion.div>
                }

            </AnimatePresence>
        </CallContext.Provider>
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
    )
}

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