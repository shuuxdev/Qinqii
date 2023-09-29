import Color from '../../Enums/Color';

export function Header({ title, count }) {
    return (

        <div className='flex justify-between items-center w-full p-[20px_20px]'>
            <div className={`text-[13px] font-bold text-[${Color.Title}]`}>{title}</div>
            <div
                className={`flex justify-center items-center text-[11px] w-[25px]  h-[25px] rounded-[10px] bg-[${Color.Primary}] text-[${Color.White}]`}>{count}</div>
        </div>
    );
}