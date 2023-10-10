import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useGetVideosQuery } from '../../Reducers/Profile';
import { showModal } from '../../Reducers/Modals';
import { ModalType } from '../../Enums/Modal';
import { motion } from 'framer-motion';
import { AiOutlineComment, AiOutlineHeart } from 'react-icons/ai';
import { QinqiiCustomImage } from '../Common/QinqiiCustomImage';
import Loading from '../Common/Loading';
import { EmptyResult } from './EmptyResult';
import { useUserID } from '../../Hooks/useUserID';
import { useAxios } from '../../Hooks/useAxios';

export const VideosTab = () => {
    const variant = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
        },
    };
    const dispatch = useDispatch();
    const param = useParams();
    const {  isSuccess, isLoading } = useGetVideosQuery({ user_id: param.id, page: 1, pageSize: 20 });

    const videos = useSelector((state) => state.profile.videos);
    const OpenInMediaViewer = (index) => {
        const attachments = videos.filter((video) => videos[index].post_id === video.post_id)
            .map((video) => ({
                link: video.attachment_link,
                type: 'VIDEO',
                id: video.attachment_id,
                thumbnail: video.thumbnail,
            }));

        let selectedIndex = 0;
        attachments.forEach((attachment, i) => {
            if (attachment.id === videos[index].attachment_id) selectedIndex = i;
        });

        dispatch(showModal({ modalType: ModalType.MEDIA, modalProps: { attachments, selected: selectedIndex } }));
    };
    return (
        <div className='bg-white min-h-[300px]'>
        {
            (videos.length !== 0) ?
                <div className='grid gap-1   grid-flow-row grid-cols-3 grid-rows-3 p-[20px] '>
                    {
                        videos.map((video, index) => (
                            <div onClick={() => OpenInMediaViewer(index)}
                                 className='rounded-[5px] overflow-hidden relative aspect-square'>
                                <motion.div variants={variant} initial='hidden' whileHover='visible'
                                            className='absolute cursor-pointer inset-0 transparent-black-background'>
                                    <div className='absolute bottom-0 flex justify-between w-full p-[10px]'>
                                        <div className='flex'>
                                            <AiOutlineHeart size={24} className='text-white mx-[5px]' />
                                            <span className='text-white mx-[5px]'>{video.reactions}</span>
                                        </div>
                                        <div className='flex'>

                                            <AiOutlineComment size={24}
                                                              className='text-white mx-[5px]'></AiOutlineComment>
                                            <span className='text-white mx-[5px]'>{video.comments}</span>
                                        </div>
                                    </div>
                                </motion.div>
                                <QinqiiCustomImage className='w-full h-full object-cover' src={video.thumbnail}
                                                   alt='' />
                            </div>
                        ))}</div>
                : <EmptyResult />
        }
        {
            isLoading  && <Loading />
        }
    </div>);
};
