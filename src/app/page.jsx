'use client';
import { useEffect, useState, useRef } from "react";
import { useHomeStore } from "./store/useHomeStore";
import { Box, Typography, Avatar, IconButton, Button, Tooltip } from "@mui/material";
import "./globals.css";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CloseIcon from '@mui/icons-material/Close';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';


// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

// Modal
import Modal from '@mui/material/Modal';

// Post icons
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import { Favorite } from "@mui/icons-material";
import MoreHorizSharpIcon from '@mui/icons-material/MoreHorizSharp';
import AddIcon from '@mui/icons-material/Add';

// Date
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

// Config
import { apiSoftInsta } from "./config/config";
import Link from "next/link";
import ModalViewPost from "@/app/components/modal-post-view/modal-post-view";
import { useProfileStore } from "@/store/user-profile/user-profile";
import { useProfileById } from "@/store/user-profile/user-profile-by-id";
import { useToolsStore } from "@/store/smile-tools/smile-tools";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useSettingStore } from "@/store/pages/setting/useSettingStore";
import { useRouter } from "next/navigation";



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "100%",
  height: '100vh',
  bgcolor: '#404040',
  boxShadow: 24,
  p: 4,
};


const formatInstagramDate = (dateString) => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true, locale: ru });
};


export default function Main() {
 
  const { story, getStory,postsState,setPostsState,favoritePost, posts, getPosts, likePost, userProfile, setInitialSlide, getUserProfile, setOpenModalViewPost, postStory, users, getUsers, myStory, getMyStory, deleteStory, likeStory, storiesState, setStoriesState  } = useHomeStore();
  const { person: IAM, getPerson, myId } = useProfileStore();
  const {windowWidth: ww} = useToolsStore()
  const { setPersonId } = useProfileById();
  const [shadowColor, setShadowColor] = useState("rgba(0, 0, 0, 0.5)");
  const {darkMode} = useSettingStore()
  
  
  useEffect(() => {
    getPerson();
  }, []);
  
  const videoRef = useRef(null);

  // Video Gradient
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const video = videoRef?.current;

    video?.addEventListener("play", () => {
      setInterval(() => {
        if (video.paused || video.ended) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        let r = 0, g = 0, b = 0;
        let pixelCount = pixels.length / 4;
        for (let i = 0; i < pixels.length; i += 4) {
          r += pixels[i];
          g += pixels[i + 1];
          b += pixels[i + 2];
        }

        r = Math.floor(r / pixelCount);
        g = Math.floor(g / pixelCount);
        b = Math.floor(b / pixelCount);

        setShadowColor(`rgba(${r}, ${g}, ${b}, 0.5)`);
      }, 100);
    });
  }, []);


  useEffect(() => {
    getStory()
    getPosts()
    getUserProfile()
    getUsers()
    getMyStory()
  }, [getStory, getPosts, getUserProfile, getUsers, getMyStory]);

  const [open, setOpen] = useState(false);
  const [currentUserStory, setCurrentUserStory] = useState(null);
  const [StoryDeleteId, setStoryDeleteId] = useState(null);

  const handleOpen = (userStory) => {
    setCurrentUserStory(userStory);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentUserStory(null);
  };


  // Modal Story
  const [openStory, setOpenStory] = useState(false);
  const handleOpenStory = () => setOpenStory(true);
  const handleCloseStory = () => setOpenStory(false);

  // Modal delete Story
  const [openDeleteStory, setOpenDeleteStory] = useState(false);
  const handleOpenDeleteStory = () => setOpenDeleteStory(true);
  const handleCloseDeleteStory = () => setOpenDeleteStory(false);



// Story
const isImage = (fileName) => {
  return /\.(jpg|jpeg|png|gif|bmp|webp|tiff|svg|ico|heic|heif|raw|cr2|nef|orf|sr2|dng|arw|avif)$/i.test(fileName);
};

const isVideo = (fileName) => {
  return /\.(mp4|webm|ogg|mov|avi|mkv|flv|wmv|3gp|m4v|f4v|rmvb|mts|m2ts|asf|vob|divx)$/i.test(fileName);
};

// Post
const isImagePost = (images) => {
  return /\.(jpg|jpeg|png|gif|bmp|webp|tiff|svg|ico|heic|heif|raw|cr2|nef|orf|sr2|dng|arw|avif)$/i.test(images);
};

const isVideoPost = (images) => {
  return /\.(mp4|webm|ogg|mov|avi|mkv|flv|wmv|3gp|m4v|f4v|rmvb|mts|m2ts|asf|vob|divx)$/i.test(images);
};


  // Post Form Story
  const handleSubmit = async (event) => {
    event.preventDefault();
    const files = event.target["images"].files;
  
    if (files.length > 1) {
      alert(Error);
      return;
    }
  
    const obj = new FormData();
    obj.append('Image', files[0]);
  
    await postStory(obj);
    handleCloseStory();
  };


  // Style Story
  const styleStory = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  
  //-----------
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  //------------


  // button style
  const buttonS = 'w-full py-3 px-8 border-t-[1px] border-gray-500/40 duration-200 active:bg-gray-400/30'

  // Pagination Post
  const [textOpen,setTextOpen] = useState(false)



  // File Selected Post Modal 
  const [fileSelected, setFileSelected] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileSelected(true); 
    } else {
      setFileSelected(false); 
    }
  };


  // BackPoints 
  const bp = {
    'w1483': ww <= 1483 ? true : false,
    'w1387': ww <= 1387 ? true : false,
    'w972': ww <= 972 ? true : false,
    'w400': ww <= 400 ? true : false
  }



  // Story Like
  function handleLikeStory(elem) {
    likeStory(elem.id)
    const arr = storiesState.map((el)=>{
      el.stories.map((ele)=>{
        console.log(ele);
        if(ele.id == elem.id){
          ele.liked = !ele.liked
        }
        return ele
      })
      return el
    })
    console.log(arr,'arr');
    setStoriesState(arr)
  }

  
  // Post Like & Favorite
  function handleLikePost(el) {
    likePost(el.postId)
    setPostsState(postsState.map((ele)=>{
      if(ele.postId == el.postId){
        ele.postLike = !ele.postLike,
        ele.postLikeCount = ele.postLike ? ele.postLikeCount + 1 : ele.postLikeCount - 1 
      }
      return ele
     }))
  }

  function handleFavoritePost(el) {
    favoritePost(el.postId)
    setPostsState(postsState.map((ele)=>{
      if(ele.postId == el.postId){
        ele.postFavorite = !ele.postFavorite
      }
      return ele
     }))
  }


  return (
    <Box className='h-screen overflow-auto'>
  <ModalViewPost />
  <Box className={`flex justify-around gap-[25px] p-[30px_5px] ${bp.w972 ? 'flex-col p-[10px]' : 'flex'}`}>


  <Box className={`max-w-[750px] w-[100%] ${bp.w1387 ? "m-auto" : ''} `}>

    {/* Map Stories */}
      <Box className="flex gap-[25px] max-w-[800px] w-[100%] justify-center items-center">
        {/* My Story */}
    <Box className={`cursor-pointer flex flex-col items-center w-[100px] h-[80px] `} onClick={handleOpenStory}>
    <IconButton
    sx={{
        width: 65,
        height: 65,
        margin: 'auto',
        bgcolor: 'gray',
        color: 'white',
        borderRadius: '50%',
        ":hover":{color: 'gray'}
      }}> 
      <AddIcon/> 
      </IconButton>
    <Typography fontSize={"14px"}>История</Typography>
   </Box>
        <IconButton className="custom-prev cursor-pointer w-[25px] h-[25px]"
         sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
           color: 'white', 
           '&:hover': {
             backgroundColor: 'rgba(0, 0, 0, 0.5)',
           },
           display: bp.w972 ? 'none' : ''
        }}
        >
          <KeyboardArrowLeftIcon sx={{display: bp.w972 ? 'none' : ''}} />
        </IconButton>
        
        <Swiper
          slidesPerView={7}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          modules={[Navigation]}
          breakpoints={{
            320: {
              slidesPerView: 3,
              spaceBetween: 6,
            },
            420: {
              slidesPerView: 4,
              spaceBetween: 8,
            },
            700: {
              slidesPerView: 6,
              spaceBetween: 5,
            },
            900: {
              slidesPerView: 7,
              spaceBetween: 3,
            },
            1024: {
              slidesPerView: 7,
              spaceBetween: 2,
            },
          }}
          className="mySwiper"
        >
        {Array.isArray(story) && 
        story?.length > 0 && 
        story?.filter((el) => el.stories?.some((story) => story.fileName !== null))
        ?.map((el, index) => {
          return (
            <SwiperSlide key={index}>
              <Box sx={{backgroundColor: darkMode ? 'var(--background)' : ''}} onClick={() => handleOpen(el)} className="cursor-pointer duration-300 flex flex-col items-center">
                <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 rounded-full p-[3px]">
                <Avatar
                  src={
                    el.userImage && el.userImage.trim() !== ""
                      ? `${apiSoftInsta}/images/${el.userImage}`
                      : `https://via.placeholder.com/150/000000/FFFFFF?text=${el?.userName?.[0]?.toUpperCase() || "U"}`
                  }
                  alt={`Photo of ${el?.userName || "User"}`}
                  sx={{
                    height: bp.w972 ? 55 : 65,
                    width: bp.w972 ? 55 : 65
                  }}
                />
                </div>
                <Typography sx={{ fontSize: bp.w972 ? '16px' : '17' }}>
                  {el?.userName?.length > 7 ? `${el?.userName.slice(0, 7)}...` : el?.userName || "user"}
                </Typography>
              </Box>
            </SwiperSlide>
          );
        })}
        </Swiper>
        <IconButton className="custom-next cursor-pointer  w-[25px] h-[25px]"
         sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
           color: 'white', 
           '&:hover': {
             backgroundColor: 'rgba(0, 0, 0, 0.5)',
           },
           display: bp.w972 ? 'none' : ''
        }}
        >
          <KeyboardArrowRightIcon sx={{display: bp.w972 ? 'none' : ''}} />
        </IconButton>
      </Box>


 
      {/* Map Posts */}
      <Box className="max-w-[450px] m-auto mt-[50px]">  
        {postsState.length > 0 &&
          postsState.map((el, index)=>{
            const fileType = el?.images[0]?.split('.').pop() || '';
            return(
              <Box key={index} className="mb-[80px] flex flex-col shadow-lg gap-2 rounded-lg">
                <Box className="flex justify-between items-center p-3">
                <Link href={el?.userName != IAM.userName ? `/profile/${el.userName}` : '/profile'}
                    onClick={() => {
                      setPersonId(el.userId)
                    }}
                  className="flex gap-[15px] items-center">
                <Avatar
                  src={
                    el.userImage && el.userImage.trim() !== ""
                      ? `${apiSoftInsta}/images/${el.userImage}`
                      : `https://via.placeholder.com/150/000000/FFFFFF?text=${el?.userName?.[0]?.toUpperCase() || "U"}`
                  }
                  alt={`Photo of ${el?.userName || "User"}`}
                  sx={{
                    width: 45,
                    height: 45,
                  }}
                />
                <Box>
                <Typography fontWeight={"600"}>{el?.userName || "user"}</Typography> 
                <Typography fontSize={"13px"}>{formatInstagramDate(el.datePublished)}</Typography> 
                </Box>
                </Link>
                <IconButton sx={{color: darkMode ? 'white' : 'black'}}> <MoreHorizSharpIcon/> </IconButton>
                </Box>
               
                 <Box className="cursor-pointer" onClick={() => {setOpenModalViewPost(); setInitialSlide(index)}}>
                {isImagePost(el?.images[0]) ? (
                      <img
                        src={`${apiSoftInsta}/images/${el?.images[0]}`}
                        alt={`Post of ${el?.userName}`}
                        className="w-[100%] h-[80vh] object-cover rounded-[5px]"
                      />
                    ) : isVideoPost(el?.images[0]) ? (
                      <video
                      controls
                        // autoPlay
                        loop
                        className="rounded-[5px]"

                      ref={videoRef}
                        style={{
                          width: "100%",
                          height: "80vh",
                          objectFit: "cover",
                          boxShadow: `0px 4px 12px ${shadowColor}`,
                        }}
                      >
                        <source
                          src={`${apiSoftInsta}/images/${el?.images[0]}`}
                          type={`video/${fileType}`}
                        />
                        Your browser does not support the video tag.
                      </video>
                      ) : (
                      <Typography sx={{ textAlign: "center" }}>
                        Unsupported media type.
                      </Typography>
                    )}
                    </Box>

                    <Box className="flex items-center justify-between mt-[10px]">
                      <Box className="flex items-center">
                      <IconButton  onClick={() => handleLikePost(el)}> { el.postLike ? <Favorite className="text-red-500" /> : <FavoriteBorderIcon sx={{color:'red'}}/> } </IconButton>
                      <IconButton  sx={{color: darkMode ? 'white' : 'black'}} onClick={() => {setOpenModalViewPost(); setInitialSlide(index)}}> <ChatBubbleOutlineIcon/> </IconButton>
                      <IconButton  sx={{color: darkMode ? 'white' : 'black'}}> <SendOutlinedIcon/> </IconButton>
                      </Box>
                      <IconButton  sx={{color: darkMode ? 'white' : 'gray'}} onClick={()=>handleFavoritePost(el)} >{ el.postFavorite ? <BookmarkIcon /> : <BookmarkBorderOutlinedIcon /> }  </IconButton>
                    </Box>

                  <Box className="m-[5px_10px]">
                    <Typography fontSize={"15px"} fontWeight={"600"}>{el.postLikeCount} отметкок "Нравится"</Typography>
                   <Box className="flex items-center gap-[10px]">
                    <Link href={el.userName != IAM.userName ? `/profile/${el.userName}` : '/profile'}
                    onClick={() => {
                      setPersonId(el.userId)
                    }} fontSize={"15px"} className="font-medium">{el?.userName}</Link>
                       <Typography fontSize={"17px"} >{el?.title}</Typography>
                    </Box>
                     <Box>
                    <Tooltip title={textOpen ? "" : "Увидеть больше"}>
                       <Typography 
                       sx={{
                        fontSize: "14px",
                        display: "-webkit-box",
                        WebkitLineClamp: textOpen ? "none" : "1",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        opacity:"70%",
                        textOverflow: textOpen ? "unset" : "ellipsis",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        color: "gray"
                      }}
                      onClick={()=>setTextOpen(!textOpen)}
                      >{el?.content}
                      </Typography>
                      </Tooltip>
                     </Box>
                  </Box>

              </Box>
            )
          })
        }
      </Box>
        </Box>

      
   
   {/* userProfile & Recomendation users*/}
     <Box className="max-w-[300px]">
      <Box className={`items-center flex gap-[10px] ${bp.w1387 ? "hidden" : "block"}`}>
       {
       <Link href={userProfile?.userName != IAM.userName ? `/profile/${userProfile?.userName}` : '/profile'}
       onClick={() => {
         setPersonId(userProfile?.userId)
       }}> <Avatar
        src={
          userProfile?.image && userProfile?.image.trim() !== ""
            ? `${apiSoftInsta}/images/${userProfile?.image}`
            : `https://via.placeholder.com/150/000000/FFFFFF?text=${userProfile?.userName?.[0]?.toUpperCase() || "U"}`
        }
        alt={`Photo of ${userProfile?.userName || "User"}`}
        sx={{
          width: 65,
          height: 65,
          cursor: "pointer"
        }}
      /> </Link>
       }
       <Box>
       <Link href={userProfile?.userName != IAM.userName ? `/profile/${userProfile?.userName}` : '/profile'}
       onClick={() => {
         setPersonId(userProfile?.userId)
       }}> <Typography fontWeight={"700"} fontSize={"20px"}>{userProfile?.userName}</Typography> </Link>
        <Box className="flex items-center gap-[7px]">
          <Typography fontSize={"15px"}>{userProfile?.firstName}</Typography>
          <Typography fontSize={"15px"}>{userProfile?.lastName}</Typography>
        </Box>
       <Link className="text-[12px] text-blue-600 font-medium" href="/login">Переключиться</Link>
       </Box>
       </Box>

       <Box className={`mt-[30px] ${bp.w1387 ? 'hidden' : ''} `}>
        <Typography fontWeight={"600"} color="gray">Рекомендации для вас</Typography>
        <Box>
        {users.length > 0 &&
         users.slice(0,6).map((person, i) => (
            <Box
                key={i}
                className='flex items-center gap-3 mt-[10px] text-start'
                   >
                  <Avatar
                  src={
                    person?.avatar && person?.avatar.trim() !== ""
                      ? `${apiSoftInsta}/images/${person?.avatar}`
                      : `https://via.placeholder.com/150/000000/FFFFFF?text=${person?.userName?.[0]?.toUpperCase() || "User"}`
                  }
                  alt={`Photo of ${person?.userName || "User"}`}
                  sx={{
                    width: 50,
                    height: 50,
                  }}
                />
                  <Link href={person?.userName != IAM.userName ? `/profile/${person?.userName}` : '/profile'}
                    onClick={() => {
                      setPersonId(person?.id)
                    }}>
                    <p className='text-sm font-[600]'>{person?.userName || "user"}</p>
                    <p className='text-sm text-gray-500/90'> • Подписчики: {person?.subscribersCount}</p>
                </Link>
                </Box>
            ))}
        </Box>
        <div className="flex flex-wrap mt-[20px] text-[12px] text-gray-400">
         Информация - Помощь - Пресса - API - Вакансии - Конфиденциальность - Условия - Места - Язык - Meta Verified
        </div>
        <p className="mt-[13px] text-gray-400 text-[13px]">© 2024 INSTAGRAM FROM META</p>
       </Box>
        </Box>

      </Box>


      {/* Modal Story */}
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        {/* User Image & Name */}
        <Box className="flex items-center justify-between">
         <Link href={currentUserStory?.userName != IAM.userName ? `/profile/${currentUserStory?.userName}` : '/profile'}
                    onClick={() => {
                      setPersonId(currentUserStory?.userId)
                    }}
                  >
          <Box className="flex gap-[10px] items-center">
            <Avatar
              src={
                currentUserStory?.userImage && currentUserStory?.userImage.trim() !== ""
                  ? `${apiSoftInsta}/images/${currentUserStory?.userImage}`
                  : `https://via.placeholder.com/150/000000/FFFFFF?text=${currentUserStory?.userName?.[0]?.toUpperCase() || "U"}`
              }
              alt={`Photo of ${currentUserStory?.userName}`}
              sx={{
                width: 55,
                height: 55,
              }}
            />
            <Typography sx={{ color: "white", fontWeight: "700", fontSize: "28px" }}>
              {currentUserStory?.userName || "user"}
            </Typography>
          </Box>
          </Link>
          <IconButton onClick={handleClose}>
            <CloseIcon className="text-white" />
          </IconButton>
        </Box>

        <Box
        sx={{height: bp.w972 ? '550px' : '600px'}}
         className='mt-[20px] relative max-w-[400px] h-[600px] m-auto w-full'>
          <Swiper
            pagination={{
              type: 'fraction',
              color: "white",
            }}
            modules={[Pagination, Navigation]}
            className="mySwiper rounded-[10px]"
            slidesPerView={1}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
          >
            {currentUserStory?.stories?.length > 0 &&
              currentUserStory?.stories?.filter((el) => el?.fileName).map((el, index) => {
                const fileType = el?.fileName?.split('.').pop() || '';
                return (
                  <SwiperSlide key={index}>
                    <div className="w-full relative bg-[black] rounded-lg h-full">
                      {isImage(el?.fileName) ? (
                        <img
                          src={`${apiSoftInsta}/images/${el?.fileName}`}
                          alt={`Story of ${el?.userName}`}
                          className="h-full object-cover"
                        />
                      ) : isVideo(el?.fileName) ? (
                        <video autoPlay loop className="h-full object-cover m-auto">
                          <source
                            src={`${apiSoftInsta}/images/${el?.fileName}`}
                            type={`video/${fileType}`}
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <Typography sx={{ color: "white", textAlign: "center" }}>
                          Unsupported media type.
                        </Typography>
                      )}
                      <div className="flex w-full justify-between items-center absolute top-2 p-[0px_10px] z-50 ">
                        <Typography fontSize={"13px"} fontWeight={"600"} style={{ color: "gray" }}>
                          {formatInstagramDate(el?.createAt)}
                        </Typography>
                        <Box className="flex gap-[8px] items-center">
                        { currentUserStory.userId !== myId && (
                        <IconButton  onClick={() => handleLikeStory(el) }> { el.liked ? <Favorite className="text-red-500" /> : <FavoriteBorderIcon sx={{color:'red'}}/> } </IconButton>
                        )}
                        { currentUserStory.userId == myId && (<MoreHorizSharpIcon
                          onClick={() => {
                            handleOpenDeleteStory();
                            setStoryDeleteId(el?.id);
                          }}
                          sx={{ cursor: "pointer", color: "gray" }}
                        />)}
                        </Box>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
          </Swiper>
          {currentUserStory?.stories?.length > 1 && (
            <Box className="absolute top-[-50%] left-0 w-full h-full flex items-center justify-between">
              <IconButton
                className="custom-prev cursor-pointer absolute top-1/2 left-2 transform -translate-y-1/2 z-50"
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  },
                  width: '25px',
                  height: '25px'
                }}
              >
                <KeyboardArrowLeftIcon className="text-white" />
              </IconButton>
              <IconButton
                className="custom-next cursor-pointer absolute top-1/2 right-2 transform -translate-y-1/2 z-50"
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  },
                  width: '25px',
                  height: '25px'
                }}
              >
                <KeyboardArrowRightIcon className="text-white" />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>




      {/* Post Modal Story */}
     <Modal
      open={openStory}
      onClose={handleCloseStory}
      aria-labelledby='modal-modal-delete-comment'
    >
      <Box className='outline-none'
        sx={{
          backgroundColor: darkMode ? "#121212" : "background.paper",
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 3,
          boxShadow: 24
        }}
      >
        <div className='w-full text-sm font-[600]'>
        <form onSubmit={handleSubmit}>
         <input
           ref={fileInputRef}
           className="hidden"
           name="images"
           type="file"
           onChange={handleFileChange}
         />
         <button
           type="button"                 
           onClick={handleButtonClick}
           className={buttonS}
         >
           Добавить историю
         </button>
         <button 
         className={buttonS} 
         type='submit'
         disabled={!fileSelected} 
         style={{
          cursor: !fileSelected ? 'not-allowed' : 'pointer'
        }}
        
         >Сохранить
         </button>
          </form>
          <button
            onClick={handleCloseStory}
            className={buttonS}
          >
            Отмена
          </button>
        </div>
      </Box>
    </Modal>


    {/* Modal delete Story */}
    <Modal
      open={openDeleteStory}
      onClose={handleCloseDeleteStory}
      aria-labelledby='modal-modal-delete-comment'
    >
      <Box className='outline-none'
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: 400,
          backgroundColor: darkMode ? "#121212" : "background.paper",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 3,
          boxShadow: 24
        }}
      >
        <div className='w-full text-sm font-[600]'>
         <button onClick={()=> {deleteStory(StoryDeleteId); handleCloseDeleteStory()}} style={{color: "red"}} className={buttonS}>Удалить историю</button>
          <button onClick={handleCloseDeleteStory} className={buttonS}>Отмена</button>
        </div>
      </Box>
    </Modal>


    </Box>
  );
}
