export function QinqiiImage({ src, className }) {
    return (
        <div className='rounded-[10px] overflow-hidden'>
            {
                src.includes('http') ?
                    <img src={src} className={className}></img>
                    :
                    <img src={`/assets/${src}`} className={className}></img>
            }
        </div>
    );

}