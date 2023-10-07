import React from 'react';
import { BsPlusSquare } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import Color from '../../Enums/Color';
import '../../SCSS/Navbar.scss';
import { NotificationDropdown } from '../Notification/NotificationDropdown.jsx';
import { WebFavicon } from './WebFavicon';
import { Avatar } from './Avatar';
import { MessageDropdown } from '../MessageDropdown/MessageDropdown';
import { Searchbar } from '../Search/Searchbar';

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
        <div className={`navbar relative bg-[${Color.White}] w-full`}>
            <div className="w-full container gap-[10px] p-[20px] m-[0_auto] flex items-center justify-between ">
                <WebFavicon></WebFavicon>
                <Searchbar></Searchbar>
                <div className='flex gap-[20px]'>
                    <MessageDropdown/>
                    <NotificationDropdown />
                </div>

            </div>
        </div>
    )
}
export default Navbar