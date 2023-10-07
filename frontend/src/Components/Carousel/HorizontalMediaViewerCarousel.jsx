import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { MediaViewerModalContext } from '../Modals/MediaViewerModal';
import { GetTransformXValue } from '../../Helper/GetTransformXValue';
import { useMediaQuery } from 'react-responsive';
import { ScreenWidth } from '../../Enums/ScreenWidth';
import { twMerge } from 'tailwind-merge';
import { QinqiiCustomImage } from '../Common/QinqiiCustomImage';
import { MdNavigateNext, MdSkipPrevious } from 'react-icons/md';

const CarouselContext = createContext()
export const HorizontalMediaViewerCarousel = ({ attachments }) => {
    const listRef = useRef(null);
    const wrapperRef = useRef(null);
    const { activeCarousel, setActiveCarousel } = useContext(MediaViewerModalContext);
    const [listWidthIsLarger, setListWidthIsLarger] = useState(false);
    const w = 100;
    const h = 140;

    useEffect(() => {
        let wrapperWidth = wrapperRef.current.offsetWidth;
        let listWidth = listRef.current.offsetWidth;
        setListWidthIsLarger(listWidth >= wrapperWidth);
    }, []);


    const moveTo = (toIndex) => {
        const translateSlide = (translateXValue) => {
            if (!listWidthIsLarger) return;
            if (translateXValue) {
                listRef.current.style.transform = `translateX(${translateXValue + ((activeCarousel - toIndex) * w)}px)`;
            } else
                listRef.current.style.transform = `translateX(${(activeCarousel - toIndex) * w}px)`;

        };
        if (listRef.current) {
            if (toIndex >= attachments.length) return moveTo(0);
            if (toIndex < 0) return moveTo(attachments.length - 1);
            setActiveCarousel(toIndex);
            let transformString = listRef.current.style.transform;
            const translateXValue = GetTransformXValue(transformString);
            translateSlide(translateXValue);
        }
    };

    const isPhoneScreen = useMediaQuery({ query: `(max-width: ${ScreenWidth.sm}px)` });
    const isTabletScreen = useMediaQuery({ query: `(max-width: ${ScreenWidth.md}px)` });
    let mxCaurosel = 99;
    if (isPhoneScreen) mxCaurosel = 2;
    if (isTabletScreen) mxCaurosel = 3;

    const ctxValue = {
        moveTo,
        activeCarousel,
        setActiveCarousel,
    };

    return (
        <div className='horizontal-media-viewer-carousel'>
            <MdSkipPrevious onClick={() => moveTo(activeCarousel - 1)} size={30} color='white' />
            <div style={{ alignItems: !listWidthIsLarger ? 'center' : '' }} ref={wrapperRef}
                 className='wrapper-with-fixed-height'>
                <div className='list' ref={listRef}>
                    {attachments.map((attachment, index) => {
                        return <CarouselContext.Provider value={ctxValue}>
                            <CarouselItem payload={attachment} index={index} />
                        </CarouselContext.Provider>;
                    })}
                </div>
            </div>

            <MdNavigateNext onClick={() => moveTo(activeCarousel + 1)} size={30} color='white' />
        </div>
    );
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