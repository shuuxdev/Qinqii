import { useUserID } from '../../Hooks/useUserID';
import { useSelector } from 'react-redux';

export const EmptyResult = () => {
    const user_id = useUserID();
    const profile = useSelector(state => state.profile);
    return (
        <div className='flex flex-col items-center justify-center  bg-white space-y-4'>
            <svg
                className='w-16 h-16 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
            >
                <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M10.325 17.983A4 4 0 0015 20h.378a4 4 0 00.215-.01l.248-.012a4.992 4.992 0 01-.272 1.042A3.992 3.992 0 0119 21a4 4 0 110-8 3.992 3.992 0 01-1.784 3.212 2 2 0 10-2.412.752zM5 20a3 3 0 110-6 3 3 0 010 6z'
                ></path>
            </svg>
            <p className='text-xl font-semibold text-gray-600'>No Videos Uploaded</p>
            {
                profile.user_id === user_id ?
                <p className='text-gray-500'>Please upload some more medias to view them here.</p>
                    :
                <p className='text-gray-500'>This user has not uploaded any medias yet.</p>
            }
        </div>
    );
};