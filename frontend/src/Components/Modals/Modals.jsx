import { MediaViewerModal } from "./MediaViewerModal.jsx";
import { ModalType } from '../../Enums/Modal.js'
import { useSelector } from "react-redux";
export const Modals = () => {



    const { modalType: activeModal, modalProps } = useSelector(state => state.modals);

    const CloseModal = () => {
        // setActiveModal(null);
    }
    const CloseMediaViewerModal = () => {
        CloseModal()
    }
    return (
        <>
            <MediaViewerModal open={activeModal == ModalType.MEDIA} handleClose={CloseMediaViewerModal} />
        </>
    )
}

