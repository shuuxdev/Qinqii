import Color from "../Enums/Color.js";


const Loading = ({ size = 80 }) => {
    return (
        <div className="flex w-full h-full justify-center items-center">
            <div style={{ height: size, width: size }} className={`border-[2px] border-l-[${Color.Primary}]  rounded-[50%] animate-spin`}></div>
        </div>
    )
}
export default Loading;