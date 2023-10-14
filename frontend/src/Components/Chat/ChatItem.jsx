import { useUserID } from '../../Hooks/useUserID';
import Color from '../../Enums/Color';
import { Avatar } from '../Common/Avatar';
import { Text } from '../Common/Text';
import { timeSinceCreatedAt } from '../../Helper/GetTimeSince';
import React from 'react';
import { isEmpty } from 'lodash';
import { ActiveDot } from '../Common/ActiveDot';
import { InActiveDot } from '../Common/InActiveDot';

export const ChatItem = ({ contact, onClick }) => {
    const me = useUserID();


    return (
        <div
            className={`flex w-full p-[10px] rounded-[10px] pr-[50px] items-start gap-[10px] relative hover:bg-[${Color.Hover}] cursor-pointer`}
            onClick={onClick}>
            {
                !isEmpty(contact) &&
                <div className=' relative flex  gap-[10px]'>
                    <Avatar src={contact.recipient_avatar} user_id={contact.recipient_id} />
                    <div className='absolute bottom-0 right-0'>
                        {
                            contact.online_status == 'ONLINE' ?
                                <div className='p-[3px] qinqii-thin-shadow bg-white rounded-[50%]'>
                                    <ActiveDot />
                                </div>
                                :
                                <div className='p-[3px] qinqii-thin-shadow bg-white rounded-[50%]'>

                                    <InActiveDot />
                                </div>
                        }
                    </div>
                </div>
            }
            <div className='flex  overflow-hidden flex-col'>
                <Text>{contact.recipient_name}</Text>
                <div className='flex items-center gap-[20px] overflow-hidden'>
                    <div style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflowX:'hidden'}}>
                        <Text  fontSize={14}>{contact.last_message_sender_id == me ? 'Bạn: ' : contact.recipient_name + ': ' }{contact.last_message ?? 'đã gửi 1 tệp đính kèm'}</Text>
                    </div>
                    <div className='absolute bottom-[10px]   right-[10px]'>
                        <Text
                            fontSize={13}>{contact.last_message_sent_at ? timeSinceCreatedAt(contact.last_message_sent_at) : ''}</Text>
                    </div>

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
    );return (
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