import React from "react";
import {
    BsCardImage, BsHouseDoor
} from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { FiSettings } from 'react-icons/fi';
import { ImProfile } from 'react-icons/im';
import Color from '../Enums/Color';
import { Text } from './CommonComponent.jsx';

export function Sidebar() {


    const Item = ({ icon, content, selected }) => {
        return <div className={"flex p-[0px_40px] " + (selected ? ` text-[${Color.Primary}] bg-[${Color.Selected}] border-l-[2px] border-solid border-[${Color.Primary}]` : '')}>
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
    return (
        <div className={`flex-col rounded-[10px] mt-3 p-[20px_0px] bg-[${Color.White}] flex w-auto bg-[${Color.White}]`}>
            <Item selected icon={<BsHouseDoor size={24} />} content="Home"></Item>
            <Item icon={<ImProfile size={24}></ImProfile>} content="People"></Item>
            <Item icon={<BsCardImage size={24} />} content="Photos"></Item>
            <Item icon={<CgProfile size={24} />} content="News Feed"></Item>
            <Item icon={<FiSettings size={24} />} content="Settings"></Item>
        </div>)
}
