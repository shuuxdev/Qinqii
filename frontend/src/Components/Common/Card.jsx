import React from 'react';
import { useSelector } from 'react-redux';
import Color from '../../Enums/Color';
import Loading from './Loading.jsx';
import { Text } from './Text';
import { Avatar } from './Avatar';
import { isEmpty } from 'lodash';


export function Card() {

    const user = useSelector(state => state.user)
    return (
        <div className={`mt-2 mb-2 flex bg-[${Color.White}] justify-start items-center p-[20px] rounded-[10px]`}>
            {
                !isEmpty(user) ?
                    <>
                        <div className="flex-[2.5]">
                            <Avatar src={user.avatar} user_id={user.user_id}></Avatar>
                        </div>
                        <div className="flex flex-col flex-[9.5]">
                            <Text bold>{user.name}</Text>
                            <Text>:3</Text>
                        </div>
                    </>
                    : <Loading size={40}></Loading>
            }

        </div>
    )
}
