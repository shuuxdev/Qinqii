import { BsThreeDots } from 'react-icons/bs'
import Color from '../../Enums/Color.js'
import { useNavigate } from 'react-router-dom'
import { NotificationDropdownContext } from './NotificationDropdown.jsx'
import React, { useContext, useEffect, useState } from 'react';
import { Avatar } from '../Common/Avatar';
import { DropdownMenu } from '../Common/DropdownMenu';
import { Text } from '../Common/Text';
import { AiOutlineDelete } from 'react-icons/ai';
import { NotSeenDot } from '../Common/NotSeenDot';
import { useDispatch, useSelector } from 'react-redux';
import { markAsRead, markAsReadThunk } from '../../Reducers/Notifications';
import { FriendRequest, Request } from '../Friend/FriendRequest';
import { NotificationMenu } from './NotificationMenu';
import { AntdNotificationContext } from '../../App';

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

export function NotificationItem({ children, navigateTo, data, index, additionalIconForAvatar }) {
  const TriggerSize = 18;
  const navigate = useNavigate();
  const { CCIDOfNotification, setCCIDOfNotification, setNotification } = useContext(NotificationDropdownContext);
  const zIndex = 100 - index;
  const ToggleDropdown = (target) => {
    if(target == CCIDOfNotification){
        setCCIDOfNotification(null);
    }
    else {
      setCCIDOfNotification(data.id);
    }
  }

  const handleClick = (navigateTo = `/user/${data.actor_id}`) => {
    console.log(navigateTo);
    dispatch(markAsReadThunk(data.id));
    setNotification(false);
    navigate(navigateTo, {replace: true})
  }
  const dispatch = useDispatch()
  const CloseDropdown = () => {
    setCCIDOfNotification(null);
  }
  const Trigger = () => (
    <div  onClick={() => ToggleDropdown(data.id)}  className={`p-[10px] qinqii-thin-shadow opacity-0 hover:opacity-[1]  self-end w-fit rounded-full cursor-pointer hover:bg-[${Color.White}]`}>
      <BsThreeDots size={TriggerSize}></BsThreeDots>
    </div>

  )

  return (
      <div className='relative'>
        <div className="notification_item">
          <div className="shrink-0 relative flex justify-center items-center">
            <Avatar sz={36} src={data.actor_avatar} user_id={data.actor_id} />
            <div className="absolute right-[-10%] bottom-[-20%]">
              {additionalIconForAvatar}

            </div>
          </div>
          <div className="grow flex gap-[10px] relative">
            <div style={{opacity: data.read ? 0.5 : 1}} onClick={() => handleClick(navigateTo)} className="flex-grow relative">
              {children}
            </div>

          </div>
          {
              data.read === false &&
              <div className='absolute right-[20px] top-[50%] translate-y-[-50%]'>
                <NotSeenDot />
              </div>
          }
      </div>
        <div style={{zIndex}} className="absolute top-[50%] right-[20px] translate-y-[-50%]">
          <NotificationMenu  isOpen={CCIDOfNotification === data.id} handleItemClick={CloseDropdown}  TriggerElement={Trigger}>

          </NotificationMenu>
        </div>
    </div>
  )
}
export const CommentNotificationItem = ({ data, index }) => {

  return <NotificationItem  navigateTo={`/post/${data.params.post_id}/to/${data.params.comment_id}`}  index={index} data={data}>
    <span className="text-sm align-text-top  leading-none font-semibold">{data.actor_name} đã bình luận trong một bài viết của bạn</span>
    <div className="text-xs text-gray-500">{data.timestamp}</div>
  </NotificationItem>
}
export const FriendRequestNotificationItem = ({ data, index }) => {
  const requestPayload = useSelector(state => state.friendRequests).find(r => r.id == data.params.request_id);
  return <NotificationItem index={index} data={data}>
    <span className="text-sm align-text-top leading-none font-semibold">{data.actor_name} đã gửi cho bạn một lời mời kết bạn</span>
    <div className="text-xs text-gray-500">{data.timestamp}</div>
  </NotificationItem>
}
export const FriendRequestAcceptedNotificationItem = ({ data, index }) => {

  return <NotificationItem index={index} data={data}>
    <span className="text-sm align-text-top leading-none font-semibold">{data.actor_name} đã chấp nhận lời mời kết bạn của bạn</span>
    <div className="text-xs text-gray-500">{data.timestamp}</div>
  </NotificationItem>
}
export const LikePostNotificationItem = ({ data, index }) => {
  const addtionIcon = <em-emoji native={data.params.emoji} set="facebook" size={`${18}px`}></em-emoji>
  return <NotificationItem  navigateTo={`/post/${data.params.post_id}`}  additionalIconForAvatar={addtionIcon} index={index} data={data}>
    <span className="text-sm align-text-top leading-none font-semibold">{data.actor_name} đã thả cảm xúc về bài viết của bạn</span>
    <div className="text-xs text-gray-500">{data.timestamp}
    </div>
  </NotificationItem>
}
export const LikeCommentNotificationItem = ({ data, index }) => {
  const addtionIcon = <em-emoji native={data.params.emoji} set="facebook" size={`${18}px`}></em-emoji>
  return <NotificationItem navigateTo={`/post/${data.params.post_id}`} additionalIconForAvatar={addtionIcon} data={data} index={index}>
    <span className="text-sm align-text-top leading-none font-semibold">{data.actor_name} đã thả cảm xúc về bình luận của bạn </span>
    <div className="text-xs text-gray-500">{data.timestamp}</div>
  </NotificationItem>
}
const MentionNotificationItem = ({ data }) => {

}
const FollowNotificationItem = ({ data }) => {

}


export const ReplyNotificationItem = ({ data, index }) => {
  return <NotificationItem  navigateTo={`/post/${data.params.post_id}/to/${data.params.comment_id}`}  index={index} data={data}>
    <span className="text-sm align-text-top leading-none font-semibold">{data.actor_name} đã trả lời bình luận của bạn</span>
    <div className="text-xs text-gray-500">{data.timestamp}</div>
  </NotificationItem>
}


