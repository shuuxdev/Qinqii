import React from "react";
import { useSelector } from "react-redux";
import Color from '../Enums/Color';
import { Avatar, Text } from './CommonComponent.jsx';
import Loading from "./Loading.jsx";


export function Card() {

    const user = useSelector(state => state.profile)

    return (
        <div className={`mt-2 mb-2 flex bg-[${Color.White}] justify-start items-center p-[20px] rounded-[10px]`}>
            {
                user.id != 0 ?
                    <>
                        <div className="flex-[2.5]">
                            <Avatar src={user.avatar}></Avatar>
                        </div>
                        <div className="flex flex-col flex-[9.5]">
                            <Text bold>{user.name}</Text>
                            <Text>ADMIN</Text>
                        </div>
                    </>
                    : <Loading size={40}></Loading>
            }

        </div>
    )
}
