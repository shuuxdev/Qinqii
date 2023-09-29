import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useUserID } from '../../Hooks/useUserID';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { HeaderText, Text } from '../../StyledComponents/styled';
import { MdOutlineCancelPresentation } from 'react-icons/md';
import Timer from '../../Helper/Timer';
import { StoryViewerContext } from './StoryViewer';
import { StoryVideo } from '../Common/StoryVideo';
import { QinqiiCustomVideo } from '../Common/QinqiiCustomVideo';
import { QinqiiCustomImage } from '../Common/QinqiiCustomImage';
import { Avatar } from '../Common/Avatar';
export const FrameState = {
    OPEN: 'OPEN',
    PAUSE: 'PAUSE'
}
export const ViewerContext = createContext();

export const Story = ({story}) => {
    const frames = story.frames;
    const user_id = useUserID();

    const [currentActiveFrameIndex, setCurrentActiveFrameIndex] = useState(0);
    const [currentActiveFrameState, setCurrentActiveFrameState] = useState(FrameState.OPEN);
    const timer = useMemo(() => new Timer(() => {
        NextFrame();
    }, frames[currentActiveFrameIndex].duration * 1000), [currentActiveFrameIndex])
    const PrevFrame = () => {
        setCurrentActiveFrameIndex(currentActiveFrameIndex - 1 >= 0 ? currentActiveFrameIndex - 1 : frames.length - 1);
        setCurrentActiveFrameState(FrameState.OPEN);
        timer.clearTimeout();

    }
    const ToggleFrameState = () => {

        if (currentActiveFrameState === FrameState.OPEN) timer.pause();
        else timer.resume();
        setCurrentActiveFrameState(state => state === FrameState.OPEN ? FrameState.PAUSE : FrameState.OPEN);
    }

    const NextFrame = () => {
        setCurrentActiveFrameIndex((currentActiveFrameIndex + 1) % frames.length);
        setCurrentActiveFrameState(FrameState.OPEN);
        timer.clearTimeout();
    }
    const GoToFrame = (frameIndex) => {
        setCurrentActiveFrameIndex(frameIndex);
        setCurrentActiveFrameState(FrameState.OPEN);
        timer.clearTimeout();
    }
    const defaultValue = {
        currentActiveFrameIndex,
        ToggleFrameState,
        currentActiveFrameState,
        GoToFrame
    }
    useEffect(() => {
        timer.resume();
    }, [currentActiveFrameIndex])
    return (
        <ViewerContext.Provider value={defaultValue}>

        <div className=" relative  rounded-[10px] m-[10px]    h-[600px]  w-[400px]">
            <StoryHeader images={frames} />
            <FrameOverlay onLeftPanelClick={PrevFrame} onCenterPanelClick={ToggleFrameState} onRightPanelClick={NextFrame} />
            <FrameContent key={frames[currentActiveFrameIndex].id} frame={frames[currentActiveFrameIndex]} />
            <StoryAction />
            <StoryFooter />
            {
                user_id === story.author_id &&
                <StoryDetail />
            }
        </div>
        </ViewerContext.Provider>
    )
}
export const PreviewStory = ({frames}) => {

    const [currentActiveFrameIndex, setCurrentActiveFrameIndex] = useState(0);
    const [currentActiveFrameState, setCurrentActiveFrameState] = useState(FrameState.OPEN);
    const timer = useMemo(() => new Timer(() => {
        NextFrame();
    }, frames[currentActiveFrameIndex].duration * 1000), [currentActiveFrameIndex])
    const PrevFrame = () => {
        setCurrentActiveFrameIndex(currentActiveFrameIndex - 1 >= 0 ? currentActiveFrameIndex - 1 : frames.length - 1);
        setCurrentActiveFrameState(FrameState.OPEN);
        timer.clearTimeout();

    }
    const ToggleFrameState = () => {

        if (currentActiveFrameState === FrameState.OPEN) timer.pause();
        else timer.resume();
        setCurrentActiveFrameState(state => state === FrameState.OPEN ? FrameState.PAUSE : FrameState.OPEN);
    }

    const NextFrame = () => {
        setCurrentActiveFrameIndex((currentActiveFrameIndex + 1) % frames.length);
        setCurrentActiveFrameState(FrameState.OPEN);
        timer.clearTimeout();
    }
    const GoToFrame = (frameIndex) => {
        setCurrentActiveFrameIndex(frameIndex);
        setCurrentActiveFrameState(FrameState.OPEN);
        timer.clearTimeout();
    }
    const defaultValue = {
        currentActiveFrameIndex,
        ToggleFrameState,
        currentActiveFrameState,
        GoToFrame
    }
    useEffect(() => {
        timer.resume();
    }, [currentActiveFrameIndex])
    return (
        <ViewerContext.Provider value={defaultValue}>

            <div className=" relative  rounded-[10px] m-[10px]    h-[600px]  w-[400px]">
                <StoryHeader images={frames} />
                <FrameOverlay onLeftPanelClick={PrevFrame} onCenterPanelClick={ToggleFrameState} onRightPanelClick={NextFrame} />
                <FrameContent key={frames[currentActiveFrameIndex].id} frame={frames[currentActiveFrameIndex]} />
            </div>
        </ViewerContext.Provider>
    )
}
function StoryFooter() {
    return (
        <div className='flex z-20 justify-between absolute p-[20px] bottom-0'>
            <AvatarBox />
        </div>
    )
}

function StoryAction() {
    return (
        <div className="absolute right-0 z-20 top-[50%] translate-y-[-50%] pr-[15px]">

        </div>
    )
}



const FrameOverlay = ({ onLeftPanelClick, onRightPanelClick, onCenterPanelClick }) => {
    return (
        <div className="rounded-[10px] absolute inset-0 opacity-20 bg-black z-10">
            <div onClick={onLeftPanelClick} className="absolute top-0 bottom-0 left-0 right-[70%] cursor-pointer"></div>
            <div onClick={onCenterPanelClick} className="absolute top-0 bottom-0 left-[30%] right-[30%] cursor-pointer z-30"></div>
            <div onClick={onRightPanelClick} className="absolute top-0 bottom-0 left-[70%] right-0 cursor-pointer"></div>
        </div>
    )
}
const StoryDetail = () => {
    const { story } = useContext(StoryViewerContext);

    const [isShow, setShow] = useState(false);
    const OpenStoryDetail = () => {
        setShow(true);
    }
    return (
        <AnimatePresence >
            {
                isShow ?
                    <motion.div className='absolute bottom z-[20] w-full h-[300px] bg-white  rounded-[10px]' initial={{opacity: 0, y: '-90%'}} animate={{ opacity: 1, y:'-100%'}} transition={{ damping: 0, duration: 0.2 }}>


                        <div className='mx-[10px]  flex items-center justify-center  border-b-[2px] border-solid border-[#CED0D4] p-[5px]' >
                            <HeaderText sm >Story's detail</HeaderText>
                            <div onClick={() => { setShow(false) }} >
                                <MdOutlineCancelPresentation size={20} />
                            </div>
                        </div>
                        <div className='p-[10px]'>

                            {
                                story.viewers.map(viewer => (
                                    <div className="  items-center flex gap-[8px]">
                                        <div className="shrink-0">
                                            <Avatar src={viewer.viewer_avatar} />
                                        </div>
                                        <div className="flex flex-wrap flex-1">
                                            <Text color='black' className>{viewer.viewer_name}</Text>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                    </motion.div> :
                    <div onClick={OpenStoryDetail}>

                        <Text  >{story.viewers.length} người xem</Text>
                    </div>
            }
        </AnimatePresence >

    )
}

const VideoFrame = ({ frame }) => {
    const ref = useRef();

    const { currentActiveFrameState } = useContext(ViewerContext);

    useEffect(() => {
        if (currentActiveFrameState === FrameState.OPEN)
            ref.current.play();
        else ref.current.pause();
    }, [currentActiveFrameState])
    return (
        <StoryVideo ref={ref}  frame_src={frame.frame_url} ></StoryVideo>
    )
}
const AvatarBox = () => {
    const { story } = useContext(StoryViewerContext)
    return (
        <div className="flex gap-[10px] justify-center items-center">
            <Avatar src={story.author_avatar} />
            <Text>{story.author_name}</Text>
        </div>
    )
}

const FrameContent = ({ frame }) => {
    return (
        <>
            {
                frame.frame_type === 'IMAGE' ? <QinqiiCustomImage src={frame.frame_url} className='object-cover h-full w-full rounded-[10px]' />
                    : <VideoFrame frame={frame} />
            }
        </>
    )
}
function StoryHeader({ images }) {

    return (
        <div className='absolute z-20 pt-[20px] px-[20px]  items-center flex gap-[10px] w-full'>
            <HeaderText color='white' font='Montserrat' className="tracking-[2.8px]">STORYLINE</HeaderText>
            <div className='flex gap-[5px] grow'>
                {
                    images.map((frame, index) => (
                        <Indicator key={frame.id} frameIndex={index} duration={frame.duration}>

                        </Indicator>

                    ))
                }
            </div>
        </div>
    )
}



const IndicatorState = {
    LOADING: 'LOADING',
    LOADED: 'LOADED',
    IDLE: 'IDLE'
}
const IndicatorColor = {
    WHITE: 'white-indicator',
    TRANSPARENT: 'transparent-indicator'
}

const Indicator = ({ frameIndex, duration }) => {

    const indicatorInitial = { width: 0, backgroundColor: 'rgba(256,256,256,0.3)' }
    const indicatorAnimate = { width: '100%', backgroundColor: 'white' }
    const { GoToFrame, currentActiveFrameIndex, currentActiveFrameState } = useContext(ViewerContext);
    const controls = useAnimationControls();

    useEffect(() => {
        if (currentActiveFrameState === FrameState.OPEN) {
            controls.start(indicatorAnimate)
        }
        else controls.stop();
    })
    const [indicatorState, setIndicatorState] = useState(IndicatorState.IDLE);
    useEffect(() => {
        if (frameIndex <= currentActiveFrameIndex) {
            setIndicatorState(IndicatorState.LOADED);
        }
        if (frameIndex == currentActiveFrameIndex) {
            setIndicatorState(IndicatorState.LOADING);
        }
        if (frameIndex > currentActiveFrameIndex) {
            setIndicatorState(IndicatorState.IDLE)
        }
    }, [currentActiveFrameIndex])
    return (
        <div className='flex-1 cursor-pointer' onClick={() => GoToFrame(frameIndex)}>

            {
                indicatorState === IndicatorState.IDLE &&
                <div className={` rounded-full h-[4px] ${IndicatorColor.TRANSPARENT}`} />


            }
            {
                indicatorState === IndicatorState.LOADED &&
                <div className={` rounded-full h-[4px] ${IndicatorColor.WHITE}`} />
            }
            {
                indicatorState === IndicatorState.LOADING &&

                <div className={` rounded-full  overflow-hidden  h-[4px] ${IndicatorColor.TRANSPARENT}`}>
                    <motion.div style={{ height: '100%' }} transition={{ delay: 0, duration: duration }}
                                initial={indicatorInitial}
                                animate={controls}>
                    </motion.div>
                </div>
            }
        </div>

    )
}