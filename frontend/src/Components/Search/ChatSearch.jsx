import React, { useEffect, useRef, useState } from 'react';
import { useDebounce } from '../../Hooks/useDebounce';
import { useAxios } from '../../Hooks/useAxios';
import { useNavigate } from 'react-router-dom';
import { isUndefined } from 'lodash';
import Color from '../../Enums/Color';
import { BsSearch } from 'react-icons/bs';
import { MdOutlineCancel } from 'react-icons/md';
import { AnimatePresence, motion } from 'framer-motion';
import { Avatar } from '../Common/Avatar';
import { Text } from '../Common/Text';

export function ChatSearch({onFinished}) {
    const [keyword, setKeyword] = useState();
    const debounce = useDebounce(keyword, 500);
    const axios = useAxios();
    const [founded, setFounded] = useState([]);
    const navigate = useNavigate();
    const inputRef = useRef(null);
    useEffect(() => {
        if(debounce === '') {
            onFinished([]);
            return;
        }
        const findPeopleByName = async (name) => {
            const [data, error] = await axios.GET_PeopleWithName(name);
            if (!error) {
                onFinished(data);
            }
        }
        findPeopleByName(debounce);
    }, [debounce]);
    const handleClick = (user_id) => {
        navigate(`/user/${user_id}`);
        handleCancel();
    };
    const handleCancel = () => {
        setFounded([]);
        setKeyword('');
        inputRef.current.value = '';
    };

    return (
        <div
            className={`relative search search-bar  `}>
            <div className='absolute left-[15px] top-[50%] translate-y-[-50%]'>
                <BsSearch></BsSearch>
            </div>
            <input ref={inputRef} onChange={(e) => setKeyword(e.target.value)} type='text'
                   className={` py-[10px] pl-[40px] rounded-[50px] bg-[${Color.Background}]  focus:outline-none w-full bg-[${Color.Background}]`} placeholder='Search' />
            {
                founded.length > 0 && <div className='absolute right-[15px] top-[50%] translate-y-[-50%] cursor-pointer' onClick={handleCancel}>
                    <MdOutlineCancel size={18} className='text-red-400' />
                </div>

            }
        </div>
    );
}