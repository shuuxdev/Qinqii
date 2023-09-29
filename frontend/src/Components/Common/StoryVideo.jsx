import { forwardRef } from 'react';

export const StoryVideo = forwardRef((props, ref) => {
    return (
        <>
            {
                props.frame_src.includes('http') ?
                    <video ref={ref} className='w-full h-full object-cover' src={props.frame_src}></video>
                    :
                    <video ref={ref} className='w-full h-full object-cover' src={`/assets/${props.frame_src}`}></video>
            }
        </>
    );
});