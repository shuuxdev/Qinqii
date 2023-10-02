import { Button, Modal } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { BsCameraVideoFill, BsCameraVideoOffFill, BsFillMicFill, BsFillMicMuteFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { CallContext } from '../../Layouts/DefaultLayout';
import {CallModal as CModal} from '../../Enums/CallModal';
import { ImPhoneHangUp} from 'react-icons/im';
import { CallState } from '../../Enums/CallState';

const CallModal = () => {
    const dispatch = useDispatch();
    const { call, param } = useSelector(state => state.call);
    return (
        <div className="flex">
            {
                call != null && call === CModal.ONGOING && <VideoCallModal param={param} />
            }
            {
                call != null && call === CModal.INCOMING  && <IncomingCallModal param={param} />
            }

        </div>
    )
}
const IncomingCallModal = ({ param }) => {
    const { AcceptCall, DeclineCall, setCallDetailImmediately } = useContext(CallContext);
    return (
        <Modal open={true} footer={null} onCancel={DeclineCall} >
            <div className="flex items-center flex-col">
                <div className="rounded-full w-[40px] h-[40px] overflow-hidden">
                    <img src={param.avatar} alt="" className="object-cover" />
                </div>
                <p className=" text-lg font-semibold">{param.name} is calling you</p>
                <div className="flex">
                    <Button onClick={() => {
                        AcceptCall();
                    }} className="mr-2" type="default">Accept</Button>
                    <Button onClick={DeclineCall} className="ml-2" type="primary" danger>Decline</Button>
                </div>
            </div>
        </Modal>
    )
}

const VideoCallModal = ({ param }) => {
    const { videoRef, remoteRef, EndCall, callState } = useContext(CallContext);
    return (
        <Modal open={true} footer={null} width={'100%'} className="max-w-[900px] call-modal"  onCancel={EndCall}>
            <div className="relative h-[600px]">
                <div className="absolute client top-[10px] left-[10px] z-[310]">
                    <div className=" aspect-video rounded-[10px] overflow-hidden">
                        <video ref={videoRef} autoPlay className="object-cover w-full h-full"></video>
                    </div>
                </div>
                <div className="absolute remote inset-0 z-[300]">
                    <div className=" video-overlay rounded-[10px] overflow-hidden">
                        {
                            callState === CallState.WAITING_FOR_ANSWER ? <div className="flex  items-center justify-center w-full h-full">
                                <p className="text-white text-2xl">Waiting for answer</p>
                            </div> : <video ref={remoteRef} autoPlay className="object-cover w-full h-full"></video>
                        }

                    </div>
                    <div className="absolute w-full bottom-[30px] z-[310]">
                        <div className="flex w-full test items-center justify-center">
                            <Microphone />
                            <Camera />
                            <EndCallButton />
                        </div>
                    </div>
                </div>

            </div>
        </Modal>
    )
}

const EndCallButton = () => {
    const { EndCall } = useContext(CallContext);
    return (
        <ImPhoneHangUp onClick={EndCall} size={32} className="cursor-pointer text-red-600" />
    )
}
const Microphone = () => {
    const [mute, setMute] = useState(false);
    const {ToggleAudio} = useContext(CallContext);
    const Toggle = () => {
        setMute(!mute)
        ToggleAudio();
    }
    return (
        <div onClick={Toggle} className='cursur-pointer text-red-600' >
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
    const {ToggleCamera} = useContext(CallContext);
    const Toggle = () => {
        setMute(!mute)
        ToggleCamera();
    }
    return (
        <div onClick={Toggle} className='cursor-pointer text-red-600' >
            {
                mute ?
                    <BsCameraVideoOffFill size={32} /> :
                    <BsCameraVideoFill size={32} />
            }
        </div>

    )
}
export default CallModal;