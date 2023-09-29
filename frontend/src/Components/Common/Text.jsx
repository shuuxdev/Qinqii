import { twMerge } from 'tailwind-merge';
import Color from '../../Enums/Color';

export const Text = ({ style, children, color, fontSize, className }) => {
    const c = twMerge(`text-[${color ?? Color.Text}] text-[${(fontSize ?? 16)}px] font-normal`, className);
    return (
        (<span style={{ wordBreak: 'break-word', fontFamily: 'Nunito', ...style }} className={c}>
            {children}
        </span>)

    );
};