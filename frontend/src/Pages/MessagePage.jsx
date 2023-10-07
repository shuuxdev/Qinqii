import { Avatar } from '../Components/Common/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { Text } from '../Components/Common/Text';
import { ActiveDot } from '../Components/Common/ActiveDot';
import { useAxios } from '../Hooks/useAxios';
import React, { createContext, useEffect, useState } from 'react';
import { fetchUser } from '../Reducers/User';
import { isEmpty } from 'lodash';
import { useUserID } from '../Hooks/useUserID';
import { fetchContacts } from '../Reducers/Contacts';
import { InActiveDot } from '../Components/Common/InActiveDot';
import { timeSinceCreatedAt } from '../Helper/GetTimeSince';
import { HeaderText } from '../StyledComponents/styled';
import Color from '../Enums/Color';
import { CallContext } from '../Layouts/DefaultLayout';
import { useWebRTC } from '../Hooks/useWebRTC';
import { ChatV2 } from '../Components/Chat/ChatV2';
import { useMediaQuery } from 'react-responsive';
import { ScreenWidth } from '../Enums/ScreenWidth';
import { twMerge } from 'tailwind-merge';
import { motion, useAnimation } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io';
import { NoChatSelected } from '../Components/Chat/NoChatSelected';
import CallModal from '../Components/Modals/CallModal';

export const MessagePageContext = createContext();
export const MessagePage = () => {
    const contacts = useSelector(state => state.contacts);
    const dispatch = useDispatch();
    const axios = useAxios();
    const params = useParams();
    const [selectedContactIndex, setSelectedContactIndex] = useState(null);
    const isPhoneScreen = useMediaQuery({ query: `(max-width: ${ScreenWidth.sm}px)` });
    const chatClass = twMerge('flex-1 w-full h-full', isPhoneScreen ? 'absolute top-0 left-full' : '');
    const chatListClass = twMerge('flex-col flex h-full p-[10px]', isPhoneScreen ? 'w-full' : 'w-[300px] ')
    const chatControl  = useAnimation();

    const handleItemClick = (index) => {
        setSelectedContactIndex(index);
        chatControl.start({left: 0, transition: {duration: 0.3}})
    }
    const handleBackClick = () => {
        setSelectedContactIndex(null)
        chatControl.start({left: '100%', transition: {duration: 0.3}})
    }

    const BackButton = () => (
            <IoMdArrowBack onClick={handleBackClick} className='cursor-pointer' size={30} />
    )

    useEffect(() => {
        const fetchContactAsync = async () => {
            const response = await axios.GET_AllChat();
            if (response.error) {
                return;
            }
            dispatch(fetchContacts(response.data));

        };
        fetchContactAsync();
    }, []);
    useEffect(() => {
        if(params.id)
        {
            let index = contacts.findIndex((contact) => contact.conversation_id == params.id)
            if(index !== -1)
            {
                handleItemClick(index);
            }
        }
    },[contacts])

    return (
        <CallContext.Provider value={useWebRTC()}>
            <CallModal key={Math.random()}/>
                <MessagePageContext.Provider value={{ BackButton, selectedContactIndex, handleItemClick }}>
                    <div className='flex relative h-screen bg-white'>
                        <div className={chatListClass}>
                            <Header />
                            <ContactContainer contacts={contacts} />
                        </div>
                        <motion.div animate={chatControl} className={chatClass}>
                            {
                                contacts.length > 0 && selectedContactIndex != null ?
                                <ChatV2 contact={contacts[selectedContactIndex]} />
                                    : <NoChatSelected/>
                            }
                        </motion.div>
                    </div>
                </MessagePageContext.Provider>
        </CallContext.Provider>

    );
};

const Header = () => {
    const user = useSelector(state => state.user);
    const userID = useUserID();
    const dispatch = useDispatch();
    const axios = useAxios();
    useEffect(() => {
        const fetchUserAsync = async () => {

            const response = await axios.GET_UserProfile(userID);
            if (response.error) {
                return;
            }
            dispatch(fetchUser(response.data));
        };
        fetchUserAsync();
    }, []);
    return (
        <div className='flex   justify-center items-center'>
           <HeaderText>Messages</HeaderText>
        </div>
    );
};
const ContactContainer = ({contacts}) => {

    return (
        <div className='flex overflow-y-auto grow flex-col '>
            {
                contacts.map((contact, index) => (
                        <ContactItem index={index} contact={contact} key={contact.conversation_id} />

                ))
            }
        </div>
    );
};
const ContactItem = ({ contact, index }) => {
    const me = useUserID();
    const {handleItemClick} = React.useContext(MessagePageContext);
    return (
        <div className={`flex p-[10px] items-start gap-[10px] relative hover:bg-[${Color.Hover}] cursor-pointer`} onClick={() => handleItemClick(index)}>
            {
                !isEmpty(contact) &&
                <div className=' relative flex  gap-[10px]'>
                    <Avatar src={contact.recipient_avatar} user_id={contact.recipient_id} />
                    <div className='absolute top-0 right-0'>
                        {
                            contact.is_online ?
                                <ActiveDot />
                                :
                                <InActiveDot />
                        }
                    </div>
                </div>
            }
            <div className='flex flex-col'>
                <Text>{contact.recipient_name}</Text>
                <div className='flex items-center gap-[20px]'>
                    <Text>{contact.last_message_sender_id == me ? 'Bạn: ' : ''}{contact.last_message}</Text>
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
    );
};