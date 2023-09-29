export const QinqiiCustomVideo = ({ src, ...videoProps }) => {
    return (
        <>
            {
                src.includes('http') ?
                    <video  {...videoProps} src={src}></video>
                    :
                    <video {...videoProps} src={`/assets/${src}`}></video>
            }
        </>
    );
};