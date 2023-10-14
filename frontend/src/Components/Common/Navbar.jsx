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
import { BiLogOut } from 'react-icons/bi';
import Cookies from 'react-cookie/cjs/Cookies.js';



const Navbar = () => {
    const Signout = () => {
        let cookies = new Cookies();
        cookies.remove('Token');
        window.location.reload();
    }
    return (
        <div className={`navbar relative bg-[${Color.White}] w-full`}>
            <div className="w-full container gap-[10px] p-[20px] m-[0_auto] flex items-center justify-between ">
                <WebFavicon></WebFavicon>
                <Searchbar></Searchbar>
                <div className='flex gap-[20px]'>
                    <MessageDropdown/>
                    <NotificationDropdown />
                    <div onClick={Signout}>
                        <BiLogOut className='hover:text-red-500 cursor-pointer' size={22}/>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default Navbar