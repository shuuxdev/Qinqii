import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { HeaderText, Text } from '../../StyledComponents/styled.tsx';
import { BsFillHeartFill } from 'react-icons/bs';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import Timer from '../../Helper/Timer.js';
import moment from 'moment/moment.js';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {Story} from './Story.jsx';
import Loading from '../Common/Loading';
import { useAxios } from '../../Hooks/useAxios';
import { fetchMoreStories, fetchStories, updateViewerThunk } from '../../Reducers/Stories';
import { timeSinceCreatedAt } from '../../Helper/GetTimeSince';
import { useUserID } from '../../Hooks/useUserID';
import { ActiveDot } from '../Common/ActiveDot';
import { QinqiiCustomImage } from '../Common/QinqiiCustomImage';
import { Avatar } from '../Common/Avatar';
import MediaQuery from 'react-responsive';
import { ScreenWidth } from '../../Enums/ScreenWidth';

const dateFormat = 'YYYY/MM/DD hh:mm:ss';


export const StoryViewerContext = createContext();

export default function StoryViewer() {
    const stories = useSelector(state => state.stories);
    const param = useParams();
    let currentSelectedStoryIndex =  stories.findIndex(story => story.id === parseInt(param.id))
    const axios = useAxios();

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchStoriesAsync = async () => {
            const response = await axios.GET_Stories();
            if(response.status === 200)
                dispatch(fetchStories(response.data));
        }
        if(stories.length == 0)
            fetchStoriesAsync();
    }, [param.id]);




    const defaultValue = { story: stories[currentSelectedStoryIndex] }

    return (
        <StoryViewerContext.Provider value={defaultValue}>
            <motion.div initial={{ opacity: 0, x: "-40px" }} animate={{ opacity: 1, x: 0 }} className="flex h-screen ">
                <MediaQuery minWidth={ScreenWidth.lg}>
                {
                    stories.length > 0  ?
                            <StoryList stories={stories} />
                    : <Loading/>
                }
                </MediaQuery>
                {
                    currentSelectedStoryIndex !== -1 ?
                        <div className="h-full flex-1 flex justify-center items-center   bg-black ">
                            <Story  story={stories[currentSelectedStoryIndex]} key={stories[currentSelectedStoryIndex].id}/>
                        </div>
                        :<Loading/>

                }
            </motion.div>
         </StoryViewerContext.Provider>
    )
}

const StoryItem = ({ story }) => {
    const user_id = useUserID();
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const OpenInViewer = () => {
        navigate(`/story/${story.id}`)

        if(story.seen || story.author_id === user_id) return;
        dispatch(updateViewerThunk(story.id))

    }
    const variant = {
        hidden: {
            opacity: 0,
            y: '-100px'
        },
        visible: {
            opacity: 1,
            y: 0
        }
    }
    return (
        <motion.div variants={variant} initial="hidden" animate="visible"  onClick={OpenInViewer} className="relative  overflow-hidden aspect-[3/4] bg-red-500 rounded-[10px]">
            <QinqiiCustomImage src={story.thumbnail} className='object-cover w-full h-full' />
            <div className="absolute top-0 z-20 pt-[10px] pl-[10px] items-center flex gap-[8px]">
                <div className="shrink-0">
                    {
                        story.seen ?
                            <Avatar src={story.author_avatar} user_id={story.author_id} border='3px solid #606770' />
                            :
                            <Avatar src={story.author_avatar} user_id={story.author_id} border='3px solid #5095f0' />
                    }
                </div>
                <div className="flex flex-wrap flex-1">
                    <Text>{story.author_name}</Text>

                </div>
            </div>
            <StoryItemOverlay />
            <div className="flex gap-[7px] absolute bottom-0 pb-[10px] items-center pl-[10px] z-20 ">
                <ActiveDot />
                <Text>{timeSinceCreatedAt(story.created_at)}</Text>
            </div>
        </motion.div>
    )
}
const StoryItemOverlay = ({ onClick }) => {
    return (
        <div className=" absolute inset-0 opacity-20 bg-black z-10">
            <div onClick={onClick} className="absolute top-0 bottom-0 left-0 right-0 cursor-pointer"></div>
        </div>
    )
}
const StoryList = ({stories}) => {

    const dispatch = useDispatch();
    const axios = useAxios();
    const currentPage = useRef(1);
    const reachEnd = useRef(false);
    const handleScroll = async () => {
        const scrollableDiv = document.querySelector('.scrollableDiv');

        if (scrollableDiv.scrollHeight - scrollableDiv.scrollTop === scrollableDiv.clientHeight) {
            currentPage.current++;
            const response = await axios.GET_Stories(currentPage.current, 10);
            if(response.status === 200)
            {
                dispatch(fetchMoreStories(response.data));
                if(response.data.length === 0)
                    reachEnd.current = true;
            }
        }
    }
    useEffect(() => {
        if(reachEnd.current) return;
        const scrollableDiv = document.querySelector('.scrollableDiv');

        scrollableDiv.addEventListener('scroll', handleScroll);
        return ()=> {
            scrollableDiv.removeEventListener('scroll', handleScroll)

        }
    });
    return (
        <div className="scrollableDiv flex flex-col px-[10px] py-[20px] w-[400px] overflow-y-auto     ">
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



