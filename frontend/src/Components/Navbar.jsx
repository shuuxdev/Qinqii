import React, { useState } from "react";
import { BsPlusSquare, BsSearch } from 'react-icons/bs';
import { useSelector } from "react-redux";
import Color from '../Enums/Color';
import { Avatar, Text, WebFavicon } from './CommonComponent.jsx';
import { AiOutlineBell } from 'react-icons/ai'
import { AnimatePresence, motion } from "framer-motion";
import '../SCSS/Navbar.scss'
import { twMerge } from "tailwind-merge";
import { useRef } from "react";
import { useEffect } from "react";
import { useLayoutEffect } from "react";
import { NotificationDropdown } from "./Notification/NotificationDropdown.jsx";
import { useDebounce } from '../Hooks/useDebounce';
import { useAxios } from '../Hooks/useAxios';
import { isEmpty } from 'lodash';
import { Button, Input } from 'antd';
export function CreateGroup() {
    return (
        <div>
            <div className={`flex p-[10px] bg-[${Color.Primary}]  text-white rounded-[10px] gap-[10px] justify-center items-center`}>
                Create
                <BsPlusSquare size={20} ></BsPlusSquare>
            </div>
        </div>
    )
}


export function Searchbar() {
    const [keyword, setKeyword] = useState();
    const debounce = useDebounce(keyword, 500);
    const axios = useAxios();
    const [founded, setFounded] = useState([]);
    const findPeopleByName= async (name) => {
        const [data,error] = await axios.GET_PeopleWithName(name);
        if(!error)
        {
            setFounded(data);
        }
    }
    useEffect(() => {
            findPeopleByName(debounce)
    },[debounce])
    return (
        <div  className={`relative flex bg-[${Color.Background}] p-[0px_20px] rounded-[50px] items-center w-[400px] justify-center`}>
            <div className={` bg-[${Color.Background}] `}>
                <BsSearch></BsSearch>
            </div>
            <input onChange={(e) => setKeyword(e.target.value)}  type="text" className={` p-[10px]  focus:outline-none  w-full bg-[${Color.Background}]`} placeholder="Search" />
            <AnimatePresence>
                {
                    founded.length > 0 &&
                    <motion.div initial={{opacity: 0, y: '-50px'}} animate={{opacity: 1, y: 0}} exit={{opacity: 0}} className='absolute z-[200] left-0 top-[50px] flex flex-col gap-[10px] p-[15px] bg-white qinqii-thin-shadow w-full rounded-[10px]  '>
                        {
                            founded.map(people => (
                                <div className="flex items-center gap-[10px] my-[3px]">
                                    <div className="shrink-0">
                                        <Avatar sz={32} src={people.avatar} />

                                    </div>
                                    <div className="grow">
                                        <Text>{people.name}</Text>
                                    </div>
                                </div>
                            ))
                        }
                    </motion.div>
                }
            </AnimatePresence>
        </div>
    )
}
export function Customization() {
    const avatar = useSelector(state => state.profile.avatar)
    return (
        <div>
            <Avatar src={avatar}></Avatar>
        </div>
    )
}


const Navbar = () => {
    return (
        <div className={`relative bg-[${Color.White}] w-full`}>
            <div className="w-full max-w-[1300px] m-[0_auto] flex items-center justify-between ">
                <WebFavicon></WebFavicon>
                <div className={`p-[10px] w-[600px] flex items-center gap-[10px]`}>
                    <Searchbar></Searchbar>
                    <NotificationDropdown />
                    <Customization></Customization>
                </div>
            </div>
        </div>
    )
}
export default Navbar