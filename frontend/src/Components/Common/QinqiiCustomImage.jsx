export function QinqiiCustomImage({ src, className }) {
    if (!src) src = 'https://via.placeholder.com/500x500.png?text=Image+Not+Available';
    return (
        <>
            {
                src.includes('http') ?
                    <img src={src} className={className}></img>
                    :
                    <img src={`/assets/${src}`} className={className}></img>
            }
        </>
    );

}