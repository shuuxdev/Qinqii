import { ModalWrapper } from "./ModalWrapper.jsx"
import '../../SCSS/Modals.scss'
export const MediaViewerModal = ({ handleClose, open }) => {

    return (
        <ModalWrapper open={open} handleClose={handleClose}>
            <ViewerPane />
            <DetailPane />
        </ModalWrapper>
    )
}

const ViewerPane = () => {
    return (
        <div className="viewer-pane ">
            viewer
        </div>
    )
}
const DetailPane = () => {
    return (
        <div className="detail-pane ">
            pane
        </div>
    )
}