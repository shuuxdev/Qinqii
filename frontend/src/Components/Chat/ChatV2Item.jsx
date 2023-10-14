import { useUserID } from '../../Hooks/useUserID';
import React from 'react';
import Color from '../../Enums/Color';
import { isEmpty } from 'lodash';
import { Avatar } from '../Common/Avatar';
import { ActiveDot } from '../Common/ActiveDot';
import { InActiveDot } from '../Common/InActiveDot';
import { Text } from '../Common/Text';
import { timeSinceCreatedAt } from '../../Helper/GetTimeSince';
import { MessagePageContext } from '../../Pages/MessagePage';

export const ChatV2Item = ({ contact, index }) => {
    const me = useUserID();
    const { handleItemClick } = React.useContext(MessagePageContext);
    return (
        <div
            className={`flex w-full p-[10px] rounded-[10px] pr-[50px] items-start gap-[10px] relative hover:bg-[${Color.Hover}] cursor-pointer`}
            onClick={() => handleItemClick(index)}>
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
    );
};
