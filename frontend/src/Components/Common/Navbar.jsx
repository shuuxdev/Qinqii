import React, { useEffect, useRef, useState } from 'react';
import { BsPlusSquare, BsSearch } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import Color from '../../Enums/Color';
import { AnimatePresence, motion } from 'framer-motion';
import '../../SCSS/Navbar.scss';
import { NotificationDropdown } from '../Notification/NotificationDropdown.jsx';
import { useDebounce } from '../../Hooks/useDebounce';
import { useAxios } from '../../Hooks/useAxios';
import '../../SCSS/Navbar.scss';
import { WebFavicon } from './WebFavicon';
import { Text } from './Text';
import { Avatar } from './Avatar';
import { useNavigate } from 'react-router-dom';
import { MdOutlineCancel } from 'react-icons/md';
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
    const navigate = useNavigate()
    const inputRef = useRef(null);
    const findPeopleByName= async (name) => {
        const [data,error] = await axios.GET_PeopleWithName(name);
        if(!error)
        {
            setFounded(data);
        }
    }
    const handleClick = (user_id) => {
        navigate(`/user/${user_id}`);
        handleCancel()
    }
    const handleCancel = () => {
        setFounded([]);
        setKeyword("");
        inputRef.current.value = "";
    }
    useEffect(() => {
            findPeopleByName(debounce)
    },[debounce])
    return (
        <div  className={`relative px-[10px] search search-bar flex bg-[${Color.Background}] rounded-[50px] items-center`}>
            <BsSearch></BsSearch>
            <input ref={inputRef} onChange={(e) => setKeyword(e.target.value)}  type="text" className={` p-[10px]  focus:outline-none w-full bg-[${Color.Background}]`} placeholder="Search" />
            {
                founded.length > 0 && <div className='absolute right-[15px] cursor-pointer' onClick={handleCancel}>
                    <MdOutlineCancel size={18} className='text-red-400' />
                </div>

            }
            <AnimatePresence>
                {
                    founded.length > 0 &&
                    <motion.div initial={{opacity: 0, y: '-50px'}} animate={{opacity: 1, y: 0}} exit={{opacity: 0}} className='absolute z-[200] left-0 top-[50px] flex flex-col cursor-pointer p-[15px] bg-white qinqii-thin-shadow w-full rounded-[10px]  '>
                        {
                            founded.map(people => (
                                <div className={`flex items-center py-[5px] gap-[10px] my-[3px] hover:border-r-2 hover:border-blue-500 hover:border-solid hover:bg-[${Color.Background}]`} onClick={() => handleClick(people.id)}>
                                    <div className="shrink-0">
                                        <Avatar sz={32} src={people.avatar} user_id={people.id}/>

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
            <div className="w-full container gap-[10px] p-[20px] m-[0_auto] flex items-center justify-between ">
                <WebFavicon></WebFavicon>
                <Searchbar></Searchbar>
                <NotificationDropdown />
            </div>
        </div>
    )
}
export default Navbar