import { motion, useAnimation } from 'framer-motion';
import { useEffect, useLayoutEffect, useState } from 'react';
import '../../../SCSS/FriendButton.scss'
import { MdVerified } from 'react-icons/md';
import { Text } from '../Text';
import {Color} from '../../../Enums/Color';
import { FaUserCheck } from 'react-icons/fa';
import { REJECT, sendFriendRequestThunk, updateFriendStatusAsync } from '../../../Reducers/FriendRequests';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useAxios } from '../../../Hooks/useAxios';
export const ButtonState = {
    Default: 'Default',
    Loading: 'Loading',
    RequestSent: 'RequestSent',
    CancelRequest: 'CancelRequest',
    Unfriend: 'Unfriend',
    IsFriend: 'IsFriend'
}

export const FriendButton = ({initState, user_id }) => {
    const loadingControl = useAnimation();
    const loadingBarControl = useAnimation();
    const requestSentControl = useAnimation();
    const cancelRequestControl = useAnimation();
    const unfriendControl = useAnimation();
    const defaultControl = useAnimation();
    const isFriendControl = useAnimation();

    const [buttonState, setButtonState] = useState(initState);
    const dispatch = useDispatch();


    const axios = useAxios();
    const SendFriendRequest = async () => {
        const [statusCode, error]  =await axios.POST_SendFriendRequest({ friend_id: user_id});
            if(statusCode === 200)
            {
                setButtonState(ButtonState.RequestSent);
            }

    }
    const CancelFriendRequest = async () => {
        const [statusCode, error] = await axios.DELETE_CancelFriendRequest({ friend_id: user_id});
        if(statusCode === 200)
        {
            setButtonState(ButtonState.Default);
        }
    }
    const Unfriend = async () => {
        const [statusCode, error] = await axios.DELETE_Unfriend({ friend_id: user_id});
        if(statusCode === 200)
        {
            setButtonState(ButtonState.Default);
        }
    }

    useEffect(() => {
        setButtonState(initState);
        if(initState === ButtonState.IsFriend) {
            isFriendControl.start({
                top: 0,
                transition: {
                    duration: 0
                }
            })
        }
        if(initState === ButtonState.RequestSent) {
            requestSentControl.start({
                top: 0,
                transition: {
                    duration: 0
                }
            })
        }

        console.log('here');
    }, [initState]);

    const handleButtonClick = () => {
        switch (buttonState) {
            case ButtonState.Default:
                handleClickOnDefault();
                break;
            case ButtonState.RequestSent:
                handleClickOnCancelRequest();
                break;
            case ButtonState.IsFriend:
                handleClickOnUnfriend();
                break;
            default:
                handleClickOnDefault();
                break;
        }

    }
    const handleButtonHover = () => {
        switch (buttonState) {
            case ButtonState.IsFriend:
                handleHoverOnIsFriend();
                break;
            case ButtonState.RequestSent:
                handleHoverOnIsRequesting();
                break;
            default:
                break;
        }
    }
    const handleButtonLeave = () => {
        switch (buttonState) {
            case ButtonState.IsFriend:
                handleOnLeaveIsFriend();
                break;
            case ButtonState.RequestSent:
                handleOnLeaveIsRequesting();
                break;
            default:
                break;
        }
    }
    const handleHoverOnIsFriend = async () => {
        await unfriendControl.start({
            left: 0,
            transition: {
                duration: 0.2
            }
        })


    }
    const handleOnLeaveIsFriend = () => {
        unfriendControl.start({
            left: '-100%',
            transition: {
                duration: 0.2
            }
        })
    }
    const handleHoverOnIsRequesting = async () => {
        await cancelRequestControl.start({
            left: 0,
            transition: {
                duration: 0.2
            }
        })
    }
    const handleOnLeaveIsRequesting = () => {
        cancelRequestControl.start({
            left: '-100%',
            transition: {
                duration: 0.2
            }
        })
    }
    const handleClickOnDefault = async () => {


        await loadingControl.start({
            top: 0,
            transition: {
                duration: 0.5
            }
        })
        defaultControl.start({
            top: '-100%'
        })

        await loadingBarControl.start({
          width: '100%',
            transition: {
                duration: 1
            }
        })
        await SendFriendRequest();
        await requestSentControl.start({
            top: 0,
            transition: {
                duration: 0.5
            }
        })
        loadingControl.start({
            top: '-100%'
        })
         loadingBarControl.start({
            width: '0%'
         })
    }
    const handleClickOnCancelRequest = async () => {

        cancelRequestControl.start({
            left: '-100%',
            transition:{
                duration: 0
            }
        })

        await loadingControl.start({
            top: 0,
            zIndex: 5,
            transition: {
                duration: 0.5
            }
        })
        await loadingBarControl.start({
            width: '100%',
            transition: {
                duration: 1
            }
        })
        await CancelFriendRequest();
        requestSentControl.start({
            top: '-100%',
            transition:{
                duration: 0
            }
        })
        await loadingControl.start({
            top: '-100%',
            transition: {
                duration: 0
            }
        })
        loadingBarControl.start({
            width: '0%',
            transition: {
                duration: 0
            }
        })
        defaultControl.start({
            top: 0,
            transition: {
                duration: 0.5
            }
        })
        loadingControl.start({
            top: '-100%',
            transition: {
                duration: 0
            }
        })
    }
    const handleClickOnUnfriend = async () => {
        setButtonState(ButtonState.Default);

         unfriendControl.start({
            left: '-100%',
            transition:{
                duration: 0
            }
        })

        await loadingControl.start({
            top: 0,
            zIndex: 5,
            transition: {
                duration: 0.5
            }
        })
        await loadingBarControl.start({
            width: '100%',
            transition: {
                duration: 1
            }
        })
        await Unfriend();
        isFriendControl.start({
            top: '-100%',
            transition:{
                duration: 0
            }
        })
        await loadingControl.start({
            top: '-100%',
            transition: {
                duration: 0
            }
        })
        loadingBarControl.start({
            width: '0%',
            transition: {
                duration: 0
            }
        })
         defaultControl.start({
            top: 0,
            transition: {
                duration: 0.5
            }
        })
        loadingControl.start({
            top: '-100%',
            transition: {
                duration: 0
            }

        })
    }

    return (
        <div className="friend-button" onClick={handleButtonClick} onMouseEnter={handleButtonHover} onMouseLeave={handleButtonLeave}>
            <div className='wrapper'>
                <motion.div animate={defaultControl} className="default bg-white  container">
                    <Text bold  fontSize={15}>Add Friend</Text>
                </motion.div>
                <motion.div animate={loadingControl} className="loading container">
                    <div className='loading-body'>
                        <div className='loading-icon'></div>
                        <Text bold  fontSize={15}>
                            Processing
                        </Text>
                    </div>
                    <motion.div animate={loadingBarControl} className="loading-bar  bg-blue-500">

                    </motion.div>
                </motion.div>
                <motion.div animate={requestSentControl} className="request-sent container">
                    <MdVerified size={20} className='text-green-500'/>
                    <Text bold fontSize={15}> Sent</Text>
                </motion.div>
                <motion.div animate={cancelRequestControl} className="cancel-request bg-red-500 container">
                    <Text bold fontSize={15} color='white' c>Cancel</Text>
                </motion.div>
                <motion.div animate={unfriendControl} className="unfriend bg-red-500 container">
                    <Text bold color='white'  fontSize={15}>Unfriend</Text>
                </motion.div>
                <motion.div animate={isFriendControl} className="is-friend bg-blue-500 container">
                    <FaUserCheck size={20} className='text-white'/>
                    <Text bold color='white' fontSize={15}>Friends</Text>
                </motion.div>
            </div>

        </div>
    )


}