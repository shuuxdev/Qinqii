import { useState } from 'react';

const FileUploader = ({handleFileChange}) => {
    const [files, setFiles] = useState([]);

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = [...e.dataTransfer.files];
        handleFileChange(droppedFile);
        setFiles(droppedFile);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        const droppedFile = [...e.dataTransfer.files];
        handleFileChange(droppedFile);
        setFiles(droppedFile);
    };
    const handleChange = (e) => {
        const droppedFile = [...e.target.files];
        handleFileChange(droppedFile);
        setFiles(droppedFile);
    }
    const handleClear = () => {
        handleFileChange([]);
        setFiles([]);
    };

    return (
        <div className="flex items-center justify-center">
            <div className="w-64 p-6 border-2 border-dashed border-gray-400 rounded-lg text-center">
                {files.length > 0 ? (
                    <div>
                        <p className="text-2xl font-bold mb-4">File Uploaded!</p>
                        {
                            files.map((file, index) => (
                                <div key={index}>
                                    <p className="mb-4">{file.name}</p>
                                </div>
                            ))
                        }
                        <button
                            onClick={handleClear}
                            className="bg-red-500 text-white rounded p-2 hover:bg-red-600 transition duration-300 ease-in-out"
                        >
                            Clear
                        </button>
                    </div>
                ) : (
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className="cursor-pointer"
                    >
                        <p className="text-2xl font-bold mb-4">Drag and Drop a File Here</p>
                        <p className="text-gray-500">or</p>
                        <label
                            htmlFor="fileInput"
                            className="block bg-blue-500 text-white rounded p-2 cursor-pointer mt-4 hover:bg-blue-600 transition duration-300 ease-in-out"
                        >
                            Select File
                        </label>
                        <input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            multiple={true}  accept='video/*,image/*'
                            onChange={handleChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUploader;