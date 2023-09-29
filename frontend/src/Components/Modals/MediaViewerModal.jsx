import { ModalWrapper } from "./ModalWrapper.jsx"
import '../../SCSS/Modals.scss'
import { faker } from '@faker-js/faker';
import MediaViewerCarousel from '../Carousel/MediaViewerCarousel';
import { useDispatch, useSelector } from 'react-redux';
import { createContext, useState } from 'react';
import { hideModal } from '../../Reducers/Modals';
import { ENTITY } from '../../Enums/Entity';
import { QinqiiCustomVideo } from '../Common/QinqiiCustomVideo';
import { QinqiiCustomImage } from '../Common/QinqiiCustomImage';



export const MediaViewerModalContext = createContext();
export const MediaViewerModal = ({ attachments, selected }) => {
    const dispatch = useDispatch();
    const handleClose = () => dispatch(hideModal());


    const [activeCarousel, setActiveCarousel] = useState(selected);
    return (
        <MediaViewerModalContext.Provider value={{activeCarousel, setActiveCarousel}}>
            <ModalWrapper className='media-viewer-modal' open={true} handleClose={handleClose}>
                <MediaViewerCarousel attachments={attachments} />
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