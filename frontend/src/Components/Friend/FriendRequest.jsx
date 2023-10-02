import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Color from '../../Enums/Color';
import { ACCEPT, REJECT, updateFriendStatusAsync } from "../../Reducers/FriendRequests.js";
import { Header } from '../Common/Header';
import { Button } from '../Common/Button';
import { Text } from '../Common/Text';
import { Avatar } from '../Common/Avatar';

export const Request = ({ request: { name, sent_at, avatar, user_id, id } }) => {
    const dispatch = useDispatch();
    return (
        <div className={`flex flex-col w-full items-center justify-center rounded-[10px] mb-2  p-[20px] bg-[${Color.White}] `}>
            <div className="flex w-full flex-row items-center justify-between mb-[20px]">
                <div className="flex-[2.5]">
                    <Avatar src={avatar} user_id={user_id} />
                </div>
                <div className="flex-[9.5]">
                    <Text> <Text bold>{name}</Text> has sent you a friend request</Text>
                </div>
            </div>
            <div className="flex w-full flex-row items-center justify-between">
                <div>
                    <Button onClick={() => dispatch(updateFriendStatusAsync({ id, status: ACCEPT }))}>
                        Accept
                    </Button>
                </div>
                <Button outline onClick={() => dispatch(updateFriendStatusAsync({ id, status: REJECT }))}>
                    Decline
                </Button>
            </div>
        </div>
    )
}

export function FriendRequest() {
    const requests = useSelector(state => state.friendRequests)

    return (
        <div className="flex flex-col">
            <Header title="REQUEST" count={requests.length}></Header>
            {
                requests.map(request => (
                    <Request key={request.id} request={request}></Request>
                ))
            }
        </div>
    )
}




