import React from 'react';
import { BsPlusLg } from 'react-icons/bs';
import Color from '../../Enums/Color';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showModal } from '../../Reducers/Modals';
import { ModalType } from '../../Enums/Modal';
import { updateViewerThunk } from '../../Reducers/Stories';
import { QinqiiCustomImage } from '../Common/QinqiiCustomImage';
import { Text } from '../Common/Text';
import { Avatar } from '../Common/Avatar';
import { useMediaQuery } from 'react-responsive';
import { ScreenWidth } from '../../Enums/ScreenWidth';

export function StoryItem({ def, story }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const HandleClick = () => {
        dispatch(updateViewerThunk(story.id))
        navigate(`/story/${story.id}`)
    }

    return (
        <div onClick={HandleClick} className="relative aspect-[3/4] cursor-pointer overflow-hidden rounded-[10px]  flex-[1] max-w-[150px]">
            <div className="opacity-[0.5] bg-black z-20 left-0 right-0 bottom-0 top-0 absolute"></div>


                <div className="absolute left-[15%] top-[15%] z-30 ">
                    {
                        !story.seen ?
                            <Avatar src={story.author_avatar} user_id={story.author_id} border='3px solid #5095f0' />
                            :
                            <Avatar src={story.author_avatar} user_id={story.author_id} border='3px solid #606770' />
                    }
                </div>
            <QinqiiCustomImage src={story.thumbnail} alt="" className="object-cover w-full h-full z-10 relative" />
            <div className="z-30 absolute bottom-2 left-[50%] translate-x-[-50%]">
                <Text color={Color.White} bold>Shuu</Text>
            </div>
        </div>
    )
}
const UploadStory = () => {
    const BorderAround = ({ children }) =>
        <div className="z-40 absolute rounded-[9px] border-[2px] p-[4px] border-white border-solid left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">

            {children}
        </div>

    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const HandleClick = () => {
        dispatch(showModal({modalType: ModalType.STORY_UPLOAD}))
    }

    return (
        <div onClick={HandleClick} className="relative aspect-[3/4] cursor-pointer overflow-hidden rounded-[10px] flex-[1] max-w-[150px]">
            <div className="opacity-[0.5] bg-black z-20 left-0 right-0 bottom-0 top-0 absolute"></div>

                <BorderAround>
                    <div className={`flex justify-center bg-[${Color.White}] p-[7px]  rounded-[5px] items-center`}>
                        <BsPlusLg color={Color.Primary} size={12} fontWeight={800}></BsPlusLg>
                    </div>
                </BorderAround>
            <QinqiiCustomImage src={user.avatar} alt="" className="object-cover w-full h-full z-10 relative" />
            <div className="z-30 absolute bottom-2 left-[50%] translate-x-[-50%]">
                <Text color={Color.White} bold>{user.name}</Text>
            </div>
        </div>
    )
}
export function Stories() {
    const stories = useSelector(state => state.stories)
    const isSm = useMediaQuery({query: `(max-width: ${ScreenWidth.sm}px)`})
    const isXs = useMediaQuery({query: `(max-width: ${ScreenWidth.xs}px)`})
    const isMd = useMediaQuery({query: `(max-width: ${ScreenWidth.md}px)`})
    let maxStory = 5;
    if (isMd) maxStory = 3;
    if (isSm) maxStory = 2;
    if (isXs) maxStory = 1;

    console.log(maxStory);
    return (
        <div style={{gap: `clamp(2px, 0.5vw, 7px)`}} className={`flex p-[10px] bg-[${Color.White}] rounded-[10px] my-[10px]`}>
            <UploadStory/>
            {
                stories.slice(0,maxStory).map((story) => (
                    <StoryItem key={story.story_id} story={story}></StoryItem>
                ))
            }
        </div>
    )
}