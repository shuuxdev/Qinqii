import { Modal } from 'antd'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { BsCameraVideoFill, BsCameraVideoOffFill, BsFillMicFill, BsFillMicMuteFill } from 'react-icons/bs';
import connection from '../Helper/SignalR.js';
import { useDispatch, useSelector } from 'react-redux';
import { MdCallEnd } from 'react-icons/md';
import { IoMdCall } from 'react-icons/io';
import { displayIncomingCallModal, displayOutGoingCallModal, hideCallModal } from '../Modules/Call.js';
import { CurrentChatContext } from './Chat.jsx';

export default function CallModal({ mode }) {
    const dispatch = useDispatch();
    const DenyCall = () => { dispatch(hideCallModal()) }

    return (
        <Modal open={true} footer={null} width='fit-content' onCancel={DenyCall}>
            {mode === 'OUTGOING' ? <OutGoingModal /> : <InComingModal />}
        </Modal>

    )
}
const InComingModal = () => {
    const { conversation } = useContext(CurrentChatContext);
    const dispatch = useDispatch();
    useEffect(() => {
        console.log(conversation);

    }, [])

    const DenyCall = () => { dispatch(hideCallModal()) }
    const AcceptCall = () => { }
    return (
        <div className="flex justify-center items-center">
            <div className="py-[30px] px-[60px] flex w-fit">
                <div onClick={DenyCall} className='cursor-pointer w-fit p-[10px] text-white rounded-full bg-green-500'>
                    <MdCallEnd size={32} />

                </div>
                <div onClick={AcceptCall} className='cursor-pointer w-fit p-[10px] text-white rounded-full bg-red-500'>

                    <IoMdCall size={32} />
                </div>
            </div>
        </div>
    )
}
const OutGoingModal = () => {
    const localRef = useRef();
    const remoteRef = useRef();
    const { conversation } = useContext(CurrentChatContext);


    const InitLocalMedia = () => {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            console.log(stream);
            localRef.current.srcObject = stream;
        }
        )

    }

    useEffect(() => {
        InitLocalMedia();

    }, [])
    return (
        <div className='w-[800px]'>
            <div className="flex gap-[10px] ">
                <div className='flex-1'>
                    <video ref={localRef} autoPlay></video>

                </div>
                {/* <div className='flex-1'>
                    <video ref={remoteRef} autoPlay></video>
                </div> */}
            </div>
            <div className='flex justify-center items-center w-full pt-[40px]'>
                <div className='flex gap-[10px] '>
                    <Camera />
                    <Microphone />
                </div>
            </div>
        </div>
    )
}

const Microphone = () => {
    const [mute, setMute] = useState(false);

    return (
        <div onClick={() => setMute(!mute)} className='cursur-pointer text-red-600' >
            {
                mute ?
                    <BsFillMicMuteFill size={32} />
                    :
                    <BsFillMicFill size={32} />
            }
        </div>

    )
}
const Camera = () => {
    const [mute, setMute] = useState(false);

    return (
        <div onClick={() => setMute(!mute)} className='cursur-pointer text-red-600' >
            {
                mute ?
                    <BsCameraVideoOffFill size={32} /> :
                    <BsCameraVideoFill size={32} />


            }
        </div>

    )
}