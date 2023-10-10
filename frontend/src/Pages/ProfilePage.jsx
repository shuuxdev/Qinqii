import { FaBirthdayCake, FaFemale, FaHeart, FaMale } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFriendsThunk, fetchProfile, fetchProfileThunk } from '../Reducers/Profile.js';
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
import Color from '../Enums/Color';
import { FiEdit } from 'react-icons/fi';
import { MdDone, MdOutlineCancel } from 'react-icons/md';
import { DatePicker, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Text } from '../Components/Common/Text';
import { AntdNotificationContext } from '../App';
import moment from 'moment';


const AvatarCircle = ({ src }) => {
    const dispatch = useDispatch();
    const me = useUserID();
    const params = useParams();
    const handleClick = () => {
        dispatch(showModal({ modalType: ModalType.UPLOAD_AVATAR, modalProps: { src } }));
    };

    return (
        <div
            className='border-[5px]  border-white box-border   absolute overflow-hidden h-[150px] w-[150px] bg-[black] rounded-[50%] bottom-0 left-[50%] translate-x-[-50%] translate-y-[50%]'>
            {
                me === parseInt(params.id) &&
                <motion.div onClick={handleClick}
                            className='absolute h-full cursor-pointer flex w-full items-center justify-center bg-white'
                            initial={{ opacity: 0 }} whileHover={{ opacity: 0.3 }}>
                    <AiOutlineCamera size={28} />
                </motion.div>
            }

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


const AboutMeItem = ({ Editor, Icon, text, itemType }) => {
    const { editItems, setEditItems, onSubmit } = useContext(AboutContext);
    const param = useParams();
    const me = useUserID();
    const axios = useAxios();

    const Return = () => {
        setEditItems(editItems.filter((item) => item !== itemType));
    };

    return (
        <div className='flex  py-[10px] gap-[10px] items-center'>
            <div>
                {Icon}
            </div>
            {
                editItems.find((item) => item === itemType) ?
                    <>
                        <Editor />

                        <MdOutlineCancel onClick={Return} className='cursor-pointer text-red-500 hover:scale-125' />
                        <MdDone onClick={() => {onSubmit(itemType);Return();}}
                                className='cursor-pointer text-green-500 hover:scale-125' />
                    </>
                    :
                    <>
                        <p>{text ?? 'Chưa cập nhật'}</p>
                        {
                            param.id == me &&
                            <FiEdit onClick={() => setEditItems([...editItems, itemType])}
                                    className='text-blue-500 cursor-pointer' />
                        }
                    </>
            }

        </div>
    );
};

export const AboutContext = createContext();
const ProfileForm = {
    About: 'about',
    Birthday: 'birthday',
    Relationship: 'relationship',
    Graduate: 'graduate',
    Gender: 'gender',
};
const About = () => {
    const param = useParams();
    const me = useUserID();
    const notify = useContext(AntdNotificationContext)
    const { profile } = useContext(ProfileContext);
    const { about, graduate, relationship, birthday, gender } = profile;
    const [editItems, setEditItems] = useState([]);
    const [editBio, setEditBio] = useState({ open: false });
    const [profileForm, setProfileForm] = useState({
        about: about,
        graduate: graduate,
        relationship: relationship,
        birthday: birthday,
        gender: gender,
    });
    const handleFormChange = (type, value) => {
        setProfileForm({ ...profileForm, [type]: value });
    };
    const getVNWord = (word) => {
        if (word === 'Male') return 'Nam';
        if (word === 'Female') return 'Nữ';
        if (word === 'Single') return 'Độc thân';
        if (word === 'Dating') return 'Đang hẹn hò';
    };
    const RelationshipSelect = () => (
        <Select defaultValue={getVNWord(relationship)} value={getVNWord(profileForm.relationship)} options={[
            { value: 'Single', label: 'Độc thân' },
            { value: 'Dating', label: 'Đang hẹn hò' },
        ]} style={{ width: 120 }} onChange={(value) => handleFormChange(ProfileForm.Relationship, value)} />
    );
    const GenderSelect = () => (
        <Select defaultValue={getVNWord(gender)} value={getVNWord(profileForm.gender)} options={[
            { value: 'Male', label: 'Nam' },
            { value: 'Female', label: 'Nữ' },
            { value: 'GAYLORD', label: 'GAYLORD', disabled: true },
        ]} style={{ width: 120 }} onChange={(value) => handleFormChange(ProfileForm.Gender, value)} />
    );
    const dispatch = useDispatch();
    const axios = useAxios();
    const handleSubmit = async (itemType) => {
        let result = [];
        if (itemType === ProfileForm.About) {
            result =  await axios.PATCH_UpdateBio(profileForm.about);
        }
        if (itemType === ProfileForm.Birthday) {
            result = await axios.PATCH_UpdateBirthday(profileForm.birthday);
        }
        if (itemType === ProfileForm.Gender) {
            result = await axios.PATCH_UpdateGender(profileForm.gender);
        }
        if (itemType === ProfileForm.Relationship) {
            result = await axios.PATCH_UpdateRelationship(profileForm.relationship);
        }
        let [statusCode, error] = result;
        if (statusCode === 200) {
            let _profile = { ...profile };
            _profile[itemType] = profileForm[itemType];
            console.log(_profile);
            dispatch(fetchProfile(_profile));
            notify.open({
                message: `Cập nhật ${itemType} thành công`,
                type: 'success',
                duration: 7,
                placement: 'bottomLeft'
            });
        } else {
            notify.open({
                message: `Cập nhật ${itemType} không thành công: ${error.response.data.Message}`,
                type: 'error',
                duration: 7,
                placement: 'bottomLeft'
            });
        }
    };
    const BirthdaySelect = () => <DatePicker defaultValue={ moment(birthday)}
                                             onChange={(value) => handleFormChange(ProfileForm.Birthday, value)} />;
    return (
        <AboutContext.Provider value={{ editItems, setEditItems, onSubmit: handleSubmit }}>

            <div className=' rounded-[9px] bg-[white]   my-[10px] '>
                <div className=' p-[40px]  flex flex-col gap-[10px]'>
                    <div className='flex gap-[10px] flex-col text-gray-600'>
                        <h1 className=' text-[20px]'>Giới thiệu</h1>
                        <div className='flex flex-col gap-[10px]'>
                            {
                                editBio.open ?
                                    <TextArea
                                        value={profileForm.about}
                                        onChange={(e) => handleFormChange(ProfileForm.About, e.target.value)}
                                        placeholder='Nhập tiểu sử của bạn <3'
                                        autoSize={{ minRows: 3, maxRows: 5 }}
                                    />
                                    :
                                    <p>{about}</p>
                            }



                            {
                                param.id == me &&
                                    <>
                                    {
                                        editBio.open ?
                                        <div className='flex gap-[10px] justify-end'>

                                            <div onClick={() => setEditBio({ open: false })}
                                                 className={`bg-[${Color.Background}] w-[80px] gap-[4px] h-[30px]  rounded-[5px]  flex justify-center items-center cursor-pointer hover:bg-[${Color.Hover}]`}>
                                                <Text fontSize={14}>
                                                    Hủy
                                                </Text>
                                                <MdOutlineCancel className='text-red-500 cursor-pointer hover:scale-125' />

                                            </div>
                                            <div onClick={() => {
                                                setEditBio({ open: false });
                                                handleSubmit(ProfileForm.About);
                                            }}
                                                 className={`bg-[${Color.Background}] rounded-[5px] gap-[4px] w-[80px] h-[30px] flex justify-center items-center  cursor-pointer hover:bg-[${Color.Hover}]`}>
                                                <Text fontSize={14}>
                                                    Xong
                                                </Text>
                                                <MdDone className='text-green-500 cursor-pointer hover:scale-125' />

                                            </div>
                                        </div> :
                                        <div onClick={() => setEditBio({ ...editBio, open: true })}
                                             className={`flex w-full h-[40px] justify-center items-center rounded-[10px] bg-[${Color.Background}] hover:bg-[${Color.Hover}] cursor-pointer`}>
                                            Chỉnh sửa bio
                                        </div>
                                    }
                                    </>

                            }

                        </div>
                    </div>

                    <div className='w-full my-[20px] self-center h-[1px] bg-gray-200'></div>
                    <div className='flex flex-col'>

                        {/*<AboutMeItem Editor={RelationshipSelect} itemType={ProfileForm.Graduate}  Icon={<FaGraduationCap size={26} />} text={`Đã tốt nghiệp tại THPT ${graduate}`} />*/}

                        <AboutMeItem Editor={RelationshipSelect} itemType={ProfileForm.Relationship}
                                     Icon={<FaHeart size={26}></FaHeart>} text={getVNWord(relationship)} />

                        {/*<AboutMeItem Editor={BirthdaySelect} itemType={ProfileForm.Birthday}*/}
                        {/*             Icon={<FaBirthdayCake size={26} />} text={birthday} />*/}
                        {
                            gender === 'Male' ?
                                <AboutMeItem Editor={GenderSelect} itemType={ProfileForm.Gender}
                                             Icon={<FaMale size={26} />} text={'Nam'} />
                                :
                                <AboutMeItem Editor={GenderSelect} itemType={ProfileForm.Gender}
                                             Icon={<FaFemale size={26} />} text={'Nữ'} />

                        }
                    </div>
                </div>
            </div>
        </AboutContext.Provider>

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