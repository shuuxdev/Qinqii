export const NoFriends = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-100">
            <div className="p-8 bg-white rounded-md shadow-md text-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 22C9.243 22 7 19.757 7 17C7 15.343 8.343 14 10 14C10 12.346 8.346 11 7 11C4.243 11 2 13.243 2 16C2 18.757 4.243 21 7 21H12V22ZM16 8C13.243 8 11 5.757 11 3C11 1.343 12.343 0 14 0C14 1.654 15.346 3 16 3C16.654 3 18 1.654 18 0C19.657 0 21 1.343 21 3C21 5.757 18.757 8 16 8Z"
                    />
                </svg>
                <p className="mb-2 text-lg font-semibold text-gray-700">No Friends to Show</p>
                <p className="text-gray-500">Once you have friends, they'll appear here.</p>
            </div>
        </div>
    );
};

