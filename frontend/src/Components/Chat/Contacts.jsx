import React, { useEffect } from 'react';
import { ImProfile } from 'react-icons/im';
import { RiMessage2Fill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Color from '../../Enums/Color';
import { openChat } from '../../Reducers/Chats.js';
import Loading from '../Common/Loading.jsx';
import { updateOnlineStatus } from '../../Reducers/Contacts.js';
import connection from '../../Helper/SignalR.js';
import { OnlineStatus } from '../../Enums/OnlineStatus';
import { InActiveDot } from '../Common/InActiveDot';
import { ActiveDot } from '../Common/ActiveDot';
import { Header } from '../Common/Header';
import { Text } from '../Common/Text';
import { Avatar } from '../Common/Avatar';

const ContactItem = ({
                         contact: {
                             conversation_id, converstaion_default_emoji, sender_id,
                             recipient_id, recipient_name, recipient_avatar, online_status,
                         }, contact,
                     }) => {

    const dispatch = useDispatch();

    const OpenChat = () => {
        dispatch(openChat(conversation_id));
    };

    return (
        <div className='flex w-full gap-[5px] p-[15px_20px] items-center'>
            <div className='flex-[2.5]'>
                <Avatar src={recipient_avatar} user_id={recipient_id} />
            </div>
            <div className='flex-[7.5]'>

                <Text> <Text bold>{recipient_name}</Text> </Text>
            </div>
            <div className='flex-[2] flex justify-center items-center gap-2'>
                {
                    online_status === OnlineStatus.ONLINE ? <ActiveDot></ActiveDot> : <InActiveDot></InActiveDot>
                }
                <div onClick={() => OpenChat()}>
                    <RiMessage2Fill color={Color.Primary} size={24} />
                </div>
                <div>
                    <Link className='flex grow-[1]' to={`/user/${recipient_id}`}>
                        <ImProfile color={Color.Title} size={20} />
                    </Link>
                </div>
            </div>
        </div>);
};
const EmptyContactList = () => {
    return (
        <div className='h-[600px] flex flex-col gap-[50px] items-center justify-center'>
            <Loading></Loading>
            <p className='text-[14px] font-light'>
                Đang tải danh sách liên hệ
            </p>
        </div>
    );
};

export function ContactList() {

    const contacts = useSelector(state => state.contacts);

    return (
        <div className={`flex flex-col`}>
            <Header title='CONTACTS' count={5}></Header>
            <div className={`flex  flex-col bg-[${Color.White}]`}>
                {
                    contacts.length > 0 ? contacts.map(f => (
                        <ContactItem key={f.conversation_id} contact={f}></ContactItem>
                    )) : <EmptyContactList></EmptyContactList>
                }
            </div>
        </div>
    );
}
