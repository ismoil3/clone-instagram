'use client'
import { useProfileStore } from '@/store/user-profile/user-profile'
import { Avatar, IconButton, Menu, Modal } from '@mui/material'
import { useEffect, useState } from 'react'
import { SwiperSlide, Swiper } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import {
  AddReactionOutlined,
  Favorite,
  FavoriteBorderOutlined,
  KeyboardArrowLeft,
  MoreHorizOutlined,
  Person,
  SendRounded
} from '@mui/icons-material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Image from 'next/image'
import { apiSoftInsta } from '@/app/config/config'

import EmojiPicker from 'emoji-picker-react';
import { useHomeStore } from '@/app/store/useHomeStore'
import ModalDeletePost from '@/components/shared/modal-delete-post/modal-delete-post'
import ModalDeleteOkPost from '@/components/shared/modal-delete-post/modal-ok-delete-post'
import ModalDeleteComment from '@/components/shared/modal-delete-comment/modal-delete-comment'
import { useToolsStore } from '@/store/smile-tools/smile-tools'
import { useSettingStore } from '@/store/pages/setting/useSettingStore'
import { jwtDecode } from 'jwt-decode'

function timeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) {
    return `Сейчас`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} мин.`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} час.`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} дн.`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} нед.`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} мес.`
  }

  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears} лет.`
}

const isImage = fileName => {
  return /\.(jpg|jpeg|png|gif|bmp)$/i.test(fileName)
}

const isVideo = fileName => {
  return /\.(mp4|webm|ogg|x-matroska|mkw)$/i.test(fileName)
}

const ModalViewPost = () => {
  const [PlayIndex, setPlayIndex] = useState(null)
  const [DoNotPlay, setDoNotPlay] = useState('')
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentPostId, setCurrentPostId] = useState(null);
  const open = Boolean(anchorEl);
  const { getPosts, posts,setPostsState, setCloseModalViewPost, initialSlide, isOpenModalViewPost, likePost, postsState, favoritePost } = useHomeStore()
  const {
    person,
    inputs,
    setInput,
    addCommentToPost,
    setOpenModalDeleteComment,
    setOpenModalDeletePost,
    setCommentId,
    setPostId,
  } = useProfileStore()

  const {windowWidth: ww} = useToolsStore()

  // BackPoints 
  const bp = {
    'w1483': ww <= 1483 ? true : false,
    'w1387': ww <= 1387 ? true : false,
    'w1025': ww <= 1025 ? true : false,
    'w972': ww <= 972 ? true : false,
    'w400': ww <= 400 ? true : false
  }


  useEffect(() => {
    getPosts()
  }, [])


  
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

  const myToken  = localStorage.getItem('access_token') ? jwtDecode(localStorage.getItem('access_token'))?.sid : null

  const handleClick = (event, postId) => {
    setCurrentPostId(postId);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  async function handlePostComment (post) {
    let myToken = jwtDecode(localStorage.getItem('access_token'))
    console.log(myToken);
    let obj = {
      postCommentId: Date.now(),
      userName: myToken.name,
      userImage: myToken.sub,
      dateCommented: new Date(),
      comment:   setInput(post.postId, ''),
      userId: myToken.sid
    }
    addCommentToPost({ comment:  inputs[post.postId], postId: post.postId })
    setInput(post.postId, '')
    setPostsState(postsState.map((ele)=>{
      if(ele.postId == post.postId){
       ele.commentCount = ele.commentCount + 1,
       ele.comments = [...ele.comments,{ comment:  inputs[post.postId], postId: post.postId,dateCommented: Date.now(), }]
      }
      return ele
     }))
  }
  // ...prevState,
  // commentCount: prevState.commentCount + 1,
  // comments: [...prevState.comments,obj]
console.log(postsState,'salom');
  const {darkMode} = useSettingStore()

  return (
    <>
      <ModalDeletePost />
      <ModalDeleteOkPost />
      <ModalDeleteComment />
      <Modal
        open={isOpenModalViewPost}
        onClose={setCloseModalViewPost}
        aria-labelledby='modal-modal-delete'
      >
        <div
          className={`w-[100%] p-2 absolute outline-none translate-x-[-50%] translate-y-[-50%] h-[90vh] left-[57%] top-[50%] flex gap-4 justify-between items-center`}
          onClick={setCloseModalViewPost}
        >
          <div
            className={`h-[100%] w-[87%] `}
            onClick={e => {
              e.stopPropagation()
            }}
          >
            <Swiper
              navigation={{
                nextEl: '.ForwardSli',
                prevEl: '.backSli'
              }}
              onSlideChange={e => {
                setPlayIndex(e.activeIndex)
                setDoNotPlay(JSON.stringify(e?.slides[e.activeIndex]?.firstChild?.firstChild?.firstChild?.firstChild?.firstChild?.innerHTML).slice(0, 5))
              }}
              pagination={false}
              modules={[Navigation]}
              initialSlide={initialSlide}
              allowTouchMove={false}
              className='mySwiper rounded size-[100%]'
            >
              {postsState.map((post, i) => (
                <SwiperSlide key={i}>
                  <div
                    className='size-full grid grid-cols-2'
                    onPointerEnter={e => {
                      e.stopPropagation()
                    }}
                    onClick={e => {
                      e.stopPropagation()
                    }}
                  >
                    <Swiper
                      navigation={true}
                      pagination={{ clickable: true }}
                      nested={true}
                      onSlideChange={(swiper) => {
                        swiper.slides.forEach((slide, index) => {
                          const video = slide.querySelector('video');
                          if (video) {
                            video.pause();
                            video.currentTime = 0;
                            video.classList.remove('playing-video');
                          }
                        });

                        const activeSlide = swiper.slides[swiper.activeIndex];
                        const activeVideo = activeSlide?.querySelector('video');
                        if (activeVideo) {
                          activeVideo.classList.add('playing-video');
                          activeVideo.play().catch((err) => {
                            console.log('Ошибка воспроизведения видео:', err);
                          });
                        }
                      }}
                      modules={[Navigation, Pagination]}
                      className='mySwiper size-[100%]'
                    >
                      {post.images.map((item, index) => (
                        <SwiperSlide key={index}>
                          <div className={`h-full bg-gray-900 w-full ${bp.w972 ? 'none' : 'block'} `}>
                            {isImage(item) && (
                              <Image
                                src={apiSoftInsta + '/images/' + item}
                                alt=''
                                width={100}
                                height={100}
                                className='w-full h-full object-cover'
                                unoptimized
                              />
                            )}{' '}
                            {isVideo(item) && (
                              <video
                                loop
                                controls
                                muted
                                preload='auto'
                                id={`video-${i}`}
                                className=' w-full h-full'
                              >
                                <source
                                  src={`${apiSoftInsta}/images/${item}`}
                                  type={`video/${item.split('.').pop() || ''}`}
                                />
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    <div style={{scrollbarWidth:'none'}} className='flex modal-theme flex-col overflow-auto h-full justify-between'>
                      <div>
                        <div className={`flex justify-between items-center border-b-[1px] p-3 modal-theme z-50 sticky top-0`}>
                          <div className='flex gap-4 items-center'>
                            <div
                              className='size-[37px] bg-cover bg-center border rounded-full flex flex-col items-center justify-center'
                            >
                              <Avatar
                                  src={
                                  post?.userImage && post?.userImage.trim() !== ""
                                  ? `${apiSoftInsta}/images/${post?.userImage}`
                                    : `https://via.placeholder.com/150/000000/FFFFFF?text=${post?.userName?.[0]?.toUpperCase() || "U"}`
                                }
                                alt={`Photo of ${post?.userName || "User"}`}
                                sx={{
                                  width: 45,
                                  height: 45,
                                }}
                              />
                            </div>
                            <p className='font-[500] text-[15px]'>
                              {post?.userName}
                            </p>
                          </div>
                          <IconButton onClick={() => {
                            setOpenModalDeletePost()
                            setPostId(post.postId)
                          }}>
                            <MoreHorizOutlined sx={{color: 'var(--foreground)'}} />
                          </IconButton>
                        </div>

                        <div className='modal-theme'>
                          {post.comments?.length > 0 &&
                            post.comments?.map((comment, ic) => (
                              <div
                                key={ic}
                                className='p-4 modal-theme py-2 border-b-[1px] border-gray-500/50 flex justify-between items-center'
                              >
                                <div className='flex gap-4 items-center'>
                                  <div
                                    style={{
                                      backgroundImage: `url("${apiSoftInsta + '/images/' + person.image
                                        }")`
                                    }}
                                    className='size-[37px] bg-cover bg-center border rounded-full flex flex-col items-center justify-center'
                                  >
                                    {person.image ? (
                                      <Image
                                        className={
                                          'size-[0%] rounded-full shadow-lg'
                                        }
                                        src={
                                          apiSoftInsta +
                                          '/images/' +
                                          person.image
                                        }
                                        width={50}
                                        priority
                                        height={50}
                                        alt='Me'
                                      />
                                    ) : (
                                      <Person className='text-gray-500' />
                                    )}
                                  </div>
                                  <div className='flex flex-col items-start'>
                                    <p className='font-[500] text-[13px]'>
                                      {comment.comment}
                                    </p>
                                    <div className='flex items-center gap-3'>
                                      <p className='font-[500] text-[13px]'>
                                        {timeAgo(comment.dateCommented)}
                                      </p>
                                      <IconButton
                                        onClick={() => {
                                          setOpenModalDeleteComment()
                                          setCommentId(comment.postCommentId)
                                        }}
                                      >
                                        <MoreHorizOutlined sx={{color: 'var(--foreground)'}} />
                                      </IconButton>
                                    </div>
                                  </div>
                                </div>
                                <IconButton>
                                  <FavoriteBorderOutlined />
                                </IconButton>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div className='items-start flex modal-theme z-50 sticky bottom-0 border-t-[1px] border-gray-500/40 flex-col w-full'>
                        <div className='flex justify-between w-full px-2 py-2'>
                          <IconButton  onClick={() => handleLikePost(post)}> { post.postLike ? <Favorite className="text-red-500" /> : <FavoriteBorderIcon sx={{color:'red'}}/> } </IconButton>
                          <IconButton onClick={()=> handleFavoritePost(post)} >{ post.postFavorite ? <BookmarkIcon sx={{color: 'var(--foreground)'}} /> : <BookmarkBorderOutlinedIcon sx={{color: 'var(--foreground)'}} /> }  </IconButton>
                        </div>
                        <div className='flex flex-col items-start px-4 py-2'>
                          <p className='font-[600] text-sm'>
                            {post.postLikeCount}{' '}
                            {'отмет' + (post.postLikeCount > 1 ? 'ок' : 'ка')}{' '}
                            {'"Нравится"'}
                          </p>
                          <p className='text-[13px] text-gray-500'>
                            {timeAgo(post.datePublished)} 
                          </p>
                        </div>

                        <div className='px-2 gap-2 border-t-[1px] border-gray-500/50 w-full items-center justify-between flex'>
                          <div>
                            <Menu
                              anchorEl={anchorEl}
                              open={open}
                              sx={{ maxWidth: '500px', top:'-75px', right:'-155px', width: '100%', maxHeight: '500px' }}
                              onClose={handleClose}
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                            >

                              <EmojiPicker onEmojiClick={(e) => {
                                if (currentPostId) {
                                  setInput(
                                    currentPostId,
                                    inputs[currentPostId] ? inputs[currentPostId] + e?.emoji : e?.emoji
                                  );
                                }
                              }} />
                            </Menu>
                            <IconButton color='primary' onClick={(e) => handleClick( e, post.postId)}>
                              <AddReactionOutlined />
                            </IconButton>
                          </div>
                          <input
                            id={`input-comment-${post.postId}`}
                            type='text'
                            className='w-full outline-none p-4 modal-theme text-sm placeholder:text-sm'
                            placeholder='Добавьте комментарий...'
                            value={inputs[post.postId] || ''} 
                            onChange={e => {
                              setInput(post.postId, e.target.value)
                            }}
                            onKeyPress={e => {
                              if (e.key == 'Enter'){
                                handlePostComment(post)
                              }
                            }}
                          />
                          <IconButton
                            disabled={
                              inputs[post.postId]?.trim() ? false : true
                            }
                            onClick={() => {
                              addCommentToPost({
                                comment: inputs[post.postId],
                                postId: post.postId
                              })
                              setInput(post.postId, '')
                            }}
                            color='primary'
                          >
                            <SendRounded sx={{color: inputs[post.postId]?.trim() ? '#55f' : '#aaa'}} />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ModalViewPost