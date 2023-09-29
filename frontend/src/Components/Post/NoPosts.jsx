
export const NoPosts = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="p-8 rounded-md shadow-md bg-white text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2h-1l-1 1v1h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2H7v-1l-1-1H5a2 2 0 01-2-2V5zm10 4H8a1 1 0 000 2h4a1 1 0 000-2z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-700 font-semibold text-lg">No Posts Available</p>
                <p className="text-gray-500 mt-2">It's quiet here, start by creating a new post.</p>
            </div>
        </div>
    );
};

export default NoPosts;