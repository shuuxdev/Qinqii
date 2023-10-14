import { QinqiiImage } from "./QinqiiImage.jsx";

export const QinqiiPostVideo = ({ src, onClick, ...videoProps }) => {
    return (
        <div onClick={onClick} className='overflow-hidden rounded-[10px] w-full h-full aspect-video'>
            {
                src ?
                    <>
                        {
                            src.includes('http') ?
                                <video {...videoProps} src={src} className='w-full  object-cover h-full'></video>
                                :
                                <video {...videoProps} src={`/assets/${src}`} className='w-full object-cover h-full'></video>
                        }
                    </>
                    : <QinqiiImage src={'https://via.placeholder.com/500x500.png?text=Image+Not+Available'} className='w-full  object-cover h-full' />

            }

        </div>
    );
};