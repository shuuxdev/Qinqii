import { AntdNotificationContext } from '../App';
import { useContext } from 'react';

export const useValidateMedia = (option = {excludeVideo: false}) => {
    const notify = useContext(AntdNotificationContext);
    const validateMedia = (files) => {
        let ok = true;
        console.log(files);
        files.forEach((file) => {
            let isVideo = file.type.includes("video/mp4");
            let isImage = file.type.includes("image/png") || file.type.includes("image/jpeg") || file.type.includes("image/jpg");
            if (!( (!option.excludeVideo && isVideo) || isImage)) {
                notify.open({
                    message: 'Chỉ có thể upload các định dạng ảnh và video như jpg, png, mp4',
                    type: 'error',
                    placement: 'bottomLeft',
                    duration: 5
                });
                ok = false;
            }
        })
        return ok;
    }
    return [validateMedia];
}