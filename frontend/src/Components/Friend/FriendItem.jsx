import React from 'react'
import { BsThreeDots } from 'react-icons/bs'
import Color from '../../Enums/Color.js'
import { QinqiiCustomImage } from '../Common/QinqiiCustomImage';
import { Text } from '../Common/Text';

export function FriendItem({ friend }) {
  return (
    <div className='border-[1px] flex rounded-[5px] border-solid p-[10px] qinqii-thin-shadow'>
      <div className="flex gap-[5px] flex-1 items-start">

        <div className="rounded-[10px] overflow-hidden w-[70px] h-[70px]">
          <QinqiiCustomImage className={'w-full h-full object-cover'} src={friend.avatar} />
        </div>
        <Text>
          {friend.name}
        </Text>

      </div>
      <div onClick={() => { }} className={`p-[10px]   self-center w-fit rounded-full cursor-pointer hover:bg-[${Color.Hover}]`}>
        <BsThreeDots size={22}></BsThreeDots>
      </div>
    </div>
  )
}
