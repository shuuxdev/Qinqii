import Color from '../../Enums/Color';
import { FiAtSign } from 'react-icons/fi';

import { Text } from './Text';
import { useNavigate } from 'react-router-dom';

export const WebFavicon = () => {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate('/')} className=' cursor-pointer favicon flex gap-[10px] items-center'>

            <div
                className={`flex items-center justify-center p-[10px] bg-[${Color.LightPrimary}] gap-[10px] rounded-[10px] overflow-hidden`}>
                <FiAtSign color={Color.Primary} size={24}></FiAtSign>
            </div>
            <div>
                <Text bold fontSize={21}> Qinqii</Text>
            </div>
        </div>
    );
};