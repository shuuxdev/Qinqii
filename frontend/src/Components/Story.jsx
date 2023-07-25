import { faker } from '@faker-js/faker';
import React from "react";
import {
    BsPlusLg
} from 'react-icons/bs';
import Color from '../Enums/Color';
import { Avatar, Text } from './CommonComponent.jsx';
const avatar = require('../Assets/avatar.jpg')


export function StoryItem({ def, story: { image, avatar } }) {

    const BorderAround = ({ children }) =>
        <div className="z-40 absolute rounded-[9px] border-[2px] p-[4px] border-white border-solid left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">

            {children}
        </div>
    return (
        <div className="relative overflow-hidden rounded-[10px] m-2 flex-[1] h-[220px] ">
            <div className="opacity-[0.5] bg-black z-20 left-0 right-0 bottom-0 top-0 absolute"></div>
            {def ?

                (<BorderAround>
                    <div className={`flex justify-center bg-[${Color.White}] p-[7px]  rounded-[5px] items-center`}>
                        <BsPlusLg color={Color.Primary} size={12} fontWeight={800}></BsPlusLg>
                    </div>
                </BorderAround>) :
                <div className="absolute left-[15%] top-[15%] z-30  border-[2px] border-white rounded-[12px]">
                    <Avatar src={avatar} sz={35} />
                </div>
            }
            <img src={image} alt="" className="object-cover h-full z-10 relative" />
            <div className="z-30 absolute bottom-2 left-[50%] translate-x-[-50%]">
                <Text color={Color.White} bold>Shuu</Text>
            </div>
        </div>
    )
}
export function Stories() {
    const stories = Array(4).fill().map((item) => ({ image: faker.image.url(), avatar: faker.image.avatar() }));
    return (
        <div className="flex">
            <StoryItem def={true} story={{ image: avatar }}></StoryItem>
            {
                stories.map((story, i) => (
                    <StoryItem key={i} story={story}></StoryItem>
                ))
            }
        </div>
    )
}