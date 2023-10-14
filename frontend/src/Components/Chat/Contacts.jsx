import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Color from '../../Enums/Color';
import { openChat } from '../../Reducers/Chats.js';
import Loading from '../Common/Loading.jsx';
import { OnlineStatus } from '../../Enums/OnlineStatus';
import { InActiveDot } from '../Common/InActiveDot';
import { ActiveDot } from '../Common/ActiveDot';
import { Header } from '../Common/Header';
import { Text } from '../Common/Text';
import { Avatar } from '../Common/Avatar';
import { AiOutlineProfile } from 'react-icons/ai';

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
    const navigate = useNavigate();
    return (

        <div   className={`cursor-pointer flex w-full gap-[5px] hover:bg-[${Color.Hover}]  items-center`}>
            <div className={'pl-[15px] py-[15px]'}>
                <Avatar src={recipient_avatar} sz={30} user_id={recipient_id} />
            </div>

            <div onClick={() => OpenChat()} className='h-full flex p-[15px] justify-start items-center grow'>

                <Text> <Text bold>{recipient_name}</Text> </Text>
            </div>
            <div className='flex justify-center items-center gap-2'>
                {
                    online_status === OnlineStatus.ONLINE ? <ActiveDot></ActiveDot> : <InActiveDot></InActiveDot>
                }
                <div onClick={() => navigate(`/user/${recipient_id}`)}>
                        <AiOutlineProfile on className='hover:text-red-500' size={20} />
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
        <div className={`flex rounded-[10px] bg-[${Color.White}] overflow-hidden flex-col`}>
            <div className={`border-b-[1px] border-[${Color.Border}] border-solid`}>
                <Header title='CONTACTS' count={contacts.length}></Header>
            </div>
            <div className={`flex p-[7px]  flex-col `}>
                {
                    contacts.length > 0 ? contacts.map(f => (
                        <ContactItem key={f.conversation_id} contact={f}></ContactItem>
                    )) : <EmptyContactList></EmptyContactList>
                }
            </div>
        </div>
    );
}
