import React from "react";
import Color from '../Enums/Color';
import { Avatar } from './CommonComponent.jsx';


export function Message({ from, children, avatar_src }) {
    return (
        (from == "me") ? (
            <div className="relative my-[5px] flex items-center gap-[10px] min-h-[50px] w-full">
                <div className="flex pl-[20%] gap-[10px] items-start  absolute z-50 right-[10px]">
                    <div className={` rounded-[15px] text-[13px] p-[10px] bg-[${Color.Primary}] text-[${Color.White}] `}>
                        {children}
                    </div>
                    <div className="shrink-0 h-fit">
                        <Avatar src={avatar_src} circle sz={39.5}></Avatar>
                    </div>
                </div>
            </div>
        )
            :
            (
                <div className="relative my-[10px] flex items-center gap-[10px] min-h-[50px] w-full">
                    <div className="flex pr-[20%] gap-[10px] items-center absolute z-50 left-[10px]">
                        <div className="shrink-0 h-fit">
                            <Avatar src={avatar_src} circle sz={39.5}></Avatar>
                        </div>
                        <div className={` rounded-[15px] text-[13px] p-[10px] bg-[${Color.BorderGray}] text-[${Color.BoldText}] `}>
                            {children}
                        </div>
                    </div>
                </div>
            )
    )
}