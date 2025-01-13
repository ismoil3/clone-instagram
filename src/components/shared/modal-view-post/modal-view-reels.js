'use client'
import { useProfileStore } from '@/store/user-profile/user-profile'
import { Box, IconButton, Menu, Modal } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { SwiperSlide, Swiper } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import {
    AddReactionOutlined,
    Bookmark,
    BookmarkBorderOutlined,
    Favorite,
    FavoriteBorderOutlined,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    ModeCommentRounded,
    MoreHorizOutlined,
    NavigateBefore,
    Person,
    SendRounded
} from '@mui/icons-material'
import Image from 'next/image'
import { apiSoftInsta } from '@/app/config/config'
import ModalDeleteComment from '../modal-delete-comment/modal-delete-comment'
import ModalDeletePost from '../modal-delete-post/modal-delete-post'
import ModalDeleteOkPost from '../modal-delete-post/modal-ok-delete-post'
import { useToolsStore } from '@/store/smile-tools/smile-tools'
import EmojiPicker from 'emoji-picker-react';
import SwipableDrawer from '../swipable-drawer/swipable-drawer'
import { useSettingStore } from '@/store/pages/setting/useSettingStore'

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

const ModalViewReel = ({ isOpenModalViewReel, setCloseModalViewReel, initialSlide }) => {
    const [PlayIndex, setPlayIndex] = useState(null)
    const [DoNotPlay, setDoNotPlay] = useState('')
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentPostId, setCurrentPostId] = useState(null);
    const [showHeart, setShowHeart] = useState(false);
    const [heartPosition, setHeartPosition] = useState({ x: 0, y: 0 });
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const { darkMode: dm } = useSettingStore()

    const handleDoubleClick = (e) => {
        e.preventDefault();
        const { clientX, clientY } = e;

        setHeartPosition({ x: clientX, y: clientY });
        setShowHeart(true);

        setTimeout(() => setShowHeart(false), 800);
    };

    const open = Boolean(anchorEl);
    const {
        person,
        inputs,
        setInput,
        likePost,
        addCommentToPost,
        setOpenModalDeleteComment,
        setOpenModalDeletePost,
        setCommentId,
        setPostId,
        savePost,
        getPersonSaved,
        setStateDetector,
        personReels,
        getPersonReels,
        myId
    } = useProfileStore()
    const { windowWidth: ww } = useToolsStore()

    useEffect(() => {
        getPersonReels()
    }, [])

    const myReels = personReels.filter(video => video.userId == myId).sort((a, b) => a.postId - b.postId);

    const handleClick = (event, postId) => {
        setCurrentPostId(postId);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const bp = new Proxy({}, {
        get(target, prop) {
            if (prop.startsWith('w')) {
                const width = parseInt(prop.slice(1), 10);
                if (!isNaN(width)) {
                    return ww <= width ? true : false;
                }
            }
            return undefined;
        }
    });

    return (
        <>
            <ModalDeletePost />
            <ModalDeleteOkPost />
            <ModalDeleteComment />
            <Modal
                open={isOpenModalViewReel}
                onClose={setCloseModalViewReel}
                aria-labelledby='modal-modal-delete'
            >
                <div
                    className={'w-[100%] outline-none absolute translate-x-[-50%] overflow-y-auto translate-y-[-50%] left-[50%] top-[50%] flex justify-between '.concat(bp.w767 ? 'h-full p-0 flex-col' : 'h-[90vh] p-2 items-center gap-4')}
                    onClick={setCloseModalViewReel}
                >
                    {bp.w767 &&
                        <div onClick={setCloseModalViewReel} className={` ${dm ? 'bg-[#111]' : 'bg-white'} cursor-pointer z-50 sticky top-0 p-1 w-full`}>
                            <NavigateBefore /> Публикации
                        </div>
                    }
                    {!bp.w767 &&
                        <IconButton
                            onClick={e => {
                                e.stopPropagation()
                                const video = document.getElementById(`video-${PlayIndex}`)
                                PlayIndex >= 0 && DoNotPlay != '"<img' ? video?.play() : ''

                                PlayIndex >= 0
                                    ? document.getElementById(`video-${PlayIndex + 1}`)?.pause()
                                    : ''
                                if (
                                    document.getElementById(`video-${PlayIndex + 1}`)
                                ) {
                                    document.getElementById(
                                        `video-${PlayIndex + 1}`
                                    ).currentTime = 0
                                }
                            }}
                            className='backSli'
                            sx={{
                                backgroundColor: 'white',
                                ':hover': {
                                    bgcolor: '#fff7'
                                },
                                transition: 'all 0.2s',
                                ':active': {
                                    scale: '.9'
                                }
                            }}
                        >
                            <KeyboardArrowLeft />
                        </IconButton>}
                    <div
                        className={`h-[100%] ${dm ? 'bg-[#111]' : 'white'} `.concat(bp.w767 ? 'w-[100%]' : 'w-[87%]')}
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
                            className={`mySwiper ${bp.w767 ? '' : 'rounded'} ${dm ? 'bg-[#111]' : 'white'} size-[100%]`}
                        >
                            {myReels.map((post, i) => (
                                <SwiperSlide className={`${dm ? 'bg-[#111]' : 'white'}`} key={i}>
                                    <div
                                        className={`size-full ${dm ? 'bg-[#111]' : 'white'} grid `.concat(bp.w767 ? 'grid-cols-1 overflow-y-auto' : 'grid-cols-2')}
                                        onPointerEnter={e => {
                                            e.stopPropagation()
                                        }}
                                        onClick={e => {
                                            e.stopPropagation()
                                        }}
                                    >

                                        {bp.w767 &&
                                            <div className={`flex justify-between sticky top-0 h-fit ${dm ? 'bg-[#111]' : 'bg-white'} z-50 items-center border-b-[1px] p-3`}>
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
                                                                className={'size-[0%] rounded-full shadow-lg'}
                                                                src={apiSoftInsta + '/images/' + person.image}
                                                                width={50}
                                                                priority
                                                                quality={0}
                                                                height={50}
                                                                alt=''
                                                            />
                                                        ) : (
                                                            <Person className='text-gray-500' />
                                                        )}
                                                    </div>
                                                    <p className='font-[500] text-[13px]'>
                                                        {person.userName}
                                                    </p>
                                                </div>
                                                <IconButton onClick={() => {
                                                    setOpenModalDeletePost()
                                                    setPostId(post.postId)
                                                }}>
                                                    <MoreHorizOutlined sx={{ color: dm ? 'white' : 'black' }} />
                                                </IconButton>
                                            </div>
                                        }
                                        <Swiper
                                            navigation={true}
                                            pagination={{ clickable: true }}
                                            nested={true}
                                            modules={[Navigation, Pagination]}
                                            className={`mySwiper size-[100%] ${dm ? 'bg-[#111]' : 'white'}`}
                                        >
                                            <SwiperSlide className={`${dm ? 'bg-[#111]' : 'white'}`}>
                                                <div
                                                    onDoubleClick={(e) => {
                                                        handleDoubleClick(e)
                                                        likePost(post.postId);
                                                        console.log(myReels);
                                                        
                                                    }}
                                                    className='h-full relative bg-gray-950 w-full'>
                                                    {showHeart && (
                                                        <div
                                                            className="heart-container"
                                                            style={{
                                                                position: "absolute",
                                                                left: `${heartPosition.x}px`,
                                                                top: `${heartPosition.y - 50}px`,
                                                                transform: "translate(-50%, -50%)",
                                                            }}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                width="120"
                                                                height="120"
                                                                fill="url(#heartGradient)"
                                                            >
                                                                <defs>
                                                                    <linearGradient id="heartGradient" x1="0" x2="1" y1="0" y2="1">
                                                                        <stop offset="0%" stopColor="#fa7719" />
                                                                        <stop offset="50%" stopColor="#ff4477" />
                                                                        <stop offset="100%" stopColor="#aa00dd" />
                                                                    </linearGradient>
                                                                </defs>
                                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    {isVideo(post?.images[0]) && (
                                                        <video
                                                            loop
                                                            controls
                                                            muted
                                                            preload='auto'
                                                            className='w-full mb-20 h-full'
                                                        >
                                                            <source
                                                                src={`${apiSoftInsta}/images/${post?.images[0]}`}
                                                                type={`video/${post?.images[0].split('.').pop() || ''}`}
                                                            />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    )}
                                                </div>
                                            </SwiperSlide>
                                        </Swiper>
                                        <div style={{ scrollbarWidth: 'none' }} className='flex flex-col overflow-auto justify-between'>
                                            <div className=''>

                                                {!bp.w767 &&
                                                    <div className={`flex justify-between sticky top-0 ${dm ? 'bg-[#111]' : 'bg-white'} z-50 items-center border-b-[1px] p-3`}>
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
                                                                        className={'size-[0%] rounded-full shadow-lg'}
                                                                        src={apiSoftInsta + '/images/' + person.image}
                                                                        width={50}
                                                                        priority
                                                                        quality={0}
                                                                        height={50}
                                                                        alt=''
                                                                    />
                                                                ) : (
                                                                    <Person className='text-gray-500' />
                                                                )}
                                                            </div>
                                                            <p className='font-[500] text-[13px]'>
                                                                {person.userName}
                                                            </p>
                                                        </div>
                                                        <IconButton onClick={() => {
                                                            setOpenModalDeletePost()
                                                            setPostId(post.postId)
                                                        }}>
                                                            <MoreHorizOutlined sx={{ color: dm ? 'white' : 'black' }} />
                                                        </IconButton>
                                                    </div>
                                                }

                                                {!bp.w767 && <div style={{ scrollbarWidth: 'none' }} className={`overflow-y-scroll ${dm ? 'bg-[#111]' : 'bg-white'} scroll-smooth box-content`}>
                                                    {post.comments?.length > 0 ?
                                                        post.comments?.map((comment, ic) => (
                                                            <div
                                                                key={ic}
                                                                className='p-4 py-2 border-b-[1px] border-gray-500/50 flex justify-between items-center'
                                                            >
                                                                <div className='flex gap-4 items-center'>
                                                                    <div
                                                                        style={{
                                                                            backgroundImage: `url("${apiSoftInsta + '/images/' + comment?.userImage
                                                                                }")`
                                                                        }}
                                                                        className='size-[37px] bg-cover bg-center border rounded-full flex flex-col items-center justify-center'
                                                                    >
                                                                        {comment?.userImage ? (
                                                                            <Image
                                                                                className={
                                                                                    'size-[0%] rounded-full shadow-lg'
                                                                                }
                                                                                src={
                                                                                    apiSoftInsta +
                                                                                    '/images/' +
                                                                                    comment?.userImage
                                                                                }
                                                                                width={50}
                                                                                priority
                                                                                quality={0}
                                                                                height={50}
                                                                                alt=''
                                                                            />
                                                                        ) : (
                                                                            <Person className='text-gray-500' />
                                                                        )}
                                                                    </div>
                                                                    <div className='flex flex-col items-start'>
                                                                        <p className='font-[500] text-[13px]'>
                                                                            {comment?.userName}
                                                                            {comment.comment}
                                                                        </p>
                                                                        <div className='flex items-center gap-3'>
                                                                            <p className='font-[500] text-[13px]'>
                                                                                {timeAgo(comment.dateCommented)}
                                                                            </p>
                                                                            <button className='text-[13px]'>
                                                                                ответить
                                                                            </button>
                                                                            <IconButton
                                                                                onClick={() => {
                                                                                    setOpenModalDeleteComment()
                                                                                    setCommentId(comment.postCommentId)
                                                                                }}
                                                                            >
                                                                                <MoreHorizOutlined sx={{ color: dm ? 'white' : 'black' }} />
                                                                            </IconButton>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <IconButton color='error'>
                                                                    {comment?.commentLike ? (
                                                                        <Favorite
                                                                            sx={{
                                                                                color: 'red',
                                                                                ':active': { scale: '.5' },
                                                                                transition: 'all 0.2s'
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <FavoriteBorderOutlined
                                                                            sx={{
                                                                                ':active': { scale: '.5' },
                                                                                transition: 'all 0.2s'
                                                                            }}
                                                                        />
                                                                    )}
                                                                </IconButton>
                                                            </div>
                                                        )) : <div className='mt-32'>
                                                            <p className='text-2xl font-[700]'>Комментариев пока нет.</p>
                                                            <p className='text-sm mt-2'>Начните переписку.</p>
                                                        </div>}
                                                </div>}
                                                {i == initialSlide && <SwipableDrawer isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)}>
                                                    <div className='flex flex-col h-full'>
                                                        <div style={{ scrollbarWidth: 'none' }} className='overflow-y-scroll pb-14 scroll-smooth'>
                                                            {post.comments?.length > 0 ?
                                                                post.comments?.map((comment, ic) => (
                                                                    <div
                                                                        key={ic}
                                                                        className='p-4 py-2 border-b-[1px] flex justify-between items-center'
                                                                    >
                                                                        <div className='flex gap-4 items-center'>
                                                                            <div
                                                                                style={{
                                                                                    backgroundImage: `url("${apiSoftInsta + '/images/' + comment?.userImage
                                                                                        }")`
                                                                                }}
                                                                                className='size-[37px] bg-cover bg-center border rounded-full flex flex-col items-center justify-center'
                                                                            >
                                                                                {comment?.userImage ? (
                                                                                    <Image
                                                                                        className={
                                                                                            'size-[0%] rounded-full shadow-lg'
                                                                                        }
                                                                                        src={
                                                                                            apiSoftInsta +
                                                                                            '/images/' +
                                                                                            comment?.userImage
                                                                                        }
                                                                                        width={50}
                                                                                        priority
                                                                                        quality={0}
                                                                                        height={50}
                                                                                        alt=''
                                                                                    />
                                                                                ) : (
                                                                                    <Person className='text-gray-500' />
                                                                                )}
                                                                            </div>
                                                                            <div className='flex flex-col items-start'>
                                                                                <p className='font-[500] modal-text text-[13px]'>
                                                                                    {comment?.userName}
                                                                                    {comment.comment}
                                                                                </p>
                                                                                <div className='flex items-center gap-3'>
                                                                                    <p className='font-[500] modal-text text-[13px]'>
                                                                                        {timeAgo(comment.dateCommented)}
                                                                                    </p>
                                                                                    <button className='text-[13px] modal-text'>
                                                                                        ответить
                                                                                    </button>
                                                                                    <IconButton
                                                                                        onClick={() => {
                                                                                            setOpenModalDeleteComment()
                                                                                            setCommentId(comment.postCommentId)
                                                                                        }}
                                                                                    >
                                                                                        <MoreHorizOutlined sx={{ color: dm ? 'white' : 'black' }} />
                                                                                    </IconButton>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <IconButton color='error'>
                                                                            {comment.commentLike ? (
                                                                                <Favorite
                                                                                    sx={{
                                                                                        scale: '.7',
                                                                                        color: 'red',
                                                                                        ':active': { scale: '.5' },
                                                                                        transition: 'all 0.2s'
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                <FavoriteBorderOutlined
                                                                                    sx={{
                                                                                        scale: '.7',
                                                                                        ':active': { scale: '.5' },
                                                                                        transition: 'all 0.2s'
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </IconButton>
                                                                    </div>
                                                                )) : <div className='mt-32 flex flex-col items-center w-full'>
                                                                    <p className='text-2xl font-[700]'>Комментариев пока нет.</p>
                                                                    <p className='text-sm mt-2'>Начните переписку.</p>
                                                                </div>}
                                                        </div>

                                                        <div className={`px-2 gap-2 absolute bottom-0 border-t-[1px] ${dm ? 'bg-[#111]' : 'bg-white'} border-gray-500 w-full items-center justify-between flex`}>
                                                            <div>
                                                                {currentPostId == post.postId && <Menu
                                                                    anchorEl={anchorEl}
                                                                    open={open}
                                                                    MenuListProps={{
                                                                        sx: {
                                                                            padding: '0',
                                                                        }
                                                                    }}
                                                                    PaperProps={{
                                                                        sx: {
                                                                            borderRadius: '20px'
                                                                        },
                                                                    }}
                                                                    sx={{ maxWidth: '500px', top: '-75px', right: '-155px', width: '100%', padding: '0' }}
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
                                                                </Menu>}
                                                                <IconButton color='primary' onClick={(e) => handleClick(e, post.postId)}>
                                                                    <AddReactionOutlined />
                                                                </IconButton>
                                                            </div>
                                                            <input
                                                                id={`input-comment-${post.postId}`}
                                                                type='text'
                                                                className='w-full outline-none modal-text modal-theme p-4 text-sm placeholder:text-sm'
                                                                placeholder='Добавьте комментарий...'
                                                                value={inputs[post.postId] || ''}
                                                                onChange={e => {
                                                                    setInput(post.postId, e.target.value)
                                                                }}
                                                                onKeyPress={e => {
                                                                    if (e.key == 'Enter') {
                                                                        addCommentToPost({
                                                                            comment: inputs[post.postId],
                                                                            postId: post.postId,
                                                                        })
                                                                        setInput(post.postId, '')
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
                                                                <SendRounded sx={{ color: !inputs[post.postId]?.trim() ? 'gray' : '#59f' }} />
                                                            </IconButton>
                                                        </div>
                                                    </div>
                                                </SwipableDrawer>}
                                            </div>

                                            <div className={`items-start flex flex-col border-t-[1px] sticky bottom-0 ${dm ? 'bg-[#111]' : 'bg-white'} z-50 border-gray-500/40 w-full`}>
                                                <div className='flex justify-between w-full px-4 py-2'>
                                                    <div className='flex items-center w-fit gap-2'>
                                                        <IconButton
                                                            color='error'
                                                            onClick={() => likePost(post.postId)}
                                                        >
                                                            {post.postLike ? (
                                                                <Favorite
                                                                    sx={{
                                                                        color: 'red',
                                                                        ':active': { scale: '.5' },
                                                                        transition: 'all 0.2s'
                                                                    }}
                                                                />
                                                            ) : (
                                                                <FavoriteBorderOutlined
                                                                    sx={{
                                                                        ':active': { scale: '.5' },
                                                                        transition: 'all 0.2s'
                                                                    }}
                                                                />
                                                            )}
                                                        </IconButton>
                                                        <IconButton
                                                            onClick={() => {
                                                                document
                                                                    .getElementById(
                                                                        `input-comment-${post.postId}`
                                                                    )
                                                                    ?.focus();
                                                                bp.w767 ? setIsOpenDrawer(true) : setIsOpenDrawer(false);
                                                            }}
                                                        >
                                                            <ModeCommentRounded sx={{ color: dm ? 'white' : '' }} />
                                                        </IconButton>
                                                        <IconButton sx={{ transform: 'rotate(-35deg)' }}>
                                                            <SendRounded sx={{ color: dm ? 'white' : '' }} />
                                                        </IconButton>
                                                    </div>
                                                    <IconButton onClick={() => {
                                                        savePost(post.postId)
                                                        getPersonSaved()
                                                        setStateDetector()
                                                    }}>
                                                        {post.postFavorite ?
                                                            <Bookmark sx={{ color: dm ? 'white' : '' }} />
                                                            :
                                                            <BookmarkBorderOutlined sx={{ color: dm ? 'white' : '' }} />
                                                        }
                                                    </IconButton>
                                                </div>
                                                <div className='flex flex-col items-start px-4 py-2'>
                                                    <p className='font-[600] text-sm'>
                                                        {post.postLikeCount}{' '}
                                                        {'отмет' + (post.postLikeCount > 1 ? 'ок' : 'ка')}{' '}
                                                        {'"нравится"'}
                                                    </p>
                                                    <p className='text-[13px] text-gray-500'>
                                                        {timeAgo(post.datePublished)} назад
                                                    </p>
                                                </div>

                                                {!bp.w767 && <div className='px-2 gap-2 border-t-[1px] border-gray-500 w-full items-center justify-between flex'>
                                                    <div>
                                                        {currentPostId == post.postId && <Menu
                                                            anchorEl={anchorEl}
                                                            open={open}
                                                            MenuListProps={{
                                                                sx: {
                                                                    padding: '0',
                                                                }
                                                            }}
                                                            PaperProps={{
                                                                sx: {
                                                                    borderRadius: '20px'
                                                                },
                                                            }}
                                                            sx={{ maxWidth: '500px', top: '-75px', right: '-155px', width: '100%', padding: '0' }}
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
                                                        </Menu>}
                                                        <IconButton color='primary' onClick={(e) => handleClick(e, post.postId)}>
                                                            <AddReactionOutlined />
                                                        </IconButton>
                                                    </div>
                                                    <input
                                                        id={`input-comment-${post.postId}`}
                                                        type='text'
                                                        className={`w-full outline-none modal-texte p-4 modal-theme text-sm placeholder:text-sm`}
                                                        placeholder='Добавьте комментарий...'
                                                        value={inputs[post.postId] || ''}
                                                        onChange={e => {
                                                            setInput(post.postId, e.target.value)
                                                        }}
                                                        onKeyPress={e => {
                                                            if (e.key == 'Enter') {
                                                                addCommentToPost({
                                                                    comment: inputs[post.postId],
                                                                    postId: post.postId
                                                                })
                                                                setInput(post.postId, '')
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
                                                        <SendRounded sx={{ color: !inputs[post.postId]?.trim() ? 'gray' : '#59f' }} />
                                                    </IconButton>
                                                </div>}
                                            </div>
                                        </div>
                                    </div>


                                </SwiperSlide>

                            ))}
                        </Swiper>
                    </div>

                    {!bp.w767 && <IconButton
                        onClick={e => {
                            e.stopPropagation()
                            const video = document.getElementById(`video-${PlayIndex}`)
                            PlayIndex >= 0 && DoNotPlay != '"<img' ? video?.play() : ''

                            document.getElementById(`video-${PlayIndex - 1}`)?.pause()
                            if (
                                document.getElementById(`video-${PlayIndex - 1}`)
                            ) {
                                document.getElementById(
                                    `video-${PlayIndex - 1}`
                                ).currentTime = 0
                            }
                        }}
                        className='ForwardSli'
                        sx={{
                            backgroundColor: 'white',
                            ':hover': {
                                bgcolor: '#fff7'
                            },
                            transition: 'all 0.2s',
                            ':active': {
                                scale: '.9'
                            }
                        }}
                    >
                        <KeyboardArrowRight />
                    </IconButton>}
                </div>
            </Modal>
        </>
    )
}

export default ModalViewReel