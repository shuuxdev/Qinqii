import { FaBirthdayCake, FaFemale, FaGraduationCap, FaHeart, FaMale } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFriendsThunk, fetchPosts, fetchProfileThunk, useGetProfileQuery } from '../Reducers/Profile.js';
import { useParams } from 'react-router-dom';
import { createContext, useContext, useEffect, useState } from 'react';
import { AiOutlineCamera } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { useAxios } from '../Hooks/useAxios';
import { showModal } from '../Reducers/Modals';
import { ModalType } from '../Enums/Modal';
import { QinqiiCustomImage } from '../Components/Common/QinqiiCustomImage';
import { VideosTab } from '../Components/Profile/VideosTab';
import { PostsTab } from '../Components/Profile/PostsTab';
import { FriendsTab } from '../Components/Profile/FriendsTab';
import { ImagesTab } from '../Components/Profile/ImagesTab';
import { ButtonState, FriendButton } from '../Components/Common/Buttons/FriendButton';
import { useUserID } from '../Hooks/useUserID';
import Loading from '../Components/Common/Loading';


const AvatarCircle = ({ src }) => {
    const dispatch = useDispatch();


    const handleClick = () => {
        dispatch(showModal({ modalType: ModalType.UPLOAD_AVATAR, modalProps: { src } }));
    };

    return (
        <div onClick={handleClick}
             className='border-[5px]  border-white box-border   absolute overflow-hidden h-[150px] w-[150px] bg-[black] rounded-[50%] bottom-0 left-[50%] translate-x-[-50%] translate-y-[50%]'>
            <motion.div className='absolute h-full cursor-pointer flex w-full items-center justify-center bg-white'
                        initial={{ opacity: 0 }} whileHover={{ opacity: 0.3 }}>
                <AiOutlineCamera size={28} />
            </motion.div>
            <QinqiiCustomImage src={src} alt='' className='w-full h-full object-cover' />
        </div>
    );
};

const BackgroundAndAvatar = () => {
    const { profile } = useContext(ProfileContext);
    const { background, avatar } = profile;
    return (
        <div className=' p-[10px]'>
            <div className='relative  min-h-[150px] my-[10px] aspect-video'>
                <QinqiiCustomImage className='rounded-[9px] object-cover w-full h-full' src={background} alt='' />
                <AvatarCircle src={avatar} />
            </div>
        </div>
    );
};


const AboutMeItem = ({ icon, text }) => {
    return (
        <div className='flex  py-[10px] gap-[10px] items-center'>
            {icon}
            <p>{text}</p>
        </div>
    );
};
const About = () => {
    const { profile } = useContext(ProfileContext);
    const { about, graduate, relationship, birthday, gender } = profile;

    return (
        <div className=' rounded-[9px] bg-[white]   my-[10px] '>
            <div className=' p-[40px] flex flex-col gap-[20px]'>
                <div className='flex flex-col text-gray-600'>
                    <h1 className=' text-[20px]'>Giới thiệu</h1>
                    <div className='flex justify-center'>
                        <p>{about}</p>
                    </div>
                </div>

                <div className='w-full my-[20px] self-center h-[1px] bg-gray-200'></div>
                <div className='flex flex-col'>
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
    );
};

const Tab = {
    Posts: 'POST',
    Videos: 'VIDEO',
    Images: 'IMAGE',
    Friends: 'FRIEND',
    Groups: 'GROUP',
};
const RelationshipToButtonState = {
    'ACCEPTED': ButtonState.IsFriend,
    'PENDING': ButtonState.RequestSent,
    'STRANGER': ButtonState.Default,
};
const ProfileContext = createContext();
const Profile = () => {
    const param = useParams();
    const dispatch = useDispatch();
    const location = window.location;
    const axios = useAxios();
    const [relationship, setRelationship] = useState(null);
    const profile = useSelector(state => state.profile);
    const [activeTab, setActiveTab] = useState(Tab.Posts);
    const me = useUserID();
    const checkFriend = async () => {
        const [data, error] = await axios.GET_RelationshipWithUser(param.id);
        setRelationship(data);
    };
    useEffect(() => {
        checkFriend();
        dispatch(fetchProfileThunk(param.id));
        dispatch(fetchFriendsThunk({ user_id: param.id, page: 1, pageSize: 10 }));
        return () => {
            setRelationship(null);
        };
    }, [param.id]);
    useEffect(() => {
        if (location.pathname === `/user/${param.id}`) {
            setActiveTab(Tab.Posts);
        }
        if (location.pathname === `/user/${param.id}/images`) {
            setActiveTab(Tab.Images);
        }
        if (location.pathname === `/user/${param.id}/videos`) {
            setActiveTab(Tab.Videos);
        }
        if (location.pathname === `/user/${param.id}/friends`) {
            setActiveTab(Tab.Friends);
        }

    }, [location.pathname]);
    return (
        <>
            {
                profile ?
                    <ProfileContext.Provider value={{ profile, activeTab, setActiveTab }}>
                        <BackgroundAndAvatar></BackgroundAndAvatar>

                        <div className='p-[10px] b-[red] mt-[30px]'>
                            <div className=' flex items-center justify-center flex-col'>
                                <h1 className='text-[28px] font-bold'>{profile.name}</h1>
                                {
                                    profile.user_id !== me &&
                                    <div className='flex'>
                                        <span className='text-gray-700'>{profile.friends.length} người bạn</span>
                                    </div>
                                }
                            </div>
                        </div>
                        {
                            profile.user_id !== me &&
                            <div className='flex justify-center items-center'
                                 key={RelationshipToButtonState[relationship]}>
                                <div className='w-[100px] h-[40px]'>
                                    <FriendButton user_id={parseInt(param.id)}
                                                  initState={RelationshipToButtonState[relationship]} />

                                </div>
                            </div>
                        }
                        <Navbar></Navbar>

                        <div className='shadow-md  '>
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
                    : <Loading />
            }
        </>
    );
};


const Navbar = () => {
    const { setActiveTab } = useContext(ProfileContext);
    return (
        <div className='flex bg-white text-gray-700'>
            <NavItem text={'Posts'} onClick={() => setActiveTab(Tab.Posts)} />
            <NavItem text={'Ảnh'} onClick={() => setActiveTab(Tab.Images)} />
            <NavItem text={'Videos'} onClick={() => setActiveTab(Tab.Videos)} />
            <NavItem text={'Bạn bè'} onClick={() => setActiveTab(Tab.Friends)} />
        </div>
    );
};
const NavItem = ({ onClick, text }) => {
    return (
        <div onClick={onClick}
             className='px-[20px] flex items-center justify-center py-[15px]  rounded-[5px]  hover:bg-slate-50 hover:border-b-[2px] grow-[1] hover:border-blue-500 hover:mb-[-2px]'>{text}</div>
    );
};
export default Profile;