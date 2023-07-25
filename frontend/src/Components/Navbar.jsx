import React from "react";
import { BsPlusSquare, BsSearch } from 'react-icons/bs';
import { useSelector } from "react-redux";
import Color from '../Enums/Color';
import { Avatar, WebFavicon } from './CommonComponent.jsx';


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
    return (
        <div className={`flex bg-[${Color.Background}] p-[0px_20px] rounded-[50px] items-center lg:w-[400px] justify-center`}>
            <div className={` bg-[${Color.Background}] `}>
                <BsSearch></BsSearch>
            </div>
            <input type="text" className={` p-[10px]  focus:outline-none  w-full bg-[${Color.Background}]`} placeholder="Search" />

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
        <div className={`bg-[${Color.White}] w-full`}>
            <div className="w-full max-w-[1300px] m-[0_auto] flex items-center justify-between ">
                <WebFavicon></WebFavicon>
                <div className={`p-[10px] w-[600px] flex gap-[10px]`}>
                    <Searchbar></Searchbar>
                    <CreateGroup></CreateGroup>
                    <Customization></Customization>
                </div>
            </div>
        </div>
    )
}
export default Navbar