import { Avatar } from '../Components/Common/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { Text } from '../Components/Common/Text';
import { ActiveDot } from '../Components/Common/ActiveDot';
import { useAxios } from '../Hooks/useAxios';
import React, { createContext, useEffect, useState } from 'react';
import { fetchUser } from '../Reducers/User';
import { isEmpty } from 'lodash';
import { useUserID } from '../Hooks/useUserID';
import { addContact, fetchContacts } from '../Reducers/Contacts';
import { InActiveDot } from '../Components/Common/InActiveDot';
import { timeSinceCreatedAt } from '../Helper/GetTimeSince';
import Color from '../Enums/Color';
import { ChatV2 } from '../Components/Chat/ChatV2';
import { useMediaQuery } from 'react-responsive';
import { ScreenWidth } from '../Enums/ScreenWidth';
import { twMerge } from 'tailwind-merge';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io';
import { NoChatSelected } from '../Components/Chat/NoChatSelected';
import CallModal from '../Components/Modals/CallModal';
import { ChatSearch } from '../Components/Search/ChatSearch';
import { openChat } from '../Reducers/Chats';
import { BiLogOut } from 'react-icons/bi';
import { ChatV2Item } from '../Components/Chat/ChatV2Item';
import Loading from '../Components/Common/Loading';

export const MessagePageContext = createContext();
export const MessagePage = () => {
    const contacts = useSelector(state => state.contacts);
    const dispatch = useDispatch();
    const axios = useAxios();
    const params = useParams();
    const [selectedContactIndex, setSelectedContactIndex] = useState(null);
    const isPhoneScreen = useMediaQuery({ query: `(max-width: ${ScreenWidth.sm}px)` });
    const chatClass = twMerge('flex-1', isPhoneScreen ? 'fixed top-0 left-full' : '');
    const chatListClass = twMerge('flex-col flex h-full p-[10px]', `border-[${Color.Border}] border-r-[1px] border-solid`, isPhoneScreen ? 'w-full' : 'w-[300px] ');
    const chatControl = useAnimation();
    const [foundContacts, setFoundContacts] = useState([]);
    const handleItemClick = (index) => {
        setSelectedContactIndex(index);
        chatControl.start({ width: '100%', height: '100%', transition: { duration: 0 } });
        chatControl.start({ left: 0, transition: { duration: 0.5 } });
    };
    const handleBackClick = () => {
        setSelectedContactIndex(null);

        chatControl.start({ left: '100%', transition: { duration: 0.5 } });
    };

    const BackButton = () => (
        <IoMdArrowBack onClick={handleBackClick} className='cursor-pointer' size={30} />
    );

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
        if (params.id) {
            let index = contacts.findIndex((contact) => contact.conversation_id == params.id);
            if (index !== -1) {
                handleItemClick(index);
            }
        }
    }, [contacts]);

    const handleSearch = (searchResults) => {
        setFoundContacts(searchResults);
    };
    const navigate = useNavigate();
    const handleSearchItemClick = async (people_id) => {
        setFoundContacts([]);
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
    return (
        <>
            <CallModal key={Math.random()} />
            <MessagePageContext.Provider
                value={{ BackButton, selectedContactIndex, foundContacts, handleSearchItemClick, handleItemClick }}>
                <div className={`flex relative h-screen bg-white `}>
                    <div className={chatListClass}>
                        <Header />
                        <ChatSearch onFinished={handleSearch} />
                        <ContactContainer contacts={contacts} />
                    </div>
                    <motion.div animate={chatControl} className={chatClass}>
                        {
                            contacts.length > 0 && selectedContactIndex != null ?
                                <ChatV2 contact={contacts[selectedContactIndex]} />
                                : <NoChatSelected />
                        }
                    </motion.div>
                </div>
            </MessagePageContext.Provider>
        </>

    );
};

const Header = () => {
    const user = useSelector(state => state.user);
    const userID = useUserID();
    const dispatch = useDispatch();
    const axios = useAxios();
    const navigate = useNavigate()
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
        <div
            className={`flex pb-[10px] px-[10px] mb-[10px] border-b-[1px] border-[${Color.Border}] border-solid  justify-between items-center`}>

            <div className='text-xl font-bold'>Tin nhắn</div>
            <div onClick={() => navigate('/')}>
                <BiLogOut className='hover:text-red-500 cursor-pointer' size={22}/>
            </div>
        </div>
    );
};

const ContactContainer = ({ contacts }) => {
    const { foundContacts, handleSearchItemClick } = React.useContext(MessagePageContext);
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        setIsLoaded(contacts.length > 0)
    }, [contacts])
    return (
        <div className='flex overflow-y-auto grow flex-col py-[10px]'>
            {
                !isLoaded ? <Loading/> :
                foundContacts.length > 0 ?
                    foundContacts.map((people) => (
                        <SearchItem onClick={() => handleSearchItemClick(people.id)} people={people}
                                    key={people.id} />
                    )) :
                    contacts.map((contact, index) => (
                        <ChatV2Item index={index} contact={contact} key={contact.conversation_id} />

                    ))
            }
        </div>
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