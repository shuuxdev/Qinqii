import React, { createContext, Suspense, useContext, useEffect, useRef, useState } from 'react';
import { BsFillCameraVideoFill, BsFillEmojiExpressionlessFill, BsImage } from 'react-icons/bs';
import { IoMdSend } from 'react-icons/io';
import { MdCancelPresentation } from 'react-icons/md';
import Color from '../../Enums/Color';

import { useDispatch, useSelector } from 'react-redux';
import { Message } from './Message.jsx';
import { closeChat, sendMessageAsync } from '../../Reducers/Chats.js';
import { OnlineStatus } from '../../Enums/OnlineStatus.js';
import { CallContext } from '../../Layouts/DefaultLayout';
import { CallState } from '../../Enums/CallState';
import { AnimatePresence, motion } from 'framer-motion';
import Loading from '../Common/Loading';
import '../../SCSS/Chat.scss';
import { QinqiiEmojiPicker } from '../Common/QinqiiEmojiPicker';
import { getVideoFirstFrame } from '../../Helper/GetVideoFirstFrame';
import { InActiveDot } from '../Common/InActiveDot';
import { ActiveDot } from '../Common/ActiveDot';
import { Text } from '../Common/Text';
import { Avatar } from '../Common/Avatar';
import { UploadImage } from '../Common/UploadImage';
import { useMediaQuery } from 'react-responsive';
import { ScreenWidth } from '../../Enums/ScreenWidth';
import { twMerge } from 'tailwind-merge';
import { markAsReadAsync, reactToMessageAsync, updateMessage } from '../../Reducers/Contacts';
import { ENTITY } from '../../Enums/Entity';
import connection from '../../Helper/SignalR';




export const ChatContext = createContext();

export function Chat({ contact: ci }) {
    const [showEmojiForInput, setShowEmojiForInput] = React.useState(false);
    const defaultContextValue = { conversation: ci };
    const chatRef = useRef(null);
    const chatContainerRef = useRef(null);
    const dispatch = useDispatch();
    const me = useSelector(state => state.user)
    const [attachments, setAttachments] = React.useState([]);
    const [uploadedFiles, setUploadedFiles] = React.useState([]);
    const uploadRef = useRef(null);
    const [isRead, setIsRead] = useState(true);
    const [currentSelectedMessageId, setCurrentSelectedMessageId] = useState(null);
    const { MakeCall, setCallDetailImmediately } = useContext(CallContext);

    const HandleUpload = (e) => {
        const files = uploadRef.current.files;
        setUploadedFiles([...files]);
    };
    const RemoveFileFromUploadFiles = (file_id) => {
        let files = Array.from([...uploadedFiles]);
        setUploadedFiles(
            files.filter(
                (file) => files.indexOf(file) != file_id
            ),
        );
    };
    const Close = () => dispatch(closeChat(ci.conversation_id));

    const SendMessage = async () => {

        const msg = {
            message_text: chatRef.current.value,
            conversation_id: ci.conversation_id,
            sender_id: me.user_id,
            recipient_id: ci.recipient_id,
        };
        const images =  uploadedFiles.filter(file => file.type.includes('image'))
        const videos = uploadedFiles.filter(file => file.type.includes('video'))
        const thumbnails = await Promise.all(videos.map(video => getVideoFirstFrame(video, "blob")))
        if(msg || images || videos)
            dispatch(sendMessageAsync(msg, images, videos, thumbnails));
        chatRef.current.value = '';
        setUploadedFiles([]);
        setAttachments([]);
    };

    const OpenUpload = () => {
        uploadRef.current.click();
    };
    const ToggleEmoji = () => {
        setShowEmojiForInput(!showEmojiForInput);
    };


    useEffect(() => {
        const renderAttachments = async () => {
            const filesToRender = await Promise.all(Array.from(uploadedFiles).map(async (file, i) => {

                if (file.type.includes("video")) {
                    let url = await getVideoFirstFrame(file);
                    return (
                        <div className='h-[70px] w-[70px] shrink-0'>
                            <UploadImage
                                cb={() => RemoveFileFromUploadFiles(i)}
                                src={url}
                            />
                        </div>

                    )
                }
                return (
                    <div className='h-[70px] w-[70px] shrink-0'>
                        <UploadImage
                            cb={() => RemoveFileFromUploadFiles(i)}
                            src={URL.createObjectURL(file)}
                        />
                    </div>
                )
            }))
            setAttachments(filesToRender);
        }
        renderAttachments();
    }, [uploadedFiles])


    useEffect(() => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        chatContainerRef.current.scrollIntoView({ behavior: 'smooth' });
        if(ci.unread_messages > 0)
            setIsRead(false);
    }, [ci.messages.length]);

    const markAsRead = () => {
        if(isRead === false) {
            setIsRead(true);
            dispatch(markAsReadAsync(ci.conversation_id));
        }
        if(currentSelectedMessageId)
        setCurrentSelectedMessageId(null);
    }


    useEffect(() => {
        connection.on('ReceiveReaction', (reaction) => {
            //workaround, too lazy to fix
            let message = {...ci.messages.find(m => m.id === reaction.message_id)};
            console.log(message);
            if(!message) return;
            let reactionExisted = message.reactions.find(r => r.id === reaction.id);
            if(reactionExisted) return;
            message.reactions = [...message.reactions, reaction];
            dispatch(updateMessage(message));
        });
        connection.on('ReceiveUndoReaction', (reaction) => {
            //workaround, too lazy to fix
            let message = {...ci.messages.find(m => m.id === reaction.message_id)};
            if(!message) return;
            message.reactions = [...message.reactions.filter(r => r.id !== reaction.id)];
            dispatch(updateMessage(message));
        })
        return () => {
            connection.off('ReceiveReaction');
            connection.off('ReceiveUndoReaction');
        }
    })
    const isPhoneScreen = useMediaQuery({ query: `(max-width: ${ScreenWidth.sm}px)` });
    let className = twMerge(` shadow-v1 rounded-[15px] relative flex flex-col  bottom-0   bg-[${Color.White}]`, isPhoneScreen ?  'w-full h-full' : 'w-[350px] h-[450px]');
    let chatHeaderClassname = twMerge(`flex items-center justify-between p-[10px] border-b-[1px] border-solid border-[${Color.BorderGray}]`, isRead ? 'bg-white' : 'bg-blue-500');
    return (
        <ChatContext.Provider value={defaultContextValue}>
            <input ref={uploadRef} type='file' accept='image/*,video/*' multiple={true} className='hidden' />
            <div onClick={markAsRead} className={className}>
                <div  className={chatHeaderClassname}>
                    <div className='flex items-center gap-[7px] '>
                        <Avatar src={ci.recipient_avatar} user_id={ci.recipient_id}></Avatar>
                        <div className='flex flex-col'>
                            <Text color={isRead ? 'black' : 'white'} bold>{ci.recipient_name}</Text>
                            <div style={{color: isRead ? 'black' : 'white'}}>
                                <OnlineStatusIndicator status={ci.online_status} />
                            </div>
                        </div>

                    </div>
                    <div className='flex items-center gap-[7px]'>

                        <div className='cursor-pointer' onClick={
                            () => {
                                setCallDetailImmediately({
                                    callState: CallState.WAITING_FOR_ANSWER,
                                    callParam: {
                                        caller_id: me.user_id,
                                        callee_id: ci.recipient_id,
                                        avatar: me.avatar,
                                        name: me.name,
                                    },
                                });
                                MakeCall();
                            }}>
                            <BsFillCameraVideoFill color={Color.Primary} size={20}></BsFillCameraVideoFill>
                        </div>
                        <div className='cursor-pointer' onClick={Close}>
                            <MdCancelPresentation color='red' size={20}></MdCancelPresentation>
                        </div>
                    </div>
                </div>
                <div ref={chatContainerRef} className='overflow-y-auto p-[10px] grow'>
                    {

                        ci.messages.slice(0).reverse().map(message => (
                            <Message key={message.id} from={message.sender_id == me.user_id ? 'me' : 'you'}
                                     sender_avatar={message.sender_id == me.user_id ? me.avatar : ci.recipient_avatar}
                                     recipient_avatar={message.sender_id == me.user_id ? me.avatar : ci.recipient_avatar}
                                     messages = {ci.messages}
                                     message={message}
                                currentSelectedMessageId = {currentSelectedMessageId}
                                setCurrentSelectedMessageId = {setCurrentSelectedMessageId}
                            />
                        ))
                    }
                </div>
                <div className={`flex  p-[10px] items-end  border-t-[1px] border-solid border-[${Color.BorderGray}]`}>
                    <div className='flex  items-center'>
                        <div onClick={ToggleEmoji} className='mx-[5px] mb-[10px] cursor-pointer'>
                            <BsFillEmojiExpressionlessFill color={Color.Primary}
                                                           size={20}></BsFillEmojiExpressionlessFill>
                        </div>
                        <div className='relative'>
                            <AnimatePresence>
                                {
                                    showEmojiForInput &&
                                    <div className='absolute z-[200] left-[100%] bottom-0'>
                                        <motion.div initial={{ y: '50px', opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}>
                                            <Suspense fallback={<div
                                                className='flex justify-center items-center w-full h-full'><Loading />
                                            </div>}>
                                                <QinqiiEmojiPicker ref={chatRef}/>
                                            </Suspense>

                                        </motion.div>
                                    </div>

                                }
                            </AnimatePresence>
                        </div>

                        <div className='cursor-pointer mx-[5px] mb-[10px] '>
                            <BsImage onClick={OpenUpload} size={20} color={Color.Primary}></BsImage>
                        </div>

                    </div>
                        <div className={`bg-[${Color.Background}] flex flex-col overflow-x-auto grow rounded-[7px] items-start  `}>
                            <div className='flex overflow-x-auto max-w-full'>
                                <input onChange={HandleUpload} onClick={OpenUpload} ref={uploadRef} type='file' accept='image/*,video/*' multiple={true} className='hidden' />
                                {attachments}
                            </div>
                            <div className='relative w-full'>
                                <input ref={chatRef} type='text'
                                       className={` p-[7px]  focus:outline-none  w-full bg-[${Color.Background}]`}
                                       placeholder='Search' />
                                <div className={`cursor-pointer bg-[${Color.Background}] absolute top-[50%] translate-y-[-50%] right-[10px] `}>
                                    <IoMdSend onClick={SendMessage} color={Color.Primary} size={22}></IoMdSend>
                                </div>
                            </div>
                        </div>
                </div>

            </div>
        </ChatContext.Provider>

    );
}

const OnlineStatusIndicator = ({ status }) => {
    return (
        <>
            {
                status === OnlineStatus.ONLINE ?
                    <div className='flex items-center gap-[5px]'>

                        <ActiveDot />
                        <Text fontSize={14}>Đang hoạt động</Text>
                    </div> :
                    <div className='flex items-center gap-[5px]'>
                        <div style={{fontSize: 14}}>Hiện không hoạt động</div>
                        <InActiveDot />
                    </div>
            }
        </>
    );
};

