import React, { Suspense, useEffect, useRef, useState } from 'react';
import Color from '../../Enums/Color';
import { isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';
import { showModal } from '../../Reducers/Modals';
import { ModalType } from '../../Enums/Modal';
import { QinqiiCustomImage } from '../Common/QinqiiCustomImage';
import { Avatar } from '../Common/Avatar';
import { BsEmojiHeartEyes } from 'react-icons/bs';
import { reactToMessageAsync, updateMessage } from '../../Reducers/Contacts';
import { ENTITY } from '../../Enums/Entity';
import { TopReactions } from '../Common/TopReactions';
import { motion } from 'framer-motion';
import connection from '../../Helper/SignalR';

const LazyEmojiPicker = React.lazy(() => import('@emoji-mart/react'));

export function Message({
                            setCurrentSelectedMessageId,
                            currentSelectedMessageId, from, sender_avatar, recipient_avatar, message, messages, index,
                        }) {
    const dispatch = useDispatch();
    const ReactToMessage = (emoji) => {
        dispatch(reactToMessageAsync({ ...message }, {
            entity_id: message.id,
            entity_type: ENTITY.MESSAGE,
            emoji: emoji.native,
        }));
    };
    const renderAttachment = () => {
        //all messages attachments of this conversation
        let attachments = [];

        messages.forEach(msg => {
            attachments = [...attachments, ...msg.attachments];
        });
        const OpenInMediaViewer = (index) => {
            dispatch(showModal({
                modalType: ModalType.MEDIA,
                modalProps: { attachments: attachments, selected: index },
            }));
        };
        //current message attachments
        return message.attachments.map((attachment, index) => (
            <div key={attachment.id} onClick={() => OpenInMediaViewer(index)} className='message-attachment'>
                {
                    attachment.type === 'IMAGE' ?
                        <QinqiiCustomImage src={attachment.link} alt='' className='w-full h-full object-cover' />
                        : <QinqiiCustomImage src={attachment.thumbnail} alt='' className='w-full h-full object-cover' />
                }
            </div>
        ));
    };


    return (
        <div className='relative'>

            {
                (from == 'me') ? (
                        <div className='my-[10px] flex justify-end gap-[10px] min-h-[50px] w-full'>
                            <div className='flex flex-col gap-[10px] items-end  justify-end w-full'>
                                {
                                    !isEmpty(message.message_text) &&
                                    <div style={{ wordBreak: 'break-word' }}
                                         className={`rounded-[15px] relative text-[13px] p-[10px] bg-[${Color.Primary}] text-[${Color.White}] `}>
                                        {message.message_text}


                                            <EmojiReactToMessage zIndex={index} message={message}
                                                                 currentSelectedMessageId={currentSelectedMessageId}
                                                                 setCurrentSelectedMessageId={setCurrentSelectedMessageId}
                                                                 ReactToMessage={ReactToMessage}
                                                                 from="me"
                                            ></EmojiReactToMessage>
                                        <div className='absolute right-0 bottom-0 translate-y-[50%]'>
                                            <TopReactions entity_type={ENTITY.MESSAGE} action={updateMessage}
                                                          entity={message} reactions={message.reactions} />
                                        </div>
                                    </div>
                                }
                                <div className='flex justify-end gap-[5px]'>
                                    {
                                        renderAttachment()
                                    }
                                </div>
                            </div>
                            <div className='shrink-0 h-fit'>
                                <Avatar src={sender_avatar} circle user_id={message.sender_id} sz={39.5}></Avatar>
                            </div>
                        </div>
                    )
                    :
                    (
                        <div className='my-[10px]  flex-col items-center gap-[10px] min-h-[50px] w-full'>
                            <div className='flex  gap-[10px] items-start  justify-start w-full '>
                                <div className='shrink-0 h-fit'>
                                    <Avatar src={recipient_avatar} user_id={message.sender_id} circle
                                            sz={39.5}></Avatar>
                                </div>
                                {
                                    message.deleted ?
                                        <div style={{ wordBreak: 'break-word' }}
                                             className='flex  flex-col gap-[10px] items-start   w-full'>
                                            Tin nhắn đã được thu hồi
                                        </div> :
                                        <div className='flex  flex-col gap-[10px] items-start   w-full'>
                                            <div style={{ wordBreak: 'break-word' }}
                                                 className={`relative rounded-[15px] text-[13px] p-[10px] bg-[${Color.BorderGray}]  text-black `}>
                                                {message.message_text}
                                                <EmojiReactToMessage zIndex={index} message={message}
                                                                     currentSelectedMessageId={currentSelectedMessageId}
                                                                     setCurrentSelectedMessageId={setCurrentSelectedMessageId}
                                                                     ReactToMessage={ReactToMessage}
                                                                     from="other"
                                                ></EmojiReactToMessage>
                                                <div className='absolute left-0 bottom-0 translate-y-[50%]'>
                                                    <TopReactions entity_type={ENTITY.MESSAGE} action={updateMessage}
                                                                  entity={message} reactions={message.reactions} />
                                                </div>
                                            </div>
                                            <div className='flex justify-start'>
                                                {
                                                    renderAttachment()
                                                }
                                            </div>

                                        </div>

                                }

                            </div>
                        </div>
                    )
            }


        </div>

    );
}

const EmojiReactToMessage = ({
                                 message,
                                 currentSelectedMessageId,
                                 ReactToMessage,
                                 setCurrentSelectedMessageId,
                                 zIndex,
                                    from
                             }) => {
    const emojiRef = useRef(null);
    const handleClickOnEmojiOption = (e) => {
        if(message.id === currentSelectedMessageId) setCurrentSelectedMessageId(null);
        else setCurrentSelectedMessageId(message.id);
    }
    let style = from === 'me' ? ({zIndex: zIndex, left: 0, transform: 'translate(-130%, -50%)', top: '50%'}) : ({zIndex: zIndex, right: 0, transform: 'translate(130%, -50%)', top: '50%'});
    console.log('re-render');
    useEffect(() => {
        // if(!emojiRef.current) return;


        if(message.id !== currentSelectedMessageId) return;
        let client = emojiRef.current.getBoundingClientRect();
        let emojiPicker = document.querySelector('.emoji-picker-for-message-reaction');
        console.log(client);
        emojiPicker.style.left = `${client.left }px`;
        emojiPicker.style.top = `${client.top}px`;
        emojiPicker.style.transform = `translate(-100%, -100%)`;
        emojiPicker.style.height = '435px'; //hard code because fixed position doesnt adjust height base on content

    });
    return (
        <>
            {/*<AnimatePresence>*/}
                {
                    message.id === currentSelectedMessageId &&
                    <div  className='emoji-picker-for-message-reaction fixed z-[250]  bottom-0 left-[-100%] '>
                        <motion.div initial={{ y: '50px', opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}>
                            <Suspense fallback={<div>Loading...</div>}>
                                <LazyEmojiPicker
                                    set='facebook'
                                    onEmojiSelect={ReactToMessage}
                                ></LazyEmojiPicker>
                            </Suspense>
                        </motion.div>
                    </div>

                }
            {/*</AnimatePresence>*/}
            <div style={style} ref={emojiRef}
                 className='absolute flex items-center justify-center'>
                <div onClick={handleClickOnEmojiOption} className='cursor-pointer'>
                    <BsEmojiHeartEyes color='gray' size={16}></BsEmojiHeartEyes>
                </div>
            </div>
        </>
    );
};