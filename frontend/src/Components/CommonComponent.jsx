import { AnimatePresence, motion } from "framer-motion";
import { createContext, useContext, useState } from 'react';
import { FiAtSign } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { twMerge } from "tailwind-merge";
import Color from '../Enums/Color';



const DropdownContext = createContext();




export const DropdownItem = ({ children, cb }) => {
    const { handleItemClick } = useContext(DropdownContext); // this one is default handler for dropdown item
    const Callback = () => {
        handleItemClick()
        cb();//this one is additional function
    }
    return (
        <div className={`p-[10px] relative z-10 cursor-pointer hover:bg-[#E53935] group`}
            onClick={Callback}>
            <div className=" flex justify-between items-center ">
                {children}
            </div>
        </div>

    )
}

export const DropdownMenu = ({ children, TriggerElement, isOpen, handleItemClick }) => {

    return (

        <div className="relative flex flex-col">
            <TriggerElement />
            <DropdownContext.Provider value={{ handleItemClick }}>
                <AnimatePresence >
                    {
                        isOpen &&
                        <motion.div initial={{ opacity: 0, y: '-30px' }}
                            animate={{ opacity: 1, y: "10px" }}
                            exit={{ opacity: 0, y: "0px" }}
                        >

                            <div className="qinqii-thin-shadow z-11 absolute  w-[200px] bg-white overflow-hidden rounded-[10px]">
                                <div className="p-[10px]">
                                    {children}
                                </div>
                            </div>
                        </motion.div>
                    }
                </AnimatePresence>
            </DropdownContext.Provider>

        </div >
    )
}
export const UploadImage = ({ src, cb: Remove }) => {
    const [hover, setHover] = useState(false);
    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={`border-[2px] border-blue-300 border-solid rounded-[10px] overflow-hidden relative aspect-square`}
        >
            <div
                style={{ display: hover ? 'initial' : 'none' }}
                className=' absolute inset-0 bg-black opacity-10'
            ></div>
            <IoMdClose
                style={{ display: hover ? 'initial' : 'none' }}
                onClick={Remove}
                color='red'
                size={24}
                className=' cursor-pointer absolute top-[10px] right-[10px]'
            >
            </IoMdClose>
            {src.includes("http") ?
                <img src={src} className="w-full  object-cover h-full"></img>
                :
                <img src={`/assets/${src}`} className="w-full object-cover h-full"></img>}
        </div>
    );
};

export function Avatar({ sz, src, border }) {
    return (
        <div className={`overflow-hidden rounded-[50%] `} style={{
            height: sz ? sz : 43, width: sz ? sz : 43, border: border
        }}>
            {
                src.includes("http") ?
                    <img src={src} className="w-full object-cover h-full"></img>
                    :
                    <img src={`/assets/${src}`} className="w-full object-cover h-full"></img>
            }
        </div>

    )
}
export const Text = ({ style, children, color, fontSize, className }) => {
    const c = twMerge(`text-[${color ?? Color.Text}] text-[${(fontSize ?? 16)}px] font-normal`, className);
    return (
        (<span style={{ wordBreak: 'break-word', fontFamily: "Nunito", ...style }} className={c}>
            {children}
        </span>)

    )
}

export function Button({ children, color, outline, background, onClick, className }) {
    let c = twMerge(`flex gap-[5px] text-[${color ?? Color.White}] text-[14px] cursor-pointer rounded-[10px] justify-center items-center p-[10px_28px] bg-[${background ? background : Color.Primary}]`, className)
    let b = twMerge(`flex  gap-[5px] text-[${color ?? Color.Text}] text-[14px] cursor-pointer rounded-[10px]  justify-center items-center p-[10px_28px] bg-[${background ? background : Color.White}] border-[1px] border-solid border-gray-400`, className)
    return (
        !outline ?
            <div onClick={onClick} className={c}>
                {children}
            </div>
            :
            <div onClick={onClick} className={b}>
                {children}
            </div>

    )
}
export function Header({ title, count }) {
    return (

        <div className="flex justify-between items-center w-full p-[20px_20px]">
            <div className={`text-[13px] font-bold text-[${Color.Title}]`}>{title}</div>
            <div className={`flex justify-center items-center text-[11px] w-[25px]  h-[25px] rounded-[10px] bg-[${Color.Primary}] text-[${Color.White}]`}>{count}</div>
        </div>
    )
}

export function QinqiiPostImage({ src }) {
    return (
        <div className="overflow-hidden rounded-[10px] w-full h-full aspect-video">
            {
                src.includes("http") ?
                    <img src={src} className="w-full  object-cover h-full"></img>
                    :
                    <img src={`/assets/${src}`} className="w-full object-cover h-full"></img>
            }
        </div>
    )

}
export const QinqiiPostVideo = ({ src, ...videoProps }) => {
    return (
        <div className="overflow-hidden rounded-[10px] w-full h-full aspect-video">
            {
                src.includes("http") ?
                    <video {...videoProps} src={src} className="w-full  object-cover h-full"></video>
                    :
                    <video {...videoProps} src={`/assets/${src}`} className="w-full object-cover h-full"></video>
            }
        </div>
    )
}
export function QinqiiImage({ src, className }) {
    return (
        <div className="rounded-[10px] overflow-hidden">
            {
                src.includes("http") ?
                    <img src={src} className={className}></img>
                    :
                    <img src={`/assets/${src}`} className={className}></img>
            }
        </div>
    )

}
export function QinqiiCustomImage({ src, className }) {
    return (
        < >
            {
                src.includes("http") ?
                    <img src={src} className={className}></img>
                    :
                    <img src={`/assets/${src}`} className={className}></img>
            }
        </>
    )

}
export const WebFavicon = () => {
    return (
        <div className="flex gap-[10px] items-center">

            <div className={`flex items-center justify-center p-[10px] bg-[${Color.LightPrimary}] gap-[10px] rounded-[10px] overflow-hidden`}>
                <FiAtSign color={Color.Primary} size={24}></FiAtSign>
            </div>
            <div>
                <Text bold fontSize={21}> Qinqii</Text>
            </div>
        </div>
    )
}
export const ActiveDot = () => {
    return (
        <div className="rounded-full bg-green-300 h-[7px] w-[7px]"></div>
    )
}
export const InActiveDot = () => {
    return (
        <div className="rounded-full bg-gray-300 h-[7px] w-[7px]"></div>
    )
}