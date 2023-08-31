import { BsThreeDots } from 'react-icons/bs'
import Color from '../../Enums/Color.js'
import { Avatar, DropdownItem, DropdownMenu } from '../CommonComponent.jsx'
import { useNavigate } from 'react-router-dom'
import { NotificationDropdownContext } from './NotificationDropdown.jsx'
import { useContext } from 'react'

export function NotificationItem({ data }) {
  const TriggerSize = 18;
  const navigate = useNavigate();
  const { CCIDOfNotification, setCCIDOfNotification } = useContext(NotificationDropdownContext);
  const Trigger = () => (
    <div onClick={() => setCCIDOfNotification(data.id)} className={`p-[10px]   self-end w-fit rounded-full cursor-pointer hover:bg-[${Color.Hover}]`}>
      <BsThreeDots size={TriggerSize}></BsThreeDots>
    </div>)
  return (
    <div onClick={() => navigate(`/user/${data.user.id}`)} className="notification_item">
      <div className="shrink-0">
        <Avatar sz={36} src={'shuu.jpg'} />
      </div>
      <div className="grow flex ">
        <div className="flex-grow">
          <span className="text-sm font-semibold">{data.content.text}</span>
          <div className="text-xs text-gray-500">{data.timestamp}</div>

        </div>
        <div className="shrink-0">

          <Trigger />
        </div>
      </div>
    </div>
  )
}
