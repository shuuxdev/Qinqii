import { BsThreeDots } from 'react-icons/bs'
import Color from '../../Enums/Color.js'
import { useNavigate } from 'react-router-dom'
import { NotificationDropdownContext } from './NotificationDropdown.jsx'
import React, { useContext, useState } from 'react';
import { Avatar } from '../Common/Avatar';
import { DropdownMenu } from '../Common/DropdownMenu';
import { Text } from '../Common/Text';
import { AiOutlineDelete } from 'react-icons/ai';
import { NotSeenDot } from '../Common/NotSeenDot';
import { useDispatch, useSelector } from 'react-redux';
import { markAsRead, markAsReadThunk } from '../../Reducers/Notifications';
import { FriendRequest, Request } from '../Friend/FriendRequest';

const data = {
  "id": 47,
  "user_id": 1,
  "type": "LIKE",
  "params": {
    "comment_id": "134",
    "emoji": "🤩"
  },
  "timestamp": "09/05/2023 08:23:00",
  "actor_id": 1,
  "actor_name": "shuu leo",
  "actor_avatar": "shuu.jpg",
  "read": false
}
export function NotificationItem({ children, data, index }) {
  const TriggerSize = 18;
  const navigate = useNavigate();
  const { CCIDOfNotification, setCCIDOfNotification } = useContext(NotificationDropdownContext);
  const zIndex = 100 - index;
  const ToggleDropdown = () => {
    setCCIDOfNotification(CCIDOfNotification ? null : data.id);
  }
  const dispatch = useDispatch()
  const CloseDropdown = () => {
    setCCIDOfNotification(null);
  }
  const Trigger = () => (
    <div  onClick={ToggleDropdown}  className={`p-[10px] opacity-0 hover:opacity-[1]  self-end w-fit rounded-full cursor-pointer hover:bg-[${Color.White}]`}>
      <BsThreeDots size={TriggerSize}></BsThreeDots>
    </div>

  )
  const handleClick = () => {
    dispatch(markAsReadThunk(data.id));
    navigate(`/user/${data.actor_id}`, {replace: true})
  }
  return (
    <div className="notification_item">
      <div className="shrink-0">
        <Avatar sz={36} src={data.actor_avatar} user_id={data.actor_id}/>
      </div>
      <div className="grow flex gap-[10px]">
        <div onClick={handleClick} className="flex-grow relative">
          {children}

        </div>
        <div style={{zIndex}} className="shrink-0 relative">
          <DropdownMenu  isOpen={CCIDOfNotification === data.id} handleItemClick={CloseDropdown}  TriggerElement={Trigger}>
            <div className="p-[10px] relative cursor-pointer hover:bg-[#E53935] group">
              <Text className='w-fit group-hover:text-white'> Xóa bình luận</Text>
              <AiOutlineDelete className='group-hover:text-white' />
            </div>
          </DropdownMenu>
        </div>
      </div>
      {
          data.read === false &&
          <div className='absolute right-[20px]'>
            <NotSeenDot />
          </div>
      }

    </div>
  )
}
export const FriendRequestNotificationItem = ({ data, index }) => {
  const requestPayload = useSelector(state => state.friendRequests).find(r => r.id == data.params.request_id);
  return <NotificationItem index={index} data={data}>
    <span className="text-sm font-semibold">{data.actor_name} đã gửi cho bạn một lời mời kết bạn</span>
    <div className="text-xs text-gray-500">{data.timestamp}</div>
  </NotificationItem>
}
export const CommentNotificationItem = ({ data, index }) => {
  return <NotificationItem index={index} data={data}>
    <span className="text-sm font-semibold">{data.actor_name} đã bình luận trong một bài viết của bạn</span>
    <div className="text-xs text-gray-500">{data.timestamp}</div>
  </NotificationItem>
}
export const LikePostNotificationItem = ({ data, index }) => {
  return <NotificationItem index={index} data={data}>
    <span className="text-sm font-semibold">{data.actor_name} đã thả cảm xúc về bài viết của bạn</span>
    <div className="text-xs text-gray-500">{data.timestamp}</div>
  </NotificationItem>
}
export const FriendRequestAcceptedNotificationItem = ({ data, index }) => {
  return <NotificationItem index={index} data={data}>
    <span className="text-sm font-semibold">{data.actor_name} đã chấp nhận lời mời kết bạn của bạn</span>
    <div className="text-xs text-gray-500">{data.timestamp}</div>
  </NotificationItem>
}
export const LikeCommentNotificationItem = ({ data }) => {
  return <NotificationItem data={data}>
    <span className="text-sm font-semibold">{data.actor_name} đã thả cảm xúc về bình luận của bạn </span>
    <div className="text-xs text-gray-500">{data.timestamp}</div>
  </NotificationItem>
}
const MentionNotificationItem = ({ data }) => {

}
const FollowNotificationItem = ({ data }) => {

}
const ReactionNotificationItem = ({ data }) => {

}
const ShareNotificationItem = ({ data }) => {

}
const ReplyNotificationItem = ({ data }) => {

}



