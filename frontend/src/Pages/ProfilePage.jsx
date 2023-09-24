import { faker } from '@faker-js/faker';
import { FaBirthdayCake, FaFemale, FaGraduationCap, FaHeart, FaMale } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
    addComment,
    fetchPosts,
    removeComment,
    updateComment,
    updatePost,
    useGetFriendsQuery,
    useGetImagesQuery,
    useGetProfileQuery,
    useGetVideosQuery,
} from '../Modules/Profile.js';
import { useParams } from 'react-router-dom';
import { createContext, useContext, useEffect, useState } from 'react';
import { QinqiiCustomImage } from '../Components/CommonComponent.jsx';
import { Post } from '../Components/Post.jsx';
import { FriendItem } from '../Components/FriendItem.jsx';
import { AiOutlineCamera, AiOutlineComment, AiOutlineHeart } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { useAxios } from '../Hooks/useAxios';
import { showModal } from '../Modules/Modals';
import { ModalType } from '../Enums/Modal';


const AvatarCircle = ({src}) => {
     const dispatch = useDispatch();


  const handleClick = () => {
      dispatch(showModal({modalType: ModalType.UPLOAD_AVATAR, modalProps: {src}}))
  }

  return (
      <div onClick={handleClick}  className="border-[5px]  border-white box-border   absolute overflow-hidden h-[150px] w-[150px] bg-[black] rounded-[50%] bottom-0 left-[50%] translate-x-[-50%] translate-y-[50%]">
        <motion.div className='absolute h-full cursor-pointer flex w-full items-center justify-center bg-white' initial={{opacity:0}} whileHover={{opacity: 0.3}}>
          <AiOutlineCamera size={28}/>
        </motion.div>
        <QinqiiCustomImage src={src} alt="" className='w-full h-full object-cover' />
      </div>
  )
}

const BackgroundAndAvatar = () => {
    const { profile } = useContext(ProfileContext)
    const { background, avatar, name } = profile;
    console.log(profile)
    return (
        <div className="shadow-md  p-[10px]">
            <div className="relative  min-h-[300px] my-[10px] ">
                <div className="aspect-video">
                    <QinqiiCustomImage className="rounded-[9px] object-cover w-full h-full"  src={background} alt="" />
                </div>
                <AvatarCircle src={avatar}/>
            </div>

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
    const { profile } = useContext(ProfileContext)
  const { about, graduate, relationship, birthday, gender } = profile;

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
  const param = useParams();

  const { data: profile, isLoading, isFetching, isError, isSuccess } = useGetProfileQuery(param.id)
  const [activeTab, setActiveTab] = useState(Tab.Posts)
  const dispatch = useDispatch()
  const axios = useAxios()
  const init = async () => {
    const [data, error] = await axios.GET_UserPosts({user_id: param.id, page: 1, pageSize: 10})
    dispatch(fetchPosts(data))
  }
  useEffect(() => {
      init();
  }, [param.id]);

  return (
    <>
      {
        profile && isSuccess &&
        <ProfileContext.Provider value={{ profile, activeTab, setActiveTab }}>
          <BackgroundAndAvatar></BackgroundAndAvatar>
          <Navbar></Navbar>

          <div className="shadow-md  ">
            {
              activeTab === Tab.Images &&
              <ImagesTab />
            }
            {
              activeTab === Tab.Posts &&
              <>
                <About></About>
                <PostsTab />
              </>
            }
            {
              activeTab === Tab.Videos &&
              <VideosTab />
            }
            {
              activeTab === Tab.Friends &&
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
  const { data: images, isSuccess } = useGetImagesQuery({user_id: param.id, page: 1, pageSize: 20})
  
    const dispatch = useDispatch();
  const variant = {
      hidden: {
        opacity: 0,
      },
      visible: {
        opacity: 1
      }
  }
  const OpenInMediaViewer = (index) => {
      const attachments = images.filter((image) => images[index].post_id === image.post_id)
                        .map((image) => ({link: image.attachment_link, type:'IMAGE', id: image.attachment_id}))

      let selectedIndex = 0;
      attachments.forEach((attachment, i) => {
            if(attachment.id === images[index].attachment_id) selectedIndex = i;
      })

      dispatch(showModal({modalType: ModalType.MEDIA, modalProps: {attachments, selected: selectedIndex}}))
  }
  return (<div className="grid gap-1 grid-flow-row grid-cols-3 grid-rows-3 p-[20px]">
    {
      isSuccess &&
      images.map((image, index) => (
        <div onClick={() => OpenInMediaViewer(index)} className="rounded-[5px] overflow-hidden relative aspect-square">
          <motion.div variants={variant} initial="hidden" whileHover="visible" className='absolute cursor-pointer inset-0 transparent-black-background'>
            <div className='absolute bottom-0 flex justify-between w-full p-[10px]'>
                <div className='flex'>
                  <AiOutlineHeart size={24} className='text-white mx-[5px]'/>
                  <span className=''>{image.reactions}</span>
                  </div>
              <div className='flex'>

                <AiOutlineComment size={24} className='text-white mx-[5px]'></AiOutlineComment>
                <span className='text-white mx-[5px]'>{image.comments}</span>
              </div>
            </div>
          </motion.div>
          <QinqiiCustomImage className="w-full h-full object-cover" src={image.attachment_link} alt="" />
        </div>
      ))
    }
  </div>)

}

const PreviewImage = () => {

}
const VideosTab = () => {

  const variant = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1
    }
  }
  const dispatch = useDispatch();
  const param = useParams();
  const { data: videos, isSuccess } = useGetVideosQuery({user_id: param.id, page: 1, pageSize: 20})
    
    const OpenInMediaViewer = (index) => {
        const attachments = videos.filter((video) => videos[index].post_id === video.post_id)
            .map((video) => ({link: video.attachment_link, type:'VIDEO', id: video.attachment_id, thumbnail: video.thumbnail}))

        let selectedIndex = 0;
        attachments.forEach((attachment, i) => {
            if(attachment.id === videos[index].attachment_id) selectedIndex = i;
        })

        dispatch(showModal({modalType: ModalType.MEDIA, modalProps: {attachments, selected: selectedIndex}}))
    }
  return (<div className="grid gap-1 grid-flow-row grid-cols-3 grid-rows-3 p-[20px]">
    {
      isSuccess &&
      videos.map((video,index) => (
          <div onClick={() => OpenInMediaViewer(index)} className="rounded-[5px] overflow-hidden relative aspect-square">
            <motion.div variants={variant} initial="hidden" whileHover="visible" className='absolute cursor-pointer inset-0 transparent-black-background'>
              <div className='absolute bottom-0 flex justify-between w-full p-[10px]'>
                <div className='flex'>
                  <AiOutlineHeart size={24} className='text-white mx-[5px]'/>
                  <span className='text-white mx-[5px]'>{video.reactions}</span>
                </div>
                <div className='flex'>

                  <AiOutlineComment size={24} className='text-white mx-[5px]'></AiOutlineComment>
                  <span className='text-white mx-[5px]'>{video.comments}</span>
                </div>
              </div>
            </motion.div>
            <QinqiiCustomImage className="w-full h-full object-cover" src={video.thumbnail} alt="" />
          </div>
      ))
    }
  </div>)
}
const PostsTab = () => {
  const posts = useSelector(state => state.profile.posts)
  return (<>
    {
      posts.map((post) => (
        <Post post={post} action={{updatePost, updateComment, addComment, removeComment}} />
      ))
    }
  </>)
}
const FriendsTab = () => {
  const param = useParams();
  const { data: friends, isSuccess } = useGetFriendsQuery({ user_id: param.id,page: 1, pageSize: 10 })

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
    </navbar>
  )
}
const NavItem = ({ onClick, text }) => {
  return (
    <div onClick={onClick} className="px-[20px] flex items-center justify-center py-[15px]  rounded-[5px]  hover:bg-slate-50 hover:border-b-[2px] grow-[1] hover:border-blue-500 hover:mb-[-2px]">{text}</div>
  )
}
export default Profile