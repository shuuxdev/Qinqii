import React, { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { BgColor, HeaderText, Text } from '../StyledComponents/styled.tsx'
import { faker } from '@faker-js/faker'
import { ActiveDot, Avatar } from './CommonComponent.jsx'
import { BsEmojiAngry, BsEmojiAngryFill, BsFillEmojiHeartEyesFill, BsFillHeartFill, BsHeart } from 'react-icons/bs'
import bg1 from '../Assets/s1.jpg'
import bg2 from '../Assets/s2.jpg'
import bg3 from '../Assets/s3.jpg'
import vd1 from '../Assets/vd1.mp4'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import Timer from '../Helper/Timer.js'
import moment from 'moment/moment.js'
import { useDispatch, useSelector } from 'react-redux'
import { goToStory } from '../Modules/StoryUI.js'
import { addFramesThunk } from '../Modules/Stories.js'
import { useNavigate } from 'react-router-dom'
import { MdOutlineCancelPresentation } from 'react-icons/md'

const dateFormat = 'YYYY/MM/DD hh:mm:ss';


const frames = [
    { type: 'VIDEO', url: vd1, duration: 40, id: 'id1' },
    { type: 'IMAGE', url: bg2, duration: 3, id: 'id2' },
    { type: 'IMAGE', url: bg3, duration: 3, id: 'id3' }]
const stories = [
    { seen: true, thumbnail: faker.image.url(), author_name: 'shuu', author_avatar: bg1, created_at: moment('2023/08/08 04:00:00').format(dateFormat), },
    { seen: false, thumbnail: faker.image.url(), author_name: 'Hào', author_avatar: bg2, created_at: moment('2023/08/08 06:00:00').format(dateFormat) },
    { seen: false, thumbnail: faker.image.url(), author_name: 'Hào', author_avatar: bg2, created_at: moment('2023/08/08 06:00:00').format(dateFormat) },
    { seen: false, thumbnail: faker.image.url(), author_name: 'Hào', author_avatar: bg2, created_at: moment('2023/08/08 06:00:00').format(dateFormat) },
    { seen: false, thumbnail: faker.image.url(), author_name: 'Hào', author_avatar: bg2, created_at: moment('2023/08/08 06:00:00').format(dateFormat) },
    { seen: false, thumbnail: faker.image.url(), author_name: 'Hào', author_avatar: bg2, created_at: moment('2023/08/08 06:00:00').format(dateFormat) },
    { seen: false, thumbnail: faker.image.url(), author_name: 'Hào', author_avatar: bg2, created_at: moment('2023/08/08 06:00:00').format(dateFormat) },
    { seen: false, thumbnail: faker.image.url(), author_name: 'Phúc', author_avatar: bg3, created_at: moment('2023/08/09 05:00:00').format(dateFormat) }
]


const StoryViewerContext = createContext();

export default function StoryViewer() {
    const stories = useSelector(state => state.stories);
    const currentSelectedStoryIndex = useSelector(state => state.storiesUI.currentSelectedStoryIndex);




    const defaultValue = { story: stories[currentSelectedStoryIndex] }

    return (
        <StoryViewerContext.Provider value={defaultValue}>
            <motion.div initial={{ opacity: 0, x: "-40px" }} animate={{ opacity: 1, x: 0 }} className="flex h-screen ">
                <StoryList stories={stories} />
                <Viewer key={stories[currentSelectedStoryIndex].id} frames={stories[currentSelectedStoryIndex].frames} />
            </motion.div>
        </StoryViewerContext.Provider>
    )
}
const StorySeen = ({ seen, children }) => {
    return (
        <div className='rounded-full overflow-hidden'>
            {
                seen ? <div className='border-3px border-solid border-blue-400'>
                    {children}
                </div>
                    : <div className='border-3px border-solid border-gray-400'>
                        {children}
                    </div>
            }
        </div>

    )
}
const StoryItem = ({ story }) => {
    const time = moment(story.created_at, dateFormat);
    const now = moment();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const GoToStory = (story_id) => {
        dispatch(addFramesThunk({ story_id, navigate }))
    }
    const OpenInViewer = () => {
        GoToStory(story.id)

    }
    return (
        <div onClick={OpenInViewer} className="relative  overflow-hidden aspect-[3/4] bg-red-500 rounded-[10px]">
            <img src={story.thumbnail} className='object-cover w-full h-full' />
            <div className="absolute top-0 z-20 pt-[10px] pl-[10px] items-center flex gap-[8px]">
                <div className="shrink-0">
                    {
                        story.seen ?
                            <Avatar src={story.author_avatar} border='3px solid #5095f0' />
                            :
                            <Avatar src={story.author_avatar} border='3px solid #606770' />
                    }
                </div>
                <div className="flex flex-wrap flex-1">
                    <Text>{story.author_name}</Text>

                </div>
            </div>
            <StoryItemOverlay />
            <div className="flex gap-[7px] absolute bottom-0 pb-[10px] items-center pl-[10px] z-20 ">
                <ActiveDot />
                <Text>{moment.duration(now.diff(time)).hours()} giờ trước</Text>
            </div>
        </div>
    )
}
const StoryItemOverlay = ({ onClick }) => {
    return (
        <div className=" absolute inset-0 opacity-20 bg-black z-10">
            <div onClick={onClick} className="absolute top-0 bottom-0 left-0 right-0 cursor-pointer"></div>
        </div>
    )
}
const StoryList = ({ stories }) => {


    return (
        <div className="flex flex-col px-[10px] py-[20px] w-[400px] overflow-y-scroll">
            <HeaderText sm>
                Stories
            </HeaderText>
            <div className="grid grid-cols-2 p-[10px] gap-[10px] ">
                {
                    stories.map(story => (
                        <StoryItem story={story} />
                    ))
                }
            </div>
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

const ViewerContext = createContext();
const FrameState = {
    OPEN: 'OPEN',
    PAUSE: 'PAUSE'
}
const Viewer = ({ frames }) => {


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
    useEffect(() => {

    }, [])
    return (
        <ViewerContext.Provider value={defaultValue}>
            <div className="h-full flex-1 flex justify-center items-center   bg-red-400">
                <div className=" relative  rounded-[10px] m-[10px]    h-[600px]  w-[400px]">
                    <StoryHeader images={frames} />
                    <FrameOverlay onLeftPanelClick={PrevFrame} onCenterPanelClick={ToggleFrameState} onRightPanelClick={NextFrame} />
                    <FrameContent key={frames[currentActiveFrameIndex].id} frame={frames[currentActiveFrameIndex]} />
                    <StoryAction />
                    <StoryFooter />
                    <StoryDetail />
                </div>
            </div>
        </ViewerContext.Provider>

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
            <div className="absolute z-20 w-full bottom-0 translate-y-[100%]">
                {
                    isShow ?
                        <motion.div className='w-full h-[300px] bg-white  rounded-[10px]' animate={{ opacity: 1, y: '-100%' }} transition={{ damping: 0, duration: 0.2 }}>


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
            </div >
        </AnimatePresence >

    )
}
const FrameContent = ({ frame }) => {
    return (
        <>
            {
                frame.frame_type === 'IMAGE' ? <img src={frame.frame_url} className='object-cover h-full w-full rounded-[10px]' />
                    : <VideoFrame frame={frame} />
            }
        </>
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
        <video ref={ref} className='object-cover h-full w-full rounded-[10px]' src={frame.url} controls={true} ></video>
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
            <div className="flex flex-col gap-[10px] py-[15px] px-[5px] border-solid border-[2px] border-white rounded-full">

                <EmojiButton emoji={<BsFillHeartFill color='white' size={26} />} />
            </div>
        </div>
    )
}
const StoryInput = () => {
    return (
        <div>

            <input type="text" placeholder='Reply to story' />
        </div>
    )
}
const EmojiButton = ({ emoji }) => {
    const HandleClick = () => {

    }
    return (
        <div onClick={HandleClick}>
            {emoji}
        </div>
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