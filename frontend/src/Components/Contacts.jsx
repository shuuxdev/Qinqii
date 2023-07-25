import React from "react";
import { ImProfile } from 'react-icons/im';
import { RiMessage2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Color from '../Enums/Color';
import { closeChat, fetchMessageAsync, openChat } from "../Modules/Chats.js";
import { Avatar, Header, Text } from './CommonComponent.jsx';
import Loading from "./Loading.jsx";


const test = {
    "conversation_id": 1,
    "conversation_default_emoji": "smile",
    "sender_id": 2,
    "recipient_id": 2,
    "recipient_name": "Thanh Thủy",
    "recipient_avatar": "thuy.jpg"
}
const ContactItem = ({ contact: { conversation_id, converstaion_default_emoji, sender_id,
    recipient_id, recipient_name, recipient_avatar }, contact }) => {

    const dispatch = useDispatch();

    const OpenChat = () => {
        dispatch(fetchMessageAsync(conversation_id)).then((data) => dispatch(openChat({ ...contact, messages: data })))
            .catch(err => alert(err))
    }
    const Close = () => dispatch(closeChat());

    return (
        <div className="flex w-full p-[15px_20px] items-center" >
            <div className="flex-[2.5]">
                <Avatar src={recipient_avatar} />
            </div>
            <div className="flex-[7.5]">

                <Text> <Text bold>{recipient_name}</Text> </Text>
            </div>
            <div className="flex-[2] flex justify-center items-center gap-2">
                <div onClick={() => OpenChat()}>
                    <RiMessage2Fill color={Color.Primary} size={24} />
                </div>
                <div>
                    <Link className="flex grow-[1]" to={`/user/${recipient_id}`}>
                        <ImProfile color={Color.Title} size={20} />
                    </Link>
                </div>
            </div>
        </div>)
}
const EmptyContactList = () => {
    return (
        <div className="h-[600px] flex flex-col gap-[50px] items-center justify-center">
            <Loading></Loading>
            <p className="text-[14px] font-light">
                Đang tải danh sách liên hệ
            </p>
        </div>
    )
}
export function ContactList() {

    const contacts = useSelector(state => state.contacts)
    return (
        <div className={`flex flex-col`}>
            <Header title="CONTACTS" count={5}></Header>
            <div className={`flex  flex-col bg-[${Color.White}]`}>
                {
                    contacts.length > 0 ? contacts.map(f => (
                        <ContactItem key={f.conversation_id} contact={f}></ContactItem>
                    )) : <EmptyContactList></EmptyContactList>
                }
            </div>
        </div>
    )
}
