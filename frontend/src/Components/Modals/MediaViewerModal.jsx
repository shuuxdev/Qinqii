import { ModalWrapper } from './ModalWrapper.jsx';
import '../../SCSS/Modals.scss';
import VerticalMediaViewerCarousel from '../Carousel/VerticalMediaViewerCarousel';
import { useDispatch } from 'react-redux';
import { createContext, useState } from 'react';
import { hideModal } from '../../Reducers/Modals';
import { QinqiiCustomVideo } from '../Common/QinqiiCustomVideo';
import { QinqiiCustomImage } from '../Common/QinqiiCustomImage';
import { useMediaQuery } from 'react-responsive';
import { ScreenWidth } from '../../Enums/ScreenWidth';
import { HorizontalMediaViewerCarousel } from '../Carousel/HorizontalMediaViewerCarousel';


export const MediaViewerModalContext = createContext();
export const MediaViewerModal = ({ attachments, selected }) => {
    const isPhoneScreen = useMediaQuery({ query: `(max-width: ${ScreenWidth.sm}px)` });
    const isTabletScreen = useMediaQuery({ query: `(max-width: ${ScreenWidth.md}px)` });
    const dispatch = useDispatch();
    const handleClose = () => dispatch(hideModal());


    const [activeCarousel, setActiveCarousel] = useState(selected);
    return (
        <MediaViewerModalContext.Provider value={{activeCarousel, setActiveCarousel}}>
            <ModalWrapper className='media-viewer-modal' open={true} handleClose={handleClose}>
                {
                    isPhoneScreen || isTabletScreen ? <HorizontalMediaViewerCarousel attachments={attachments}/>
                        :
                        <VerticalMediaViewerCarousel attachments={attachments} />

                }
                <ViewerPane payload={attachments[activeCarousel]}/>
             </ModalWrapper>
        </MediaViewerModalContext.Provider>


    )
}

const ViewerPane = ({payload}) => {
    return (
        <div className="viewer-pane">
            { payload.type == "IMAGE" ?
            <QinqiiCustomImage src={payload.link} className='w-full h-full object-contain'></QinqiiCustomImage>
            : <QinqiiCustomVideo autoPlay controls src={payload.link} className='w-full h-full object-contain' ></QinqiiCustomVideo>
            }
        </div>
    )
}
const DetailPane = () => {
    return (
        <div className="detail-pane">
        </div>
    )
}