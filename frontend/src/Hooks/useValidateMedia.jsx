import { AntdNotificationContext } from '../App';
import { useContext } from 'react';

export const useValidateMedia = (files) => {
    const notify = useContext(AntdNotificationContext);
    const validateMedia = (files) => {
        let ok = true;
        files.forEach((file) => {
            if(!(file.type.includes("video") || file.type.includes("image"))) {
                notify.open({
                    message: 'Chỉ có thể upload các định dạng ảnh và video như jpg, png, mp4',
                    type: 'error',
                    placement: 'bottomLeft',
                    duration: 5
                });
                ok = false;
            }
        })
        ok = false;
        return ok;
    }
    return [validateMedia];
}