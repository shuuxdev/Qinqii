export function QinqiiCustomImage({ src, className }) {
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