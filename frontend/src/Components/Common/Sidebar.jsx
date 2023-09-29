import React, { useEffect, useState } from 'react';
import {
    BsCardImage, BsHouseDoor
} from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { FiSettings } from 'react-icons/fi';
import { ImProfile } from 'react-icons/im';
import Color from '../../Enums/Color';
import { MdGroups } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetPeopleYouMayKnowQuery } from "../../Reducers/Profile.js";
import { Text } from './Text';
import { useUserID } from '../../Hooks/useUserID';


const Tab = {
    Home: 'Home',
    Profile: 'Profile',
    People: 'Groups',
    Images: 'Images',
    Setting: 'Setting'

}
const Item = ({ icon, content, selected, onClick }) => {

    const { data, isSuccess } = useGetPeopleYouMayKnowQuery({ pageSize: 5, page: 1 });

    return <div onClick={onClick} className={"min-w-[250px] flex p-[0px_40px] " + (selected ? ` text-[${Color.Primary}] bg-[${Color.Selected}] border-l-[2px] border-solid border-[${Color.Primary}]` : '')}>
        <div className={`flex items-center w-full border-b-[1px] border-solid border-[${Color.BorderGray}] p-[20px_0px]`}>
            <div className="flex-[2.5]">
                {icon}
            </div>
            <div className="flex-[9.5]">
                <Text bold color={Color.Text}>{content}</Text>
            </div>
        </div>

    </div>
}
export function Sidebar() {

    const userId = useUserID();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(Tab.Home)
    const location = window.location;
    const RedirectTo = (url, tab) => {
        setActiveTab(tab);
        navigate(url);
    }
    useEffect(() => {
        if (location.pathname === `/`) {
            setActiveTab(Tab.Home);
        }
        if (location.pathname === `/user/${userId}`) {
            setActiveTab(Tab.Profile);
        }
        if (location.pathname === `/people`) {
            setActiveTab(Tab.People);
        }
        if (location.pathname === `/user/${userId}/images`) {
            setActiveTab(Tab.Images);
        }
        if (location.pathname === `/user/setting`) {
            setActiveTab(Tab.Setting);
        }
    }, [location.pathname]);
    return (
        <div className={`flex-col rounded-[10px] mt-3 p-[20px_0px] bg-[${Color.White}] flex w-auto bg-[${Color.White}]`}>
            <Item onClick={() => RedirectTo(`/`, Tab.Home)} selected={activeTab == Tab.Home} icon={<BsHouseDoor size={24} />} content="Home"></Item>
            <Item onClick={() => RedirectTo(`/user/${userId}`, Tab.Profile)} selected={activeTab == Tab.Profile} icon={<CgProfile size={24} />} content="Profile"></Item>
            <Item onClick={() => RedirectTo(`/people`, Tab.People)} selected={activeTab == Tab.People} icon={<MdGroups size={24}></MdGroups>} content="People"></Item>
            <Item onClick={() => RedirectTo(`/user/${userId}/images`, Tab.Images)} selected={activeTab == Tab.Images} icon={<BsCardImage size={24} />} content="Photos"></Item>
            <Item onClick={() => setActiveTab(Tab.Setting)} selected={activeTab == Tab.Setting} icon={<FiSettings size={24} />} content="Settings"></Item>
        </div>)
}
