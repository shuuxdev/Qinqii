import React, { useContext, useState } from 'react';
import { Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { hideModal } from '../../Reducers/Modals';
import { useAxios } from '../../Hooks/useAxios';
import { getVideoFirstFrame } from '../../Helper/GetVideoFirstFrame';
import { PreviewStory } from '../Story/Story';
import { AntdNotificationContext } from '../../App';
import { useValidateMedia } from '../../Hooks/useValidateMedia';
import FileUploader from '../Upload/FileUploader';

export function StoryUploadModal(props) {
    const dispatch = useDispatch();
    const handleClose = () => {
        dispatch(hideModal());
    }
    const axios = useAxios();
    const [files, setFiles] = useState([]);
    const [validateMedia] = useValidateMedia();

    const handleFileChange = (files) => {
        let ok = true;
        ok = validateMedia(files);
        console.log(ok);
        if (!ok) return;

        setFiles(files)
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
            notify.open({
                message: error.response.data.Message,
                type: 'error',
                duration: 5,
                placement: 'bottomLeft'
            })
        }
        else {
            notify.open({
                message: 'Upload story thành công',
                type: 'success',
                duration: 5,
                placement: 'bottomLeft'
            })
        }
        dispatch(hideModal());

    }
    return (
        <Modal open={true} className='story-upload-modal' onCancel={handleClose} onOk={handleUpload} okButtonProps={{className: 'bg-blue-500'}}>
            <div className='flex flex-col    w-full justify-center items-center'>
                <FileUploader handleFileChange={handleFileChange}/>
                {/*<input onChange={handleFileChange} multiple={true} type='file' accept='video/*,image/*' />*/}
                {
                    frames.length > 0 &&
                    <PreviewStory frames={frames} />
                }
            </div>
        </Modal>
    );
}

