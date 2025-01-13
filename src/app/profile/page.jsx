'use client'
import {
  AssignmentInd,
  AutoAwesomeMotionRounded,
  BookmarkBorderOutlined,
  BookmarkOutlined,
  Favorite,
  FmdBadOutlined,
  GridOn,
  ModeComment,
  Person,
  RemoveRedEye,
  VideoLibraryRounded
} from '@mui/icons-material'
import Image from 'next/image'
import { apiSoftInsta } from '../config/config'
import {
  Box,
  Button,
  IconButton,
  Menu,
  Tab,
  Tabs,
  Typography
} from '@mui/material'
import { useProfileStore } from '@/store/user-profile/user-profile'
import { useEffect, useRef, useState } from 'react'
import { action, setting, video } from '@/assets/icon/layout/svg'
import PropTypes from 'prop-types'
import React from 'react'
import Link from 'next/link'
import ModalPhoto from '@/components/shared/modal-photo/modal-photo'
import AlertO from '@/components/shared/alert/alert'
import ModalViewPost from '@/components/shared/modal-view-post/modal-view-post'
import { useToolsStore } from '@/store/smile-tools/smile-tools'
import ModalMyProfileSettings from '@/components/shared/modal-profile-my-setting/modal-profile-my-setting'
import ModalViewSubscribers from '@/components/shared/modal-view-subscribers/modal-view-subscribers'
import { useProfileById } from '@/store/user-profile/user-profile-by-id'
import { useSettingStore } from '@/store/pages/setting/useSettingStore'
import ModalViewSavedPost from '@/components/shared/modal-view-saved-post-by-id/modal-view-saved-post-by-id'
import ThemeSwitcher from '../components/ThemeSwitcher'
import { useTranslation } from 'react-i18next'
import ModalViewSubscriptions from '@/components/shared/modal-view-subscribers/modal-view-subscriptions'
import ProfileHoverMenu from '@/components/shared/hover-popover-to-view-profile/hover-popover-to-view-profile'
import ModalViewReel from '@/components/shared/modal-view-post/modal-view-reels'

const menuStyle = 'flex gap-4 p-4 text-sm cursor-pointer active:scale-90 active:opacity-50 items-center rounded-2xl hover:bg-slate-400/20 duration-300'
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ width: '100%', maxWidth: '900px', marginX: 'auto' }}>{children}</Box>}
    </div>
  )
}

const isImage = (fileName) => {
  return /\.(jpg|jpeg|png|gif|bmp)$/i.test(fileName);

};

const isVideo = (fileName) => {
  return /\.(mp4|webm|ogg|x-matroska|mkw)$/i.test(fileName);
};

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

const Profile = () => {
  const [value, setValue] = React.useState(0)
  const [Mouse, setMouse] = React.useState(false)
  const [MouseId, setMouseId] = React.useState(null)
  const [anchorEl, setAnchorEl] = useState(null);
  const [initReelSlide, setInitReelSlide] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenModalViewReel, setIsOpenModalViewReel] = useState(false);
  const [savedPerson, setSavedPerson] = useState({});
  const open = Boolean(anchorEl);
  const { t } = useTranslation();
  const { windowWidth: ww } = useToolsStore()
  const {
    getPerson,
    person,
    getPersonPosts,
    setOpenModalPhoto,
    personPosts,
    setOpenModalViewPost,
    setInitialSlideOfSavedPost,
    setOpenModalViewSavedPost,
    getPersonReels,
    personReels,
    setOpenModalMyProfileSettings,
    setInitialSlide,
    setOpenModalViewSubscribers,
    myId,
    personSaved,
    getPersonSaved,
    stateDetector
  } = useProfileStore()
  const { setPersonId, personId } = useProfileById()
  const { darkMode: dm } = useSettingStore()

  const myReels = personReels.filter(video => video.userId == myId).sort((a, b) => a.postId - b.postId);


  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleClick = (event) => {
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

  const buttonStyle = {
    color: dm ? 'white' : 'black',
    bgcolor: '#bbb5',
    fontSize: bp.w835 ? '12px' : '14px',
    fontWeight: '600',
    padding: bp.w835 ? '3px 10px' : '5px 16px',
    textTransform: 'none',
    borderRadius: '10px'
  }

  const btnS = {
    textTransform: 'none',
    color: dm ? 'white' : 'black',
    flexWrap: 'wrap',
    padding: bp.w540 ? '10px 5px' : '0 10px',
  }

  useEffect(() => {
    getPerson()
    getPersonPosts()
    getPersonReels()
  }, [])

  useEffect(() => {
    getPersonSaved()
  }, [stateDetector]);


  if (typeof window !== 'undefined') {
    return (
      <div className={`flex flex-col h-screen overflow-y-auto pb-20 ${bp.w767 ? '' : 'pt-14'}`}>
        <title>Profile</title>
        <ModalMyProfileSettings />
        <ModalViewPost />
        <ModalViewSavedPost savedPerson={savedPerson} />
        <ModalViewSubscribers />
        <ModalViewSubscriptions isOpen={isOpen} onClose={() => setIsOpen(false)} />
        <ModalViewReel initialSlide={initReelSlide} isOpenModalViewReel={isOpenModalViewReel} setCloseModalViewReel={() => {
          setIsOpenModalViewReel(false)
        }} />
        <AlertO />
        <ModalPhoto />
        {bp.w767 && <div className="flex items-center border-b-[1px] p-2 py-1 sticky top-0 border-gray-500/50 w-full">
          <IconButton sx={{ color: dm ? 'white' : 'black', }} onClick={handleClick}>
            <p className='modal-text relative text-[14px] flex gap-1 items-center'>{setting} More</p>
          </IconButton>

          <ProfileHoverMenu />
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              sx: {
                borderRadius: '20px',
                padding: '0px',
                bgcolor: 'transparent',
                boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.1)',
              },
            }}
            MenuListProps={{
              sx: {
                padding: 0,
                bgcolor: 'transparent'
              },
            }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <div className='flex flex-col rounded-xl'>
              <div className={`flex flex-col ${dm ? 'bg-gray-900 text-white' : 'bg-white'} border-gray-500/20 border-b-2 p-2`}>
                <Link href='/setting'>
                  <div className={menuStyle}>
                    <p>{setting}</p>
                    <p>Настройки</p>
                  </div>
                </Link>
                <div className={menuStyle}>
                  <p>{action}</p>
                  <p>Ваши действия</p>
                </div>
                <div className={menuStyle}>
                  <p><BookmarkBorderOutlined /></p>
                  <p>Сохранённое</p>
                </div>
                <ThemeSwitcher />
                <div className={menuStyle.concat(' ')}>
                  <p><FmdBadOutlined /></p>
                  <p>Сообшить о проблеме</p>
                </div>
              </div>

              <div className={`flex flex-col ${dm ? 'bg-gray-900 text-white' : 'bg-white'} border-gray-500/20 border-t-2 p-2`}>
                <div className={menuStyle}>
                  <p>Переключить аккаунт</p>
                </div>
                <div className={menuStyle}>
                  <p>Выйти</p>
                </div>
              </div>
            </div>
          </Menu>
        </div>}
        <div className={`flex ${bp.w540 ? 'gap-2 justify-between' : 'justify-between gap-10'} p-2 w-full max-w-[800px] mx-auto`}>
          <IconButton className={'bg-cover bg-center'} sx={{ width: bp.w835 ? bp.w540 ? '60px' : '130px' : '150px', color: 'white', backgroundImage: `url("${apiSoftInsta + '/images/' + person.image}")`, border: person.image ? 'none' : '1px solid #bbb', marginTop: bp.w540 ? '20px' : '', height: bp.w835 ? bp.w540 ? '60px' : '130px' : '150px' }} onClick={setOpenModalPhoto}>
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
              <Person className='text-gray-500 scale-150' />
            )}
          </IconButton>
          <div className='flex flex-col gap-6'>
            <div className={`flex flex-wrap ${bp.w835 ? 'gap-1' : 'gap-2'} h-fit`}>
              {!bp.w540 &&
                <Typography variant='h6' sx={{ marginRight: '10px', maxWidth: 'fit-content', overflow: 'hidden' }}>
                  {person.userName}
                </Typography>
              }
              {!bp.w540 &&
                <div className={`flex items-center ${bp.w835 ? 'gap-1' : 'gap-2'}`}>
                  <Link href='/setting'>
                    <Button sx={buttonStyle}>Редактировать профиль</Button>
                  </Link>
                  <Button sx={buttonStyle}>Посмотреть архив</Button>
                  <IconButton sx={{ color: dm ? 'white' : 'black', }} onClick={() => {
                    setOpenModalMyProfileSettings()
                  }}>
                    <p className='scale-[1.3]'>{setting}</p>
                  </IconButton>
                </div>
              }
            </div>
            <div className={`flex h-fit ${bp.w540 ? 'justify-between' : 'gap-8'}`}>
              <Button sx={btnS}>
                <span className='font-[600] mr-1'>{person.postCount}</span> публикаций
              </Button>
              <Button onClick={() => {
                setOpenModalViewSubscribers()
                setPersonId(myId)
              }} color='primary' sx={btnS}>
                <span className='font-[600] mr-1'>{person.subscribersCount}</span>{' '}
                подписчиков
              </Button>
              <Button onClick={() => {
                setIsOpen(true)
                setPersonId(myId)
              }} color='primary' sx={btnS}>
                <span className='font-[600] mr-1'>{person.subscriptionsCount}</span>{' '}
                подписок
              </Button>
            </div>
            {!bp.w540 &&
              <div>
                <p className='font-[600] text-sm'>
                  {person.lastName} {person.firstName}
                </p>
                <p className='font-[400] text-sm'>
                  {person.about}
                </p>
              </div>
            }
          </div>
        </div>
        <Box className={`${bp.w540 ? 'mt-5' : 'mt-20'} mx-auto gap-4 flex flex-col max-w-[952px]`} sx={{ width: '100%' }}>

          {bp.w540 &&
            <div className='p-2'>
              <Typography variant='h6' sx={{ marginRight: '10px', maxWidth: 'fit-content', overflow: 'hidden' }}>
                {person.userName}
              </Typography>
              <div>
                <p className='font-[600] text-sm'>
                  {person.lastName} {person.firstName}
                </p>
                <p className='font-[400] text-sm'>
                  {person.about}
                </p>
              </div>
            </div>
          }
          {bp.w540 &&
            <div className={`flex items-center p-2 justify-between pb-2 gap-1`}>
              <Link className='flex-grow-[1] w-max shrink-0' href='/setting'>
                <Button sx={{ ...buttonStyle, width: '100%', flexGrow: '1' }}>Редактировать профиль</Button>
              </Link>
              <Button sx={{ ...buttonStyle, flexGrow: '1' }}>Посмотреть архив</Button>
              <IconButton sx={{ color: dm ? 'white' : 'black', }} onClick={() => {
                setOpenModalMyProfileSettings()
              }}>
                <p className='scale-[1.3]'>{setting}</p>
              </IconButton>
            </div>
          }
          <Box sx={{ borderBottom: 1, borderColor: '#aaa5', width: '100%', marginX: 'auto' }}>
            <Tabs
              textColor='black'
              sx={{ marginX: 'auto', width: bp.w540 ? '100%' : 'fit-content', color: '#000' }}
              value={value}
              onChange={handleChange}
              aria-label='basic tabs example'
            >
              <Tab sx={{ minWidth: bp.w540 ? 'auto' : '', color: dm ? 'white' : 'black', flexGrow: bp.w540 ? '1' : '0' }}
                label={<div><GridOn sx={{ color: !bp.w540 ? 'gray' : '' }} /> {!bp.w540 ? 'Публикации' : ''} </div>} {...a11yProps(0)} />
              <Tab sx={{ minWidth: bp.w540 ? 'auto' : '', color: dm ? 'white' : 'black', flexGrow: bp.w540 ? '1' : '0' }}
                label={
                  <div className={`flex font-bold ${!bp.w540 && 'text-transparent'} modal-text  items-center`}>
                    <h1 className={`${!bp.w540 ? 'text-gray-500' : dm ? 'text-white' : 'text-black'} scale-90 mr-1`}>{video}</h1>
                    {!bp.w540 ? 'Reels' : ''}
                  </div>
                }
                {...a11yProps(1)}
              />
              <Tab sx={{ minWidth: bp.w540 ? 'auto' : '', color: dm ? 'white' : 'black', flexGrow: bp.w540 ? '1' : '0' }}
                label={
                  <p className={`${dm ? 'text-white' : 'text-black'}`}><BookmarkOutlined sx={{ color: !bp.w540 ? 'gray' : dm ? 'white' : 'black' }} />
                    {!bp.w540 && 'Сохраненное'}
                  </p>
                }
                {...a11yProps(2)}
              />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            {personPosts.length > 0 ?
              <div className='w-full mx-auto grid h-full gap-1 grid-cols-3'>
                {personPosts?.map((post, i) => (
                  <div
                    onClick={() => {
                      setOpenModalViewPost();
                      setInitialSlide(i)
                    }}
                    className='relative w-full max-w-[300px] h-[28vw] max-h-[300px] overflow-hidden bg-cover bg-center'
                    style={{}}
                    key={i}
                  >{isImage(post?.images[0]) &&
                    <Image
                      src={apiSoftInsta + '/images/' + post.images[0]}
                      alt=''
                      width={100}
                      height={100}
                      className='absolute w-full object-cover rounded h-full'
                      unoptimized
                    />
                    } {isVideo(post?.images[0]) &&
                      <video
                        className="absolute w-full rounded h-full object-cover"
                      >
                        <source
                          src={`${apiSoftInsta}/images/${post?.images[0]}`}
                          type={`video/${post?.images[0].split('.').pop() || ''}`}
                        />
                        Your browser does not support the video tag.
                      </video>
                    }
                    <Button
                      sx={{
                        width: '100%',
                        position: 'relative',
                        height: '100%',
                        gap: '10px',
                        color: 'transparent',
                        ':hover': {
                          bgcolor: '#0005',
                          color: '#fff'
                        }
                      }}
                    >
                      {(isImage(post?.images[0]) ?
                        (post.images.length > 1 ? <AutoAwesomeMotionRounded
                          sx={{
                            position: 'absolute',
                            right: '5px',
                            top: '5px',
                            color: 'white'
                          }}
                        /> : '') :
                        <VideoLibraryRounded
                          sx={{
                            position: 'absolute',
                            right: '5px',
                            top: '5px',
                            color: 'white'
                          }}
                        />
                      )}
                      <div className='flex flex-wrap gap-1'>
                        {post.postLikeCount != 0 && (
                          <div className='flex gap-1'>
                            <Favorite />
                            <p>{post.postLikeCount}</p>
                          </div>
                        )}
                        <div>
                          <ModeComment /> {post.commentCount}
                        </div>
                      </div>
                    </Button>
                  </div>
                ))
                }</div>
              :
              <div className='w-full flex flex-col items-center h-full gap-2 mt-10 justify-center'>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAADMUlEQVR4nO2az0tlZRyH338jx4Xp9f6SfmAYDUlNNIzpaDMYxlRMGOp17lxrkUyjiyJIGoaBCYKCYYhcRC1yLDU1f1yVe71Dq1m1mZWgf0HZZlbP8DWtQ/Dlwut54WucB57F510cnnvOWdzFcS4hISEhISEhoQ4N79PXOMZmY4m/GsfApNJWYqOhRK+Lk6arfN50FU6YU7H8+FSRvpYiNBd51Fzko0yJBmcUaWsucl1apfnJKzG8CekCm5lRSBe47k4I6QIT0pwpUD72xdpG2G8rQLbAE7Jzo/TkC+zJmSWlKTdCtzRK6+H5n8e+AU8Pg/jPHmLv6Mygu1q3N+1DIGrbCsE6O94DUdtWCNZ5ehBEbVshWGfnuyBq2wrBOs9cBlHbVgjWefYdELVthWCdXW+DqG0rBOs8fwlEbVshWOfrb4KobV/G71Mbvw8H1qha7XT9AyBq25eJbYhqtdMNvAGitn35pApRrXa6t/pB1LYvUxWIarXTXb4IorZ9ubkFUa12usELIGrbly82IarVTjfcB6K2fflqA6Ja7XSjvSBq25e76xDVaqcr9YCobY3pVWrTaxCH367V/5/g21mXD7pB1LbG96sQp6E66/JhF4ja1phZgTgN1VmXa+dA1LbGz8tU55YhFpeohOqsy+RZELXty/ISRLXa6T5+FURt+1JehKhWO92nr4CobV8qCxDVaqebehlEbfvy2zxEtdrpbrwEorZ9eTAHUa12uludIGrbl99/gqhWO93tF0HUti8PZyGq1U735WkQte3LzgzVnXtwaMVqp/v6BRC1bYVgnXeeB1HbVgjW+U0HiNq2QrDO6edA1LYVgnV+1w6itq0QrPOHZ0HUthWCdf74DIjatkKwztmnQNS2FYJ1zreBeLTn8uwdnZkz/+9HUv/t9mYxx/5SHlYzf38guZijezHHrpxZUpp+yfOaNC60curgLM8fx74BK1k2VrLwa5YJd0JYyTJ52Hz8DyXXsvSWM1BO86icZuLoTbDIeiunylkmD1ozsNHK+VguvJliaqsVTpQpPnNxUknRW01R3m5hfzsFJm1hXxprcT35hISEhISEBPd/5jEXJP55Km2alwAAAABJRU5ErkJggg==" alt="plus-2-math" />
                <p className='text-center text-gray-500 text-2xl font-bold'>Публикаций нет</p>
                <p className='text-center text-gray-500'>Создайте свою первую публикацию</p>
              </div>}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            {myReels.length > 0 ?
              <div className='w-full mx-auto grid h-full gap-1 grid-cols-3'>
                {myReels?.map((post, i) => (isVideo(post?.images) &&
                  <div
                    className='relative overflow-hidden w-full h-[43vw] max-h-[370px] bg-cover bg-center'
                    onClick={() => {
                      setIsOpenModalViewReel(true)
                      setInitReelSlide(i)
                    }}
                    onPointerEnter={() => {
                      setMouse(true)
                      setMouseId(post.postId)
                    }
                    }
                    onPointerLeave={() => {
                      setMouse(false)
                    }
                    }
                    key={i}
                  > {isVideo(post?.images) &&
                    <video
                      className="absolute w-full rounded h-full object-cover"
                    >
                      <source
                        src={`${apiSoftInsta}/images/${post?.images}`}
                        type={`video/${post?.images.split('.').pop() || ''}`}
                      />
                      Your browser does not support the video tag.
                    </video>
                    }
                    <Button
                      sx={{
                        width: '100%',
                        position: 'relative',
                        height: '100%',
                        gap: '10px',
                        color: 'transparent',
                        ':hover': {
                          bgcolor: '#0005',
                          color: '#fff'
                        }
                      }}
                    >

                      {(
                        <div style={{ opacity: MouseId == post.postId && Mouse ? '0' : '1', transition: 'all 0.2s' }} className='absolute left-2 flex gap-1 bottom-2'>
                          <RemoveRedEye sx={{ color: 'white' }} />
                          <p className='text-white'>{post.postView}</p>
                        </div>
                      )}

                      <div className='flex flex-wrap gap-1'>
                        {post.postLike && (
                          <div className='flex gap-1'>
                            <Favorite />
                            <p>{post.postLikeCount}</p>
                          </div>
                        )}
                        <div>
                          <ModeComment /> {post.commentCount}
                        </div>
                      </div>
                    </Button>
                  </div>
                ))}
              </div> :
              <div className='w-full flex flex-col items-center h-full gap-2 mt-10 justify-center'>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAADeElEQVR4nO2XzWuUVxSHj12I/QtK0kXJtFJUWjFtmMlXQyRGjV9JqsWUJm0UGaqJTRDFWtpYmpoxVBdD20AjiRgVbOlHRFEEP7BgUrvtoot2FdOtuHCpTzm5piBmGOI9ceaW+8CzmDOX3/ubw/u+JCKRSCQSiUQikblZ3sfi0m6OlnTxT2k3hGBJN9OlXWS0u/hS2kWm0D/IwwHvBZToNl1Y1X9LeXSBJ5ZVJPOSvdTM3gniy0t7QM03K7Z5rrPz5pUPQc03K7Z5rrPzZlka1HyzYpvnOjtvXt8FIeu9gPKdELLeC0h+AKoEhlnvmg5QJTDMete/B6oEhlnvNe+CKoFh1rtpO6gSGGa9t7wDqgSGWe+tW0H1r8SilhZSal8fz8kCY9a7rRVU35ztLQzOZrW1crutmUpZQKx6S3szqAY59zTn/XaX197Mw/YtnO7YwIveJRewt+zYDKpVTvdNSA/Czlb3uXMz9zs3cXjbNp73LjvH9byD0htBtcrpueX86DLsPgjpTW6e3shUegMd+q7wLm3YW7qaQLXK+fTXx/34DPR0uu9mXM/k7iaSxdJbeteBapUzeGMOr8PnX8O+t92ZnrU86F3Hqb2reaHQvWV/I6hWOUNXc/vNRej/BA6sd2f3N3L3QCNrCtlbDjWAapVz+kp+R85BZo87f6iBvwvZW/pWg2qVM34pv+fOwvFd7vxn9U+3AKve0l8HqlXOtQu5vfIjjOyD/np3tv8t7n5RR0Mhe0umFlSrnN/Hn/T2L3D+CBxf685kankwUMupLz1egla95Vg1qFY5f/70uLeyMNzivlO/quLGsWpWFktvyVaCapUz/YPzrxEY3wHZKjfPVjKVTdGB0R9CVr1lKAmqVc7UWbjeC99Vu8/fJrk/lOTwaB1LvMvOcT3voBMVoPrmDL/JPc0Zq3d5wxU8PFHB2MnUwvwzZNVbTr4BqkHO4GzWaDm/jZaT8i73DHrLmVWg+ubosz1WTkq1es6fRW/5fiWoEhhmvX9+DVQJDLPeF1aAKoFh1vvyMlAlMMx6X30VVAkMs943l4IqgWHWe+JlCFnvBUwmIGTNFiB5ZsU2jwtIxDsAq0dgWoMmEtQU8paez3yyjNqZWRl3xJfJBAOFfpE9rRMJjngv4I/lLH60hJk7IQjLuKM/Xrt7LyASiUQikUhE/qf8C11P8gg1P6hwAAAAAElFTkSuQmCC" alt="video" />
                <p className='text-center text-gray-500 text-2xl font-bold'>Видео нет</p>
                <p className='text-center text-gray-500'>Снимите своё первое видео</p>
              </div>}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            {personSaved.length > 0 ?
              <div className='w-full mx-auto grid h-full gap-1 grid-cols-3'>
                {personSaved?.map((post, i) => (
                  <div
                    onClick={() => {
                      setOpenModalViewSavedPost();
                      setSavedPerson(post)
                      setInitialSlideOfSavedPost(i)
                    }}
                    className='relative w-full max-w-[300px] h-[28vw] max-h-[300px] overflow-hidden bg-cover bg-center'
                    style={{}}
                    key={i}
                  >{isImage(post?.images[0]) &&
                    <Image
                      src={apiSoftInsta + '/images/' + post.images[0]}
                      alt=''
                      width={100}
                      height={100}
                      className='absolute w-full object-cover rounded h-full'
                      unoptimized
                    />
                    } {isVideo(post?.images[0]) &&
                      <video
                        className="absolute w-full rounded h-full object-cover"
                      >
                        <source
                          src={`${apiSoftInsta}/images/${post?.images[0]}`}
                          type={`video/${post?.images[0].split('.').pop() || ''}`}
                        />
                        Your browser does not support the video tag.
                      </video>
                    }
                    <Button
                      sx={{
                        width: '100%',
                        position: 'relative',
                        height: '100%',
                        gap: '10px',
                        color: 'transparent',
                        ':hover': {
                          bgcolor: '#0005',
                          color: '#fff'
                        }
                      }}
                    >
                      {(isImage(post?.images[0]) ?
                        (post.images.length > 1 ? <AutoAwesomeMotionRounded
                          sx={{
                            position: 'absolute',
                            right: '5px',
                            top: '5px',
                            color: 'white'
                          }}
                        /> : '') :
                        <VideoLibraryRounded
                          sx={{
                            position: 'absolute',
                            right: '5px',
                            top: '5px',
                            color: 'white'
                          }}
                        />
                      )}

                      <div className='flex flex-wrap gap-1'>
                        {post.postLikeCount != 0 && (
                          <div className='flex gap-1'>
                            <Favorite />
                            <p>{post.postLikeCount}</p>
                          </div>
                        )}
                        <div>
                          <ModeComment /> {post.commentCount}
                        </div>
                      </div>
                    </Button>
                  </div>
                ))}
              </div> :
              <div className='w-full flex flex-col items-center h-full gap-2 mt-10 justify-center'>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEgElEQVR4nO2aX0xbZRiHzxWJej2SyUgclFII8mddxgaDMDPiImA3DAZC+a/VDkxMTICamKhzgMYZL0wwJhqVxZiZVebGKDAobHC5aGgMEeMdNdM77W7w5jEvac009JxT+p2OY/okT+Arv/N+v35tSnJSTcuSJUuWLFkMyX+FlvwhwvmD3M8fgofhoSH+OjTIRv4Qrx/08aiWKZ44z9jh87Cv9HO34GVyLX/yDj8tDj8U+tl2+BkuHuTxJDnEZOs09v9nTmkbOYl13Ijlh+D0ES5+CZw+RvRykhGTrfdKsrlOH5HET0sPoeRFYqU+cPk4qJeTjJhsvVeSzXX0caDUx7r8XuJjw6jfnil/AcRUc2avS2duZR8HygdY33lsgA23FYdQNQBiqjmz16U7Vw6hcoB1eayy34JDONoPomGuj6jk3H2clLW7j3sPrvfCkV7q4jPu/Wvdz9aDuXIvue4+IvFsRNaaKo73gmgiN57IWm11D2P/3f+El9zqHiLxv0dkreQAantANMrJv6iabsZru4kmrrHArZoexmSv3TrIk67tISLZmm7uHm/jkbQPoL4LRM0myCHUd/GLdK7zEkh74CkviJqNaOikSTo3ePkx7WGNnSBqNqLRy2PS+XQn22kPO9MBYipZq1XdW5emdhBTyVptKl20dPE8D6JmM5T1bm0DUbMZynq3PQeiZjOU9e5oBdFwwzZyOs7xbnsrvyauscBoeysTspeq3oZ4z4FolOs8y0QimwHHVfU2pMcDolGu20NUcr0eajSL6DrLSdlD9lLV25D+Z0FUlbNdH18ziKpytuvjbwJRVU4YWcUzssryyBr3xeE1wiN3aHlYfXQZegZEVbm3Vph4+zbs6goXVe1jNmfIq2dAVJH7YAnPpWXQ8/0wzZnqY4rXngZRRW7yFssfL4Kek4ssZaqPKYYbQVSR+3KO2NQ8GPhnpvqYInAaRBW54CyxYAj0vBrij0z1McUbT4GoIjc3Q3huBvQM3WAxU31M8eYpEFXk7nxHy9p10PUGTZnqY4oLDSCqyn0/zcUfpmFXv+VCpvsYMl4PoqqcsBmkeTPI0s9BYuJmkMWfruq/8lb20eW9OhBV5WzX51ItiKpytuvzYQ2IqnK26/PRCRDN5jKlqt6GTFaDaDaXKVX1NuSTYyCqytmuz2dHQTSRi0ruU/fevw9guMcR6uJ7bKnqbcgXbhCNcp+7GU9kM+CYqt6GXK4C0Sh3pZScy1WMT1USTVxjgVtTVYzJXqp6G/J1JYiazVDW+5sKEL+q2v0LkvuRKxXkJXqnPSz4JOxYxqhmE4JlBBK90x52rQzibk+XMTpdvH/fCdcryLtWRkC6JnqnPXSmFOxs2gcw6yIWKoGbLtpnXdwMlfC7rPejsy5+C7mYka7xx3TvL5pi3snSQjEsOO3zGbDgIrDTuVj/9popwg6aw04IF7EddjI6v48/A24VkRcuIhDvylKRuZsshqw4eOd2EdhKh/HttZRYO0zzaiGLawXE1gphX1pALN5RzSufJUuWLFm0/zd/A2QjaxnLuz+oAAAAAElFTkSuQmCC" alt="save" />
                <p className='text-center text-gray-500 text-2xl font-bold'>Видео нет</p>
                <p className='text-center text-gray-500'>Снимите своё первое видео</p>
              </div>}
          </CustomTabPanel>
        </Box>
      </div>
    )
  }
}

export default Profile