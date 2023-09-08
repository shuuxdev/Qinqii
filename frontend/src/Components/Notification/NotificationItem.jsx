import { BsThreeDots } from 'react-icons/bs'
import Color from '../../Enums/Color.js'
import { Avatar, DropdownItem, DropdownMenu } from '../CommonComponent.jsx'
import { useNavigate } from 'react-router-dom'
import { NotificationDropdownContext } from './NotificationDropdown.jsx'
import { useContext } from 'react'

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
export function NotificationItem({ children, data }) {
  const TriggerSize = 18;
  const navigate = useNavigate();
  const { CCIDOfNotification, setCCIDOfNotification } = useContext(NotificationDropdownContext);
  const Trigger = () => (
    <div onClick={() => setCCIDOfNotification(data.id)} className={`p-[10px]   self-end w-fit rounded-full cursor-pointer hover:bg-[${Color.Hover}]`}>
      <BsThreeDots size={TriggerSize}></BsThreeDots>
    </div>)
  return (
    <div className="notification_item">
      <div className="shrink-0">
        <Avatar sz={36} src={data.actor_avatar} />
      </div>
      <div className="grow flex ">
        <div onClick={() => navigate(`/user/${data.actor_id}`)} className="flex-grow">
          {children}
        </div>
        <div className="shrink-0">
          <Trigger />
        </div>
      </div>
    </div>
  )
}
export const FriendRequestNotificationItem = ({ data }) => {
  return <NotificationItem data={data}>
    <span className="text-sm font-semibold">{data.actor_name} đã gửi cho bạn một lời mời kết bạn</span>
    <div className="text-xs text-gray-500">{data.timestamp}</div>
  </NotificationItem>
}
export const CommentNotificationItem = ({ data }) => {
  return <NotificationItem data={data}>
    <span className="text-sm font-semibold">{data.actor_name} đã bình luận trong một bài viết của bạn</span>
    <div className="text-xs text-gray-500">{data.timestamp}</div>
  </NotificationItem>
}
export const LikePostNotificationItem = ({ data }) => {
  return <NotificationItem data={data}>
    <span className="text-sm font-semibold">{data.actor_name} đã thả cảm xúc về bài viết của bạn</span>
    <div className="text-xs text-gray-500">{data.timestamp}</div>
  </NotificationItem>
}
export const FriendRequestAcceptedNotificationItem = ({ data }) => {
  return <NotificationItem data={data}>
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



