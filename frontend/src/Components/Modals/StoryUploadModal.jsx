import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { hideModal } from '../../Reducers/Modals';
import { useAxios } from '../../Hooks/useAxios';
import { getVideoFirstFrame } from '../../Helper/GetVideoFirstFrame';
import { ShowNotification } from '../../Reducers/UI';
import { Severity } from '../../Enums/FetchState';
import { PreviewStory } from '../Story/Story';
import { UploadImage } from '../Common/UploadImage';
import { AntdNotificationContext } from '../../App';
import { useValidateMedia } from '../../Hooks/useValidateMedia';

export function StoryUploadModal(props) {
    const dispatch = useDispatch();
    const handleClose = () => {
        dispatch(hideModal());
    }
    const axios = useAxios();
    const [files, setFiles] = useState([]);
    const [validateMedia] = useValidateMedia();

    const handleFileChange = (e) => {
        let ok = true;
        ok = validateMedia([...e.target.files]);
        if(!ok) return;
        setFiles([...e.target.files])
    }

    const frames = files.map((file, index) => {
          return ({
            id: index,
            frame_url: URL.createObjectURL(file),
            frame_type: file.type.includes('video') ? 'VIDEO' : 'IMAGE',
              duration: 15
          })
    })
    const notify = useContext(AntdNotificationContext);
    const handleUpload = async () => {

        const videos = files.filter(f => f.type.includes('video'));
        const images = files.filter(f => f.type.includes('image'));
        const thumbnails = await Promise.all(videos.map(async (video) => getVideoFirstFrame(video, "blob")))
        const [statusCode, error] = await axios.POST_CreateStory(videos, thumbnails, images);
        if (error) {
            console.log(error);
        }
        else {
            dispatch(ShowNotification({content: 'Story uploaded successfully', severity: Severity.SUCCESS }));
            dispatch(hideModal());
        }
    }
    return (
        <Modal open={true} className='story-upload-modal' onCancel={handleClose} onOk={handleUpload}>
            <div className='flex flex-col    w-full justify-center items-center'>

                <input onChange={handleFileChange} multiple={true}  type='file' accept='video/*,image/*' />
                {
                    frames.length > 0 &&
                    <PreviewStory frames={frames}/>

                }
            </div>
        </Modal>
    );
}

