import React, { createContext, forwardRef, Suspense, useContext, useEffect, useRef } from 'react';
import { BsFillCameraVideoFill, BsFillEmojiExpressionlessFill, BsImage } from 'react-icons/bs';
import { IoMdCall, IoMdSend } from 'react-icons/io';
import { MdCancelPresentation } from 'react-icons/md';
import { RiArrowDownSLine } from 'react-icons/ri';
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
import { useUserID } from '../../Hooks/useUserID';
import { useMediaQuery } from 'react-responsive';
import { ScreenWidth } from '../../Enums/ScreenWidth';
import { twMerge } from 'tailwind-merge';
import { MessagePageContext } from '../../Pages/MessagePage';


export const ChatContext = createContext();

export function ChatV2({ contact: ci }) {
    const [showEmoji, setShowEmoji] = React.useState(false);
    const defaultContextValue = { conversation: ci };
    const chatRef = useRef(null);
    const dispatch = useDispatch();
    const me = useSelector(state => state.user);
    const [attachments, setAttachments] = React.useState([]);
    const [uploadedFiles, setUploadedFiles] = React.useState([]);
    const uploadRef = useRef(null);


    const {BackButton} = useContext(MessagePageContext);

    const HandleUpload = (e) => {
        const files = uploadRef.current.files;
        setUploadedFiles([...files]);
    };
    const RemoveFileFromUploadFiles = (file_id) => {
        let files = Array.from([...uploadedFiles]);
        setUploadedFiles(
            files.filter(
                (file) => files.indexOf(file) != file_id,
            ),
        );
    };
    const Close = () => dispatch(closeChat(ci.conversation_id));

    const { MakeCall, setCallDetailImmediately } = useContext(CallContext);
    const SendMessage = async () => {

        const msg = {
            message_text: chatRef.current.value,
            conversation_id: ci.conversation_id,
            sender_id: me.user_id,
            recipient_id: ci.recipient_id,
        };
        const images = uploadedFiles.filter(file => file.type.includes('image'));
        const videos = uploadedFiles.filter(file => file.type.includes('video'));
        const thumbnails = await Promise.all(videos.map(video => getVideoFirstFrame(video, 'blob')));
        dispatch(sendMessageAsync(msg, images, videos, thumbnails));

        chatRef.current.value = '';
        setUploadedFiles([]);
        setAttachments([]);
    };

    const OpenUpload = () => {
        uploadRef.current.click();
    };
    const ToggleEmoji = () => {
        setShowEmoji(!showEmoji);
    };
    const ReactToMessage = (emoji) => {
        ToggleEmoji(); // turn off all picker in the comment section

        /*dispatch(
            reactToCommentThunk({ ...comment }, {
                entity_id: comment.id,
                entity_type: ENTITY.COMMENT,
                emoji: emoji.native,
            },updateComment)
        );*/
    };

    useEffect(() => {
        const renderAttachments = async () => {
            const filesToRender = await Promise.all(Array.from(uploadedFiles).map(async (file, i) => {

                if (file.type.includes('video')) {
                    let url = await getVideoFirstFrame(file);
                    return (
                        <div className='h-[70px] w-[70px] shrink-0'>
                            <UploadImage
                                cb={() => RemoveFileFromUploadFiles(i)}
                                src={url}
                            />
                        </div>

                    );
                }
                return (
                    <div className='h-[70px] w-[70px] shrink-0'>
                        <UploadImage
                            cb={() => RemoveFileFromUploadFiles(i)}
                            src={URL.createObjectURL(file)}
                        />
                    </div>
                );
            }));
            setAttachments(filesToRender);
        };
        renderAttachments();
    }, [uploadedFiles]);

    const isPhoneScreen = useMediaQuery({ query: `(max-width: ${ScreenWidth.sm}px)` });
    let className = twMerge(`shadow-v1 rounded-[15px] relative flex flex-col  bottom-0   bg-[${Color.White}] w-full h-screen`);

    return (
        <ChatContext.Provider value={defaultContextValue}>
            <input ref={uploadRef} type='file' accept='image/*,video/*' multiple={true} className='hidden' />
            <div className={className}>
                <div
                    className={`flex items-center justify-between p-[10px] border-b-[1px] border-solid border-[${Color.BorderGray}] `}>
                    <div className='flex items-center gap-[7px] '>
                        <BackButton/>
                        <Avatar src={ci.recipient_avatar} user_id={ci.recipient_id}></Avatar>
                        <div className='flex flex-col'>
                            <Text bold>{ci.recipient_name}</Text>
                            <OnlineStatusIndicator status={ci.online_status} />

                        </div>
                        <div>
                            <RiArrowDownSLine></RiArrowDownSLine>
                        </div>
                    </div>
                    <div className='flex items-center gap-[7px]'>
                        <div className='cursor-pointer'>
                            <IoMdCall color={Color.Primary} size={20}></IoMdCall>
                        </div>
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

                    </div>
                </div>
                <div className='overflow-y-scroll p-[10px] grow'>
                    {

                        ci.messages.slice(0).reverse().map((message,index) => (
                            <Message key={message.id} from={message.sender_id == me.user_id ? 'me' : 'you'}
                                     sender_avatar={message.sender_id == me.user_id ? me.avatar : ci.recipient_avatar}
                                     recipient_avatar={message.sender_id == me.user_id ? me.avatar : ci.recipient_avatar}
                                     messages={ci.messages}
                                     index={ci.message.length - index}
                                     message={message} />
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
                                    showEmoji &&
                                    <div className='absolute z-[200] left-[100%] bottom-0'>
                                        <motion.div initial={{ y: '50px', opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}>
                                            <Suspense fallback={<div
                                                className='flex justify-center items-center w-full h-full'><Loading />
                                            </div>}>
                                                <QinqiiEmojiPicker ref={chatRef} />
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
                    <div
                        className={`bg-[${Color.Background}] flex flex-col overflow-x-auto grow rounded-[7px] items-start  `}>
                        <div className='flex overflow-x-auto max-w-full'>
                            <input onChange={HandleUpload} onClick={OpenUpload} ref={uploadRef} type='file'
                                   accept='image/*,video/*' multiple={true} className='hidden' />
                            {attachments}
                        </div>
                        <div className='relative w-full'>
                            <input ref={chatRef} type='text'
                                   className={` p-[7px]  focus:outline-none  w-full bg-[${Color.Background}]`}
                                   placeholder='Search' />
                            <div
                                className={` bg-[${Color.Background}] absolute top-[50%] translate-y-[-50%] right-[10px] `}>
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
                        <Text fontSize={14}>Hiện không hoạt động</Text>
                        <InActiveDot />
                    </div>
            }
        </>
    );
};

