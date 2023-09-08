
import { faker } from '@faker-js/faker'
import { FaBirthdayCake, FaFemale, FaGraduationCap, FaHeart, FaMale } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { useGetFriendsQuery, useGetImagesQuery, useGetPeopleYouMayKnowQuery, useGetPostsQuery, useGetProfile, useGetProfileQuery, useGetVideosQuery } from '../Modules/Profile.js'
import { useParams } from 'react-router-dom'
import { createContext, useContext, useEffect, useState } from 'react'
import { QinqiiCustomImage, QinqiiImage } from '../Components/CommonComponent.jsx'
import { Post } from '../Components/Post.jsx'
import { FriendItem } from '../Components/FriendItem.jsx'



const BackgroundAndAvatar = () => {
  const { name, avatar, background } = useContext(ProfileContext)
  return (
    <div className="shadow-md  p-[10px]">
      <avatar>
        <div className="relative  min-h-[300px] my-[10px] ">
          <div className="aspect-video">
            <img className="rounded-[9px] object-cover w-full h-full" src={background} alt="" />
          </div>
          <div className="border-[5px]  border-white box-border   absolute overflow-hidden h-[150px] w-[150px] bg-[black] rounded-[50%] bottom-0 left-[50%] translate-x-[-50%] translate-y-[50%]">
            <img src={avatar} alt="" />
          </div>
        </div>

      </avatar>
      <div className="p-[10px] b-[red] mt-[80px]">
        <div className=" flex items-center justify-center flex-col">
          {/* First name and Last name */}
          <h1 className="text-[28px] font-bold">{name}</h1>
          <div className="flex">
            <span className="text-gray-700">36 người bạn</span>
          </div>
        </div>
      </div>
    </div>
  )
}


const AboutMeItem = ({ icon, text }) => {
  return (
    <div className="flex  py-[10px] gap-[10px] items-center">
      {icon}
      <p>{text}</p>
    </div>
  )
}
const About = () => {
  const { about, graduate, relationship, birthday, gender } = useContext(ProfileContext);
  useEffect(() => {
    console.log(about)
  })
  return (
    <div className=" rounded-[9px] bg-[white]   my-[10px] ">
      <div className=" p-[40px] flex flex-col gap-[20px]">
        <div className="flex flex-col text-gray-600">
          <h1 className=" text-[20px]">Giới thiệu</h1>
          <div className="flex justify-center">
            <p>{about}</p>
          </div>
        </div>

        <div className="w-full my-[20px] self-center h-[1px] bg-gray-200" ></div>
        <div className="flex flex-col">
          {
            graduate &&
            <AboutMeItem icon={<FaGraduationCap size={26} />} text={`Đã tốt nghiệp tại THPT ${graduate}`} />
          }
          {
            relationship &&
            <AboutMeItem icon={<FaHeart size={26}></FaHeart>} text={relationship} />
          }
          {
            birthday &&
            <AboutMeItem icon={<FaBirthdayCake size={26} />} text={birthday.slice(0, 10)} />

          }
          {
            gender == 'MALE' ?
              <AboutMeItem icon={<FaMale size={26} />} text={gender} />
              :
              <AboutMeItem icon={<FaFemale size={26} />} text={gender} />

          }
        </div>
      </div>
    </div>
  )
}

const Tab = {
  Posts: 'POST',
  Videos: 'VIDEO',
  Images: 'IMAGE',
  Friends: 'FRIEND',
  Groups: 'GROUP'
}
const ProfileContext = createContext();
const Profile = ({ user_profile }) => {
  let feature_images = Array(9).fill().map((item) => faker.image.url())
  const param = useParams();
  const { data: profile, isLoading, isFetching, isError, isSuccess } = useGetProfileQuery(param.id)

  const [activeTab, setActiveTab] = useState(Tab.Posts)


  return (
    <>
      {
        profile && isSuccess &&
        <ProfileContext.Provider value={{ profile, activeTab, setActiveTab }}>
          <BackgroundAndAvatar></BackgroundAndAvatar>
          <Navbar></Navbar>

          <div className="shadow-md  ">
            {
              activeTab == Tab.Images &&
              <ImagesTab />
            }
            {
              activeTab == Tab.Posts &&
              <>
                <About></About>
                <PostsTab />
              </>
            }
            {
              activeTab == Tab.Videos &&
              <VideosTab />
            }
            {
              activeTab == Tab.Friends &&
              <FriendsTab />
            }

          </div>
        </ProfileContext.Provider>
      }
    </>
  )
}


const ImagesTab = () => {
  const param = useParams();
  const { data: images, isSuccess } = useGetImagesQuery(param.id)
  return (<div className="grid gap-1 grid-flow-row grid-cols-3 grid-rows-3 p-[20px]">
    {
      isSuccess &&
      images.map((image) => (
        <div className="rounded-[5px] overflow-hidden aspect-square">
          <QinqiiCustomImage className="w-full h-full object-cover" src={image.link} alt="" />
        </div>
      ))
    }
  </div>)

}
const VideosTab = () => {
  const param = useParams();
  const { data: videos, isSuccess } = useGetVideosQuery(param.id)
  return (<div className="grid gap-1 grid-flow-row grid-cols-3 grid-rows-3 p-[20px]">
    {
      isSuccess &&
      videos.map((video) => (
        <div className="rounded-[5px] overflow-hidden aspect-square">
          <QinqiiCustomImage className="w-full h-full object-cover" src={video.link} alt="" />
        </div>
      ))
    }
  </div>)
}
const PostsTab = () => {
  const param = useParams();
  const { data: posts, isSuccess } = useGetPostsQuery(param.id)
  return (<>
    {
      isSuccess &&
      posts.map((post) => (
        <Post post={post} />
      ))
    }
  </>)
}
const FriendsTab = () => {
  const param = useParams();
  const { data: friends, isSuccess } = useGetFriendsQuery(param.id)

  return (<>
    {
      isSuccess &&
      <div className="rounded-[10px] p-[10px] qinqii-thin-shadow gap-[10px]   grid grid-cols-2">
        {
          friends.map((friend) => (
            <FriendItem friend={friend} />
          ))}
      </div>
    }
  </>)
}
const Navbar = () => {
  const { setActiveTab } = useContext(ProfileContext)
  return (
    <navbar className="flex bg-white text-gray-700">
      <NavItem text={'Posts'} onClick={() => setActiveTab(Tab.Posts)} />
      <NavItem text={'Ảnh'} onClick={() => setActiveTab(Tab.Images)} />
      <NavItem text={'Videos'} onClick={() => setActiveTab(Tab.Videos)} />
      <NavItem text={'Bạn bè'} onClick={() => setActiveTab(Tab.Friends)} />
      <NavItem text={'Group'} onClick={() => setActiveTab(Tab.Groups)} />
    </navbar>
  )
}
const NavItem = ({ onClick, text }) => {
  return (
    <div onClick={onClick} className="px-[20px] flex items-center justify-center py-[15px]  rounded-[5px]  hover:bg-slate-50 hover:border-b-[2px] grow-[1] hover:border-blue-500 hover:mb-[-2px]">{text}</div>
  )
}
export default Profile