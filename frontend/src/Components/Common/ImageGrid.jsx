import { showModal } from '../../Reducers/Modals';
import { ModalType } from '../../Enums/Modal';
import { AttachmentType } from '../../Enums/AttachmentType';
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import '../../SCSS/ImageGrid.scss';
import { QinqiiPostVideo } from './QinqiiPostVideo';
import { QinqiiPostImage } from './QinqiiPostImage';

export const ImageGrid = ({ attachments }) => {
    const ref = useRef(null);

    const dispatch = useDispatch();

    let cnt = attachments.length;
    const renderAttachments = () => {

        const openMediaViewerModal = (index) => {
            dispatch(showModal({ modalType: ModalType.MEDIA, modalProps: { attachments, selected: index } }));
        };

        return attachments.slice(0, 4).map((attachment, index) => {
            if(index === 3 && cnt > 4)
            {
                return <LastGridItem key={attachment.id} cnt={cnt - 4} attachment={attachment} index={index} openMediaViewerModal={openMediaViewerModal}/>
            }
            return <GridItem key={attachment.id} attachment={attachment} index={index} openMediaViewerModal={openMediaViewerModal}/>
        });
    };

    useEffect(() => {
        ref.current.style.gridTemplateColumns = `repeat(${Math.min(cnt-1, 3)}, 1fr)`;
    });

    return (
        <div ref={ref} className='image-grid'>
            {
                renderAttachments()
            }
        </div>
    );
};
export const GridItem = ({ attachment, openMediaViewerModal, index }) => {
    return (
        <div className='cursor-pointer item'  onClick={() => openMediaViewerModal(index)}>
            {
                (
                    attachment.type === AttachmentType.IMAGE ?
                        <QinqiiPostImage src={attachment.link} />
                        : <QinqiiPostVideo src={attachment.link}
                                           controls></QinqiiPostVideo>
                )
            }
        </div>
    );
};
const LastGridItem = ({ attachment, openMediaViewerModal, index, cnt }) => {
    return (
        <div className='relative cursor-pointer item'  onClick={() => openMediaViewerModal(index)}>
            <div className='overlay rounded-[10px] absolute inset-0 bg-black text-white flex justify-center items-center opacity-[0.5]'>
                {cnt}+ more
            </div>
            {
                (
                    attachment.type === AttachmentType.IMAGE ?
                        <QinqiiPostImage src={attachment.link} />
                        : <QinqiiPostVideo  src={attachment.link}
                                           controls></QinqiiPostVideo>
                )
            }
        </div>
    );
};