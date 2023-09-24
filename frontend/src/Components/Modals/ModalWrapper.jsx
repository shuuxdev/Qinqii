import { Modal } from "antd"

export const ModalWrapper = ({ handleClose, open, children, className }) => {

    return (
        <Modal className={className}  open={open} footer={null} onCancel={handleClose}>
                {children}
        </Modal>

    )

}