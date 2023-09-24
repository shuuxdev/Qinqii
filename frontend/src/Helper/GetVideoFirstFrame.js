
export const getVideoFirstFrame = async (file, resultType) => {
    const videoObjectURL = URL.createObjectURL(file);

    const videoElement = document.createElement('video');
    videoElement.src = videoObjectURL;

    let result = ''; // Initialize thumbnailDataUrl here

    await new Promise((resolve) => {
        videoElement.onloadedmetadata = () => {
            videoElement.currentTime = 1;

            videoElement.onseeked = async () => {
                const thumbnailCanvas = document.createElement('canvas');
                const ctx = thumbnailCanvas.getContext('2d');

                const aspectRatio = videoElement.videoWidth / videoElement.videoHeight;
                const thumbnailWidth = 200;
                const thumbnailHeight = thumbnailWidth / aspectRatio;

                thumbnailCanvas.width = thumbnailWidth;
                thumbnailCanvas.height = thumbnailHeight;

                ctx.drawImage(videoElement, 0, 0, thumbnailWidth, thumbnailHeight);
                if(resultType === "dataurl")
                    return resolve(thumbnailCanvas.toDataURL('image/jpeg')); // image/jpeg works in Chrome.
                else if(resultType === "blob")
                {
                    thumbnailCanvas.toBlob((blob) => {
                        resolve(result);
                        result = blob; // Convert Blob to Object URL
                        URL.revokeObjectURL(videoObjectURL);
                    }, 'image/jpeg');
                }
                else
                thumbnailCanvas.toBlob((blob) => {
                    result = URL.createObjectURL(blob); // Convert Blob to Object URL
                    URL.revokeObjectURL(videoObjectURL);
                    resolve(result);
                }, 'image/jpeg');
            };

            videoElement.currentTime = 0;
        };
    });
    console.log(result)
    return result;

}