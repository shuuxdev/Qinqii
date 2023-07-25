import { faker } from "@faker-js/faker";
import React from "react";
import {
    BsFillStarFill
} from 'react-icons/bs';
import { FaSignInAlt } from "react-icons/fa";
import Color from '../Enums/Color';
import { Avatar, Button, Text } from './CommonComponent.jsx';

const g = require('../Assets/g.png')

function GroupItem({ content }) {

    return (
        <div className={`p-[20px] flex flex-col gap-[15px] bg-[${Color.White}] rounded-[10px]`}>
            <div className="relative overflow-hidden   w-full h-[170px]">
                <div className="opacity-[0.5] rounded-[10px] bg-black  left-0 right-0 bottom-0 top-0 absolute z-[15]"></div>
                <div className="absolute left-[9%] top-[9%] z-30  border-[2px] border-white rounded-[13px]"><Avatar src={faker.image.avatar()} sz={35} /></div>
                <img src={g} alt="" className="object-cover rounded-[10px] w-full h-full z-10 relative" />
                <div className="z-30 absolute bottom-2 left-[50%] translate-x-[-50%]">
                    <Text color={Color.White} bold>
                        {content}
                    </Text>
                </div>
            </div>
            <div>

                <div className="flex w-full gap-[10px] flex-row items-center justify-between">

                    <Button>
                        Join
                        <FaSignInAlt></FaSignInAlt>
                    </Button>
                    <Button outline>
                        Follow
                        <BsFillStarFill></BsFillStarFill>
                    </Button>

                </div>
            </div>
        </div>

    )
}
export function GroupRecommend() {
    return (
        <div className="flex gap-[10px] m-[20px_0px] flex-col">
            <GroupItem content={"Rớt môn tin thì làm gì ?"}></GroupItem>
            <GroupItem content={"How to bớt nhạt, bắt chuyện crush auto đổ"}></GroupItem>
            <GroupItem></GroupItem>
        </div>
    )
}
