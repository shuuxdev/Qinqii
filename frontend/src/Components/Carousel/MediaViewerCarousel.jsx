import { faker } from '@faker-js/faker';
import {AiFillDownCircle, AiFillUpCircle} from 'react-icons/ai'
import { twMerge } from 'tailwind-merge';
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { GetTransformYValue } from '../../Helper/GetTransformYValue';
import { MediaViewerModalContext } from '../Modals/MediaViewerModal';
import { QinqiiCustomImage } from '../Common/QinqiiCustomImage';

const CarouselContext = createContext()
const MediaViewerCarousel = ({ attachments }) => {
    const listRef = useRef(null);
    const wrapperRef = useRef(null)
    const {activeCarousel, setActiveCarousel} = useContext(MediaViewerModalContext);
    const [listHeightIsLarger, setListHeightIsLarger] = useState(false);
    const w = 100;
    const h= 140;

    useEffect(() => {
            let wrapperHeight = wrapperRef.current.offsetHeight;
            let listHeight = listRef.current.offsetHeight;
            setListHeightIsLarger(listHeight >= wrapperHeight )
    },[]);


    const moveTo = (toIndex ) => {
        const translateSlide = (translateYValue) => {
            if(!listHeightIsLarger) return;
            if(translateYValue)
            {
                listRef.current.style.transform = `translateY(${translateYValue + ((activeCarousel - toIndex ) * h)}px)`
            }
            else
                listRef.current.style.transform = `translateY(${(activeCarousel - toIndex) * h}px)`

        }
        if(listRef.current)
        {
            if(toIndex >= attachments.length) return moveTo(0);
            if(toIndex < 0) return moveTo(attachments.length - 1);
            setActiveCarousel(toIndex)
            let transformString = listRef.current.style.transform
            const translateYValue = GetTransformYValue(transformString);
            translateSlide(translateYValue)
        }
    }



    const ctxValue = {
        moveTo,
        activeCarousel,
        setActiveCarousel
    }
    
    return (
        <div className='media-viewer-carousel'>
            <AiFillUpCircle onClick={() => moveTo(activeCarousel - 1)} size={30} color='white'/>
            <div style={{justifyContent: !listHeightIsLarger ? "center" : ""}} ref={wrapperRef} className='wrapper-with-fixed-height'>
                <div  className='list' ref={listRef}>
                    {attachments.map((attachment, index) => {
                        return <CarouselContext.Provider value={ctxValue}>
                            <CarouselItem  payload={attachment} index={index}/>
                        </CarouselContext.Provider>
                    })}
                </div>
            </div>

            <AiFillDownCircle onClick={ () => moveTo(activeCarousel + 1)} size={30} color='white'/>
        </div>
    )
};

const CarouselItem = ({payload, index}) => {

    const { activeCarousel, moveTo} = useContext(CarouselContext);
    const c = twMerge('w-full h-full object-cover', index === activeCarousel ? "border-[3px] border-solid border-blue-500" : "");

    return (
        <div className='item' key={payload.id} onClick={() => moveTo(index)}>
            {
                payload.type === "IMAGE" ?
                    <QinqiiCustomImage className={c} src={payload.link}/>
                    : <QinqiiCustomImage className={c} src={payload.thumbnail}/>
            }
        </div>
    )
}

export default MediaViewerCarousel;