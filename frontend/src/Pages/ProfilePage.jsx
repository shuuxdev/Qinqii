
import { faker } from '@faker-js/faker'
import { FaGraduationCap, FaHeart } from 'react-icons/fa'



const BackgroundAndAvatar = ({ avatar = '/assets/shuu.jpg', background = '/assets/shuubg.jpg' }) => {

  return (
    <div className="shadow-md  p-[10px]">
      <avatar>
        <div className="relative  min-h-[300px] my-[10px] ">
          {/* Background */}
          <img className="rounded-[9px]" src={background} alt="" />
          <div className="border-[5px]  border-white box-border   absolute overflow-hidden h-[150px] w-[150px] bg-[black] rounded-[50%] bottom-0 left-[50%] translate-x-[-50%] translate-y-[50%]">
            {/* Avatar */}
            <img src={avatar} alt="" />
          </div>
        </div>

      </avatar>
      <div className="p-[10px] b-[red] mt-[80px]">
        <div className=" flex items-center justify-center flex-col">
          {/* First name and Last name */}
          <h1 className="text-[28px] font-bold">Hiếu Nghĩa</h1>
          <div className="flex">
            <span className="text-gray-700">36 người bạn</span>
          </div>
        </div>
      </div>
    </div>
  )
}
const About = () => {
  return (
    <div className=" rounded-[9px] bg-[white]   my-[10px] ">
      <div className=" p-[40px] flex flex-col gap-[20px]">
        <div className="flex flex-col text-gray-600">
          <h1 className=" text-[20px]">Giới thiệu</h1>
          <div className="flex justify-center">
            <p>1 + 1 = 2</p>
          </div>
        </div>

        <div className="w-full my-[20px] self-center h-[1px] bg-gray-200" ></div>
        <div className="flex flex-col">
          <div className="flex py-[10px] gap-[10px] items-center">
            <FaGraduationCap size={26}></FaGraduationCap>
            <p>Đã tốt nghiệp tại THPT Nguyễn Trãi</p>
          </div>
          <div className="flex py-[10px] gap-[10px] items-center">
            <FaHeart size={26}></FaHeart>
            <p>Độc thân</p>
          </div>
        </div>
      </div>
    </div>
  )
}
const Profile = ({ user_profile }) => {
  let feature_images = Array(9).fill().map((item) => faker.image.url())
  return (
    <div>
      <BackgroundAndAvatar></BackgroundAndAvatar>
      <Navbar></Navbar>

      <div className="shadow-md  ">
        <About></About>
        {/* Gallery */}
        <div className="grid gap-1 grid-flow-row grid-cols-3 grid-rows-3 p-[20px]">
          {
            feature_images.map((image) => (
              <div className="rounded-[5px] overflow-hidden aspect-square">
                <img className="w-full h-full object-cover" src={image} alt="" />
              </div>
            ))

          }
        </div>
      </div>
    </div>
  )
}


const Navbar = () => {
  return (
    <navbar className="flex bg-white text-gray-700">
      <div className="px-[20px] flex items-center justify-center py-[15px]  rounded-[5px]  hover:bg-slate-50 hover:border-b-[2px] grow-[1] hover:border-blue-500 hover:mb-[-2px]">Posts</div>
      <div className="px-[20px] flex items-center justify-center py-[15px]  rounded-[5px]  hover:bg-slate-50 hover:border-b-[2px] grow-[1] hover:border-blue-500 hover:mb-[-2px]">Về bản thân</div>
      <div className="px-[20px] flex items-center justify-center py-[15px]  rounded-[5px]  hover:bg-slate-50 hover:border-b-[2px] grow-[1] hover:border-blue-500 hover:mb-[-2px]">Ảnh</div>
      <div className="px-[20px] flex items-center justify-center py-[15px]  rounded-[5px]  hover:bg-slate-50 hover:border-b-[2px] grow-[1] hover:border-blue-500 hover:mb-[-2px]">Video</div>
      <div className="px-[20px] flex items-center justify-center py-[15px]  rounded-[5px]  hover:bg-slate-50 hover:border-b-[2px] grow-[1] hover:border-blue-500 hover:mb-[-2px]">Bạn bè</div>
      <div className="px-[20px] flex items-center justify-center py-[15px]  rounded-[5px]  hover:bg-slate-50 hover:border-b-[2px] grow-[1] hover:border-blue-500 hover:mb-[-2px]">Group</div>
    </navbar>
  )
}
export default Profile