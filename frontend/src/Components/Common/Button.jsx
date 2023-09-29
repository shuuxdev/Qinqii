import { twMerge } from 'tailwind-merge';
import Color from '../../Enums/Color';

export function Button({ children, color, outline, background, onClick, className }) {
    let c = twMerge(`flex gap-[5px] text-[${color ?? Color.White}] text-[14px] cursor-pointer rounded-[10px] justify-center items-center p-[10px_28px] bg-[${background ? background : Color.Primary}]`, className);
    let b = twMerge(`flex  gap-[5px] text-[${color ?? Color.Text}] text-[14px] cursor-pointer rounded-[10px]  justify-center items-center p-[10px_28px] bg-[${background ? background : Color.White}] border-[1px] border-solid border-gray-400`, className);
    return (
        !outline ?
            <div onClick={onClick} className={c}>
                {children}
            </div>
            :
            <div onClick={onClick} className={b}>
                {children}
            </div>

    );
}