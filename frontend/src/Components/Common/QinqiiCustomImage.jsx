export function QinqiiCustomImage({ src, className }) {
    console.log(
        src
    );
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