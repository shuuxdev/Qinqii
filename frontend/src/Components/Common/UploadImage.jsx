import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';

export const UploadImage = ({ src, cb: Remove }) => {
    const [hover, setHover] = useState(false);
    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={`border-[2px] border-blue-300 border-solid rounded-[10px] overflow-hidden relative aspect-square`}
        >
            <div
                style={{ display: hover ? 'initial' : 'none' }}
                className=' absolute inset-0 bg-black opacity-10'
            ></div>
            <IoMdClose
                style={{ display: hover ? 'initial' : 'none' }}
                onClick={Remove}
                color='red'
                size={24}
                className=' cursor-pointer absolute top-[10px] right-[10px]'
            >
            </IoMdClose>
            {src.includes('http') ?
                <img src={src} className='w-full  object-cover h-full'></img>
                :
                <img src={`/assets/${src}`} className='w-full object-cover h-full'></img>}
        </div>
    );
};