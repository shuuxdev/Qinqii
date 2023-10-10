import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Radio } from 'antd';
import { useDispatch } from 'react-redux';
import { hideModal } from '../../Reducers/Modals';
import { AiOutlineHome, AiOutlineMessage } from 'react-icons/ai';
import { useAxios } from '../../Hooks/useAxios';
import { useDebounce } from '../../Hooks/useDebounce';
import { isEmpty } from 'lodash';
import { HeaderText } from '../../StyledComponents/styled';
import { AnimatePresence, motion } from 'framer-motion';
import { Text } from '../Common/Text';
import { Avatar } from '../Common/Avatar';

export function ShareModal(props) {
    const dispatch = useDispatch();
    const handleClose = () => {
        dispatch(hideModal());
    }
    const axios = useAxios();
    const [value, setValue] = useState("HOME");
    const [foundedFriends, setFoundedFriends] = useState([]);
    const [keyword, setKeyword] = useState();
    const debounceKeyword = useDebounce(keyword,500);
    const onChange = (e) => {
        
        setValue(e.target.value);
    };

    const fetchFriendsWithName = async(keyword) => {
            const [data, error] = await axios.GET_FriendsWithName(keyword)
            setFoundedFriends(data);
    }

    useEffect(() => {

        if(value === "CHAT" && !isEmpty(debounceKeyword))
        {
            
        }

    }, [debounceKeyword]);

    return (
        <Modal open={true} className='share-modal' onCancel={handleClose} footer={null}>
            <HeaderText sm={true} >
                    Chia sẻ
            </HeaderText>

            <Radio.Group onChange={onChange} value={value} className='w-full py-[15px]'>
                <ShareToMyWall/>
                <ShareToMyFriend/>
            </Radio.Group>
            <AnimatePresence>
                {
                    value === 'CHAT' &&
                    <motion.div initial={{opacity: 0, y: '-50px'}} animate={{opacity: 1, y: 0}} className='flex flex-col gap-[10px] p-[10px]'>
                        <Input.Search  onChange={(e) => setKeyword(e.target.value)}/>

                        {
                            foundedFriends.map(friend => (
                                <div className="flex items-center gap-[10px]">
                                    <div className="shrink-0">
                                        <Avatar sz={36} src={friend.avatar} user_id={friend.id} />

                                    </div>
                                    <div className="grow">
                                        <Text>{friend.name}</Text>
                                    </div>
                                    <div className="justify-end">
                                        <Button danger>Send</Button>
                                    </div>
                                </div>
                            ))
                        }
                    </motion.div>
                }
            </AnimatePresence>



        </Modal>
    );
}


const ShareToMyWall = () => {
    return (
        <div  className='flex items-center padding-[5px] qinqii-thin-shadow p-[10px] mb-[10px] rounded-[10px] w-full gap-[10px] '>
            <Radio value={"HOME"}/>
            <AiOutlineHome  size={24}/>
            <HeaderText>
                Chia sẻ về wall
            </HeaderText>
        </div>
    )
}
const ShareToMyFriend = () => {
    return (
        <div className='flex padding-[5px] qinqii-thin-shadow  p-[10px] mb-[10px] rounded-[10px] w-full gap-[10px]  '>
            <Radio value={"CHAT"}/>
            <AiOutlineMessage size={24}/>
            <HeaderText>
                Chia sẻ qua tin nhắn
            </HeaderText>
        </div>
    )
}

