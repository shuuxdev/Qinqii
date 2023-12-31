import { useParams } from 'react-router-dom';
import { FriendItem } from '../Friend/FriendItem';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFriendsThunk } from '../../Reducers/Profile';
import { NoFriends } from './NoFriends';

export const FriendsTab = () => {

    const { friends } = useSelector(state => state.profile);

    return (<>
        {
            friends.length > 0 ?
            <div className='rounded-[10px] p-[10px] qinqii-thin-shadow gap-[10px] min-h-[300px] bg-white  grid grid-cols-2 auto-rows-max'>
                {
                    friends.map((friend) => (
                        <FriendItem friend={friend} />
                    ))
                }
            </div> :  <NoFriends/>
        }
    </>);
};