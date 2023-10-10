import { useParams } from 'react-router-dom';
import { fetchImagesThunk, useGetImagesQuery } from '../../Reducers/Profile';
import { useDispatch, useSelector } from 'react-redux';
import { showModal } from '../../Reducers/Modals';
import { ModalType } from '../../Enums/Modal';
import { motion } from 'framer-motion';
import { AiOutlineComment, AiOutlineHeart } from 'react-icons/ai';
import { QinqiiCustomImage } from '../Common/QinqiiCustomImage';
import { useEffect } from 'react';
import { EmptyResult } from './EmptyResult';
import Loading from '../Common/Loading';

export const ImagesTab = () => {
    const param = useParams();

    const dispatch = useDispatch();
    const { images, isSuccess, isLoading } = useSelector(state => state.profile);
    const variant = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
        },
    };
    useEffect(() => {
        dispatch(fetchImagesThunk({ user_id: param.id, page: 1, pageSize: 20 }));
    }, [param.id]);
    const OpenInMediaViewer = (index) => {
        const attachments = images.filter((image) => images[index].post_id === image.post_id)
            .map((image) => ({ link: image.attachment_link, type: 'IMAGE', id: image.attachment_id }));

        let selectedIndex = 0;
        attachments.forEach((attachment, i) => {
            if (attachment.id === images[index].attachment_id) selectedIndex = i;
        });

        dispatch(showModal({ modalType: ModalType.MEDIA, modalProps: { attachments, selected: selectedIndex } }));
    };
    return (<div className='bg-white min-h-[300px]'>
        {
            (images.length !== 0) ?
                <div className='grid gap-1   grid-flow-row grid-cols-3 grid-rows-3 p-[20px] '>
                    {
                        images.map((image, index) => (
                            <div key={image.id} onClick={() => OpenInMediaViewer(index)}
                                 className='rounded-[5px] overflow-hidden relative aspect-square'>
                                <motion.div variants={variant} initial='hidden' whileHover='visible'
                                            className='absolute cursor-pointer inset-0 transparent-black-background'>
                                    <div className='absolute bottom-0 flex justify-between w-full p-[10px]'>
                                        <div className='flex'>
                                            <AiOutlineHeart size={24} className='text-white mx-[5px]' />
                                            <span className=''>{image.reactions}</span>
                                        </div>
                                        <div className='flex'>

                                            <AiOutlineComment size={24}
                                                              className='text-white mx-[5px]'></AiOutlineComment>
                                            <span className='text-white mx-[5px]'>{image.comments}</span>
                                        </div>
                                    </div>
                                </motion.div>
                                <QinqiiCustomImage className='w-full h-full object-cover' src={image.attachment_link}
                                                   alt='' />
                            </div>
                        ))
                    }
                </div> : <EmptyResult/>
        }
        {
            isLoading && <Loading/>
        }
    </div>);
};