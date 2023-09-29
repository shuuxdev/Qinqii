import React from "react";
import Color from '../../Enums/Color';
import { isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';
import { showModal } from '../../Reducers/Modals';
import { ModalType } from '../../Enums/Modal';
import { QinqiiCustomVideo } from '../Common/QinqiiCustomVideo';
import { QinqiiCustomImage } from '../Common/QinqiiCustomImage';
import { Avatar } from '../Common/Avatar';


export function Message({ from, sender_avatar, recipient_avatar, message, messages }) {
    const dispatch = useDispatch();
    const renderAttachment = () => {
        //all messages attachments of this conversation
        let attachments = [];

        messages.forEach(msg => {
            attachments = [...attachments, ...msg.attachments]
        })
        const OpenInMediaViewer = (index) => {
            dispatch(showModal({modalType: ModalType.MEDIA, modalProps: {attachments: attachments, selected: index}}))
        }
        //current message attachments
        return  message.attachments.map((attachment,index) => (
            <div key={attachment.id} onClick={() => OpenInMediaViewer(index)} className='message-attachment'>
                {
                    attachment.type === 'IMAGE' ?
                        <QinqiiCustomImage src={attachment.link} alt="" className='w-full h-full object-cover' />
                        : <QinqiiCustomImage src={attachment.thumbnail} alt="" className='w-full h-full object-cover' />
                }
            </div>
        ))
    }

    const MessageBody = ({color}) => (
        <div style={{wordBreak: 'break-word'}} className={`rounded-[15px] text-[13px] p-[10px] bg-[${color}] text-[${Color.White}] `}>
            {message.message_text}
        </div>
    )

    return (
        (from == "me") ? (
            <div className="my-[10px] flex justify-end gap-[10px] min-h-[50px] w-full">
                <div className="flex flex-col gap-[10px] items-end  justify-end w-full">
                    {
                        !isEmpty(message.message_text) &&
                        <MessageBody color={Color.Primary}/>
                    }
                    <div className='flex justify-end gap-[5px]'>
                        {
                            renderAttachment()
                        }
                    </div>
                </div>
                <div className="shrink-0 h-fit">
                    <Avatar src={sender_avatar} circle user_id={message.sender_id} sz={39.5}></Avatar>
                </div>
            </div>
        )
            :
            (
                <div className="my-[10px] flex-col items-center gap-[10px] min-h-[50px] w-full">
                    <div className="flex gap-[10px] items-start  justify-start w-full ">
                        <div className="shrink-0 h-fit">
                            <Avatar src={recipient_avatar} user_id={message.sender_id} circle sz={39.5}></Avatar>
                        </div>
                        <div className="flex flex-col gap-[10px] items-start   w-full">
                            <div style={{wordBreak: 'break-word'}} className={`rounded-[15px] text-[13px] p-[10px] bg-[${Color.BorderGray}]  text-black `}>
                                {message.message_text}
                            </div>
                            <div className='flex justify-start'>
                                {
                                    renderAttachment()
                                }
                            </div>
                        </div>

                    </div>

                </div>
            )
    )
}