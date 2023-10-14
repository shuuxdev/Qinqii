export function QinqiiPostImage({ src, onClick }) {
    if (!src) src = 'https://via.placeholder.com/500x500.png?text=Image+Not+Available';
    return (
        <div onClick={onClick} className='overflow-hidden rounded-[10px] w-full h-full aspect-video'>
            {
                src.includes('http') ?
                    <img src={src} className='w-full  object-cover h-full'></img>
                    :
                    <img src={`/assets/${src}`} className='w-full object-cover h-full'></img>
            }
        </div>
    );

}