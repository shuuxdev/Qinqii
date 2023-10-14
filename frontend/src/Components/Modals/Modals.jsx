import { MediaViewerModal } from "./MediaViewerModal.jsx";
import { ModalType } from '../../Enums/Modal.js'
import { useSelector } from 'react-redux';
import { StoryUploadModal } from './StoryUploadModal';
import { ShareModal } from './ShareModal';
import { UploadAvatarModal } from './UploadAvatarModal';
export const Modals = () => {

    const { modalType, modalProps } = useSelector(state => state.modals);

    return (
        <>
            {
                modalType === ModalType.MEDIA &&
                <MediaViewerModal {...modalProps} />
            }
            {
                modalType === ModalType.STORY_UPLOAD &&
                <StoryUploadModal />
            }
            {
                modalType === ModalType.SHARE &&
                <ShareModal />
            }
            {
                modalType === ModalType.UPLOAD_AVATAR &&
                <UploadAvatarModal {...modalProps} />
            }
        </>
    )
}

