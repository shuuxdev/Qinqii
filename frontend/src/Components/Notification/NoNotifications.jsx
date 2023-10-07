export const NoNotifications = () => {
    return (
        <div className="flex p-[20px] flex-col items-center justify-center h-full">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                />
            </svg>
            <p className="text-gray-500 text-lg mt-4 font-semibold">
                You're all caught up!
            </p>
            <p className="text-gray-400 text-sm mt-2">
                No new notifications to display.
            </p>
        </div>
    );
};
