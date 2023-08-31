import { Modal } from "antd"

export const ModalWrapper = ({ handleClose, open, children }) => {

    return (

        <Modal open={open} footer={null} onCancel={handleClose}>
            `           <div className="flex">
                {children}
            </div>
        </Modal>
    )

}