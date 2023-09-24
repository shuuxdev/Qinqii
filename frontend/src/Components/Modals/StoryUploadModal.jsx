import React from 'react';
import { Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { hideModal } from '../../Modules/Modals';

export function StoryUploadModal(props) {
    const dispatch = useDispatch();
    const handleClose = () => {
        dispatch(hideModal());
    }
    return (
        <Modal open={true} className='story-upload-modal' onCancel={handleClose} footer={null}>
            {

            }
        </Modal>
    );
}

