"use client"
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  homeIcon,
  homeIconActive,
  searchIcon,
  searchIconActive,
  compas,
  compasActive,
  video,
  videoActive,
  message,
  messageActive,
  like,
  likeActive,
  action,
  setting,
  threads,
  add,
  instagramMiniLogo,
} from '@/assets/icon/layout/svg';
import { useSearchStore } from '@/store/search-history/search-history';
import ModalDelete from '@/components/shared/modal-delete/modal-delete';
import { BookmarkBorderOutlined, FmdBadOutlined, Person } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import { apiSoftInsta } from '@/app/config/config';
import { useProfileStore } from '@/store/user-profile/user-profile';
import useCreatePost from '@/store/pages/create/createPost';
import Create from '../create-dialog/Create';
import { useProfileById } from '@/store/user-profile/user-profile-by-id';
import ThemeSwitcher from '@/app/components/ThemeSwitcher';
import { useSettingStore } from '@/store/pages/setting/useSettingStore';
import Backdrop from '@mui/material/Backdrop';
/////////
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
const menuStyle = 'flex gap-4 p-4 text-sm cursor-pointer active:scale-90 active:opacity-50 items-center rounded-2xl hover:bg-slate-400/20 duration-300'


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


export default function SideBar({ children }) {
  let { history, getSearchHistory, setSearchValue, deleteHistory, addHistory, setOpenModalDelete, deleteAllUsers, clearSearchValue, searchValue, getUsers, users } = useSearchStore();
  const { person: IAM, getPerson } = useProfileStore();
  const { setPersonId } = useProfileById();
  const { changeCreatePostDialogOpened } = useCreatePost();
  const { darkMode: dm } = useSettingStore()
  useEffect(() => {
    getPerson();
  }, []);

  useEffect(() => {
    getSearchHistory();
    getUsers();
  }, [searchValue]);

  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();
  const router = useRouter()
  const renderIcon = (path, activeIcon, inactiveIcon) => {
    return pathname === path ? inactiveIcon : activeIcon
  }

  document.addEventListener('keydown', (e) => {
    if (e.key == 'Escape') {
      setIsSearchOpen(false)
    }
  })

  const NavLink = ({ href, icon, activeIcon, label, isActive }) => (
    <Link legacyBehavior href={href}>
      <div className={`flex items-center cursor-pointer active:opacity-50 gap-4 rounded-md p-3 hover:bg-gray-500/10 duration-300 hover:scale-[1.01] ${isActive(href)}`}>
        {renderIcon(href, activeIcon, icon)}
        {isSearchOpen ? '' : <p className="text-[16px]">{label}</p>}
      </div>
    </Link>
  );

  const handleSearchOpen = (is) => {
    if (is) {
      setIsSearchOpen(!isSearchOpen);
    } else {
      setIsSearchOpen(false);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openNo, setOpenNo] = useState(false);

  const toggleDrawer = (newOpenNo) => () => {
    setOpenNo(newOpenNo);
  };
  const notifications = []


  const DrawerList = (
    <Box role="presentation" onClick={toggleDrawer(false)}>
      <div className="flex items-center justify-between border-b px-4 py-2 bg-gray-100 dark:bg-gray-900">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
          Уведомления
        </h1>
        <button
          className="text-gray-400 hover:text-red-500 transition"
        >
          &times;
        </button>
      </div>
      <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow flex items-start space-x-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              <img
                src={notification.avatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm text-gray-800 dark:text-white">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {notification.time}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-300">
            Нет новых уведомлений
          </p>
        )}
      </div>
    </Box>
  );

  const isActive = (path) => pathname === path ? 'font-bold' : 'font-normal';

  return (
    <div className='flex w-full h-screen'>
      <ModalDelete />
      <Drawer sx={{ width: "100%" }} PaperProps={{
        sx: {
          width: '500px',
          backgroundColor: 'var(--modal-bg)',
          border: '1px solid white'
        }
      }} anchor={'right'} open={openNo} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>

      <section className={"h-[100%] sticky top-0 border-r-[1px] duration-300 z-[100] border-gray-500/50 " + (isSearchOpen ? 'w-fit' : 'min-w-[245px]')}>
        <div className='flex flex-col h-full justify-between px-3 pb-4'>
          <div className="sideBar flex flex-col h-full">
            <p className={'text-3xl flex italic ' + (isSearchOpen ? "mt-8 mx-auto justify-center w-fit" : 'mt-6 bg-gradient-to-r bg-clip-text text-transparent font-bold pl-2 from-red-500 to-blue-600')}>
              {isSearchOpen ? instagramMiniLogo : "SoftInsta"}
            </p>
            <div className="flex flex-col justify-between">
              <div className="flex flex-col gap-[6px] mt-4">
                <NavLink href="/" icon={homeIcon} activeIcon={homeIconActive} label={t('layout.home')} isActive={isActive} />
                <button onClick={() => handleSearchOpen(true)} className="flex items-center active:opacity-50 gap-4 rounded-md p-3 hover:bg-gray-500/10 duration-300 hover:scale-[1.01] cursor-pointer">
                  {searchIconActive}
                  {isSearchOpen ? '' : <p className="text-md">{t('layout.search')}</p>}
                </button>
                <NavLink href="/explore" icon={compas} activeIcon={compasActive} label={t('layout.explore')} isActive={isActive} />
                <NavLink href="/reels" icon={video} activeIcon={videoActive} label={t('layout.reels')} isActive={isActive} />
                <NavLink href="/chat" icon={message} activeIcon={messageActive} label={t('layout.message')} isActive={isActive} />
                <div onClick={toggleDrawer(true)}><NavLink href="" icon={like} activeIcon={likeActive} label={t('layout.notification')} isActive={isActive} /></div>
                <div onClick={() => changeCreatePostDialogOpened(true)} className="flex items-center active:opacity-50 gap-4 rounded-md p-3 hover:bg-gray-500/10 duration-300 hover:scale-[1.01] cursor-pointer">
                  {add}
                  {isSearchOpen ? '' : <p className="text-md">{t('layout.create')}</p>}
                </div>

                <Link href={'/profile'} className="flex items-center active:opacity-50 gap-4 rounded-md p-3 hover:bg-gray-500/10 duration-300 hover:scale-[1.01] cursor-pointer">
                  {IAM.image ?

                    <Image
                      className={`${router.pathname === '/profile'
                        ? 'border-[2px] border-[#af25ff] rounded-[50%]'
                        : 'font-[400] rounded-[50%]'
                        } text-[16px] rounded-[50%] block w-[25px] h-[25px]`}
                      src={apiSoftInsta + "/images/" + IAM.image}
                      width={50}
                      priority
                      height={50}
                      alt='Profile'
                    />
                    : <Person className='border-[1px] border-gray-600 rounded-full' />
                  }
                  {isSearchOpen ? '' : <p className="text-md">{t('layout.profile')}</p>}
                </Link>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-1'>

            <div className="flex items-center rounded-md p-3 w-full hover:bg-gray-500/10 duration-300 hover:scale-[1.01]">
              <button onClick={handleClick} className="flex w-full items-center gap-5">
                <p className='scale-150 relative left-[4px]'>{setting}</p>
                {isSearchOpen ? '' : <p className="text-md">{t('layout.more')}</p>}
              </button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{ top: '-50px' }}
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
                    <Link href={'/login'}><div className={menuStyle}>
                      <p>Выйти</p>
                    </div></Link>
                  </div>
                </div>
              </Menu>
            </div>
          </div>
        </div>
      </section>
      {true &&
        <div onClick={() => handleSearchOpen(false)} className={"w-full duration-700 fixed left-[72.5px] h-full z-50 ".concat(
          !isSearchOpen ? "-translate-x-[200%]" : "")
        }>
          <div
            className='flex flex-col border-r-[1px] border-l-[1px] w-[396px] modal-theme rounded-r-2xl shadow-[10px_0_15px_] shadow-black/10 border-gray-500/20 h-full'
            onClick={(e) => {
              e.stopPropagation()
            }}>
            <div className='p-4 border-b-[1px] flex flex-col gap-4 pb-6 border-gray-500/20'>
              <p className='text-2xl font-[600] ml-2 mt-2'>{t('layout.search')}</p>
              <div className='mt-6 rounded-lg bg-gray-300/20 w-full items-center flex justify-between py-2 px-4'>
                <input value={searchValue} onChange={setSearchValue} className="outline-none bg-transparent w-full" type="text" placeholder={t('layout.search')} />
                {searchValue != '' &&
                  <button
                    onClick={clearSearchValue}
                    className='bg-gray-500/40 px-[3px] text-white text-sm h-fit py-[0px] rounded-full'>⨉</button>}
              </div>
            </div>
            <div>
              <div className='flex justify-between p-4'>
                <p className='font-[600] text'>Недавнее</p>
                {history.length != 0 &&
                  <button onClick={setOpenModalDelete} className='text-blue-500 hover:text-gray-500 font-[600] text-sm'>Очистить все</button>
                }
              </div>
              {searchValue.trim() == '' ?
                (history.length > 0 ? <div className='flex flex-col h-[63vh] overflow-auto'>{history.length > 0 && history?.slice(0, 7).map((person, i) =>
                  <div
                    onClick={(e) => {
                      if (person?.users.userName !== IAM.userName) {
                        router.push(`/profile/${person?.users.userName}`);
                      } else {
                        router.push('/profile');
                      }

                      setIsSearchOpen(false);
                      setPersonId(person?.users.id);
                    }}
                    key={i}
                    className='hover:bg-gray-500/10 cursor-pointer px-5 py-2 flex items-center text-start justify-between duration-200'>
                    <div className='flex items-center gap-3'>
                      {person?.users.avatar ? (
                        <Image
                          src={'https://instagram-api.softclub.tj/images/' + person?.users.avatar}
                          width={50}
                          height={50}
                          className="rounded-full size-[45px] border"
                          alt=""
                        />
                      ) : (
                        <Person className='rounded-full ml-2 scale-[1.70] text-gray-500 mr-4 border' />
                      )}
                      <div>
                        <p className='text-sm font-[600]'>{person?.users.userName}</p>
                        <p className='text-sm text-gray-500/90'>{person?.users.fullName} • Подписчики: {person?.users.subscribersCount}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHistory(person.id)
                      }}
                      className='text-lg h-fit py-[0px] font-[900] hover:bg-white/50 px-[5px] text-gray-500/90 rounded-full'>⨉</button>
                  </div>)}
                </div> :
                  <div className='w-full flex flex-col justify-center items-center h-full mt-28 text-sm font-[600] text-gray-500/80'>
                    Нет недавних запросов.
                  </div>)

                : // ________________________________________________________________

                <div className='flex flex-col max-h-[500px] h-full overflow-auto'>{users.length > 0 && users?.slice(0, 5).map((person, i) =>
                  <Link href={person.userName != IAM.userName ? `/profile/${person.userName}` : '/profile'}
                    onClick={() => {
                      addHistory(person.id)
                      setIsSearchOpen(false)
                      setPersonId(person.id)
                    }}
                    className='hover:bg-gray-500/10 flex items-center gap-3 px-5 py-2 text-start justify-start duration-200'
                    key={i}>
                    {person?.avatar ? (
                      <Image
                        src={'https://instagram-api.softclub.tj/images/' + person.avatar}
                        width={50}
                        height={50}
                        className="rounded-full size-[45px] border"
                        alt=""
                      />
                    ) : (
                      <Person className='rounded-full ml-2 scale-[1.70] text-gray-500 mr-4 border' />
                    )}
                    <div>
                      <p className='text-sm font-[600]'>{person.userName}</p>
                      <p className='text-sm text-gray-500/90'>{person.fullName} • Подписчики: {person.subscribersCount}</p>
                    </div>
                  </Link>)}
                </div>}
            </div>
          </div>
        </div>
      }
      <div onClick={() => handleSearchOpen(false)} className="w-full h-screen overflow-y-auto">
        {children}
        <Create />
      </div>
    </div>
  );
}
