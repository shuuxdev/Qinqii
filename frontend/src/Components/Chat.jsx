import React, { useRef } from "react";
import {
    BsFillCameraVideoFill, BsFillEmojiExpressionlessFill, BsFillPlusCircleFill,
    BsImage
} from 'react-icons/bs';
import { IoMdCall, IoMdSend } from 'react-icons/io';
import { MdCancelPresentation } from 'react-icons/md';
import { RiArrowDownSLine } from 'react-icons/ri';
import Color from '../Enums/Color';
import { Avatar, Text } from './CommonComponent.jsx';

import { useDispatch, useSelector } from "react-redux";
import { Message } from '../Components/Message.jsx';
import { closeChat, sendMessageAsync } from "../Modules/Chats.js";


export function Chat({ conversation_info: ci }) {

    const chatRef = useRef(null);
    const dispatch = useDispatch();
    const me = useSelector(state => state.profile);
    const Close = () => dispatch(closeChat(ci.conversation_id));
    const SendMessage = () => {

        const msg = {
            message_text: chatRef.current.value,
            conversation_id: ci.conversation_id,
            sender_id: me.user_id,
            recipient_id: ci.recipient_id
        }
        dispatch(sendMessageAsync(msg))

        chatRef.current.value = "";
    }

    return (
        <div className={`shadow-v1 rounded-[15px] flex flex-col lg:w-[350px] lg:h-[450px] bottom-0  right-[100px] bg-[${Color.White}] `}>
            <div className={`flex items-center justify-between p-[10px] border-b-[1px] border-solid border-[${Color.BorderGray}]`}>
                <div className="flex items-center gap-[7px] ">
                    <Avatar src={ci.recipient_avatar}></Avatar>
                    <div className="flex flex-col">
                        <Text bold>{ci.recipient_name}</Text>
                        <Text>15 phút trước</Text>
                    </div>
                    <div>
                        <RiArrowDownSLine></RiArrowDownSLine>
                    </div>
                </div>
                <div className="flex items-center gap-[7px]">
                    <div className="cursor-pointer">
                        <IoMdCall color={Color.Primary} size={20}></IoMdCall>
                    </div>
                    <div className="cursor-pointer" >
                        <BsFillCameraVideoFill color={Color.Primary} size={20}></BsFillCameraVideoFill>
                    </div>
                    <div className="cursor-pointer" onClick={Close}>
                        <MdCancelPresentation color="red" size={20}></MdCancelPresentation>
                    </div>
                </div>
            </div>
            <div className="overflow-y-scroll  flex-[12]">
                {

                    ci.messages.map(message => (
                        <Message key={message.message_id} from={message.sender_id == me.user_id ? "me" : "you"}
                            avatar_src={message.sender_id == me.user_id ? me.avatar : ci.recipient_avatar}>{message.message_text}</Message>
                    ))
                }
            </div>
            <div className={`flex p-[10px_20px] items-center  border-t-[1px] border-solid border-[${Color.BorderGray}]`}>
                <div className="flex gap-[10px] items-center">
                    <BsFillEmojiExpressionlessFill color={Color.Primary} size={20}></BsFillEmojiExpressionlessFill>
                    <BsImage size={20} color={Color.Primary}></BsImage>
                    <BsFillPlusCircleFill size={20} color={Color.Primary}></BsFillPlusCircleFill>
                </div>
                <div className={`flex bg-[${Color.Background}] p-[0px_10px] rounded-[7px] items-center  justify-center`}>

                    <input ref={chatRef} type="text" className={` p-[7px]  focus:outline-none  w-full bg-[${Color.Background}]`}
                        placeholder="Search" />
                    <div className={` bg-[${Color.Background}] `}>
                        <IoMdSend onClick={() => SendMessage()} color={Color.Primary} size={22}></IoMdSend>
                    </div>
                </div>

            </div>
        </div>
    )
}
