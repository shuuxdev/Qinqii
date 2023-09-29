import { useNavigate } from 'react-router-dom';

export function Avatar({ sz, src, border, user_id }) {
    const navigate = useNavigate();
    return (
        <div className={`overflow-hidden rounded-[50%] hover:border-red-500 hover:border-2 box-border hover:border-solid cursor-pointer`} style={{
            height: sz ? sz : 43, width: sz ? sz : 43, border: border,
        }} onClick={() => navigate(`/user/${user_id}`)}>
            {
                src.includes('http') ?
                    <img src={src} className='w-full object-cover h-full'></img>
                    :
                    <img src={`/assets/${src}`} className='w-full object-cover h-full'></img>
            }
        </div>

    );
}