import { DropdownMenu } from '../Components/Common/DropdownMenu';
import Color from '../Enums/Color';
import { BsThreeDots } from 'react-icons/bs';

export const TestPage = () => {

    return (
        <div className='w-[100vw] h-[100vh] flex justify-center items-center'>
           <NoChatSelected/>
        </div>
    )
}

function NoChatSelected() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-24 h-24 text-indigo-600 mb-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
            </svg>
            <h2 className="text-3xl font-semibold text-gray-800 mb-3">No Chat Selected</h2>
            <p className="text-gray-600">
                Click on a chat from the list on the left to start chatting.
            </p>
        </div>
    );
}