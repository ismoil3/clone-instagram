"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, MenuItem, Tooltip, tooltipClasses } from '@mui/material'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

import {
	action,
	add,
	compas,
	compasActive,
	homeIcon,
	homeIconActive,
	instagramMiniLogo,
	like,
	likeActive,
	message,
	messageActive,
	searchIcon,
	searchIconActive,
	setting,
	settings,
	threads,
	video,
	videoActive,
} from '@/assets/icon/layout/svg'
import { Person, BookmarkBorderOutlined, FmdBadOutlined, LightMode } from '@mui/icons-material'
import { useSearchStore } from '@/store/search-history/search-history'
import ModalDelete from '@/components/shared/modal-delete/modal-delete'
import { jwtDecode } from 'jwt-decode'
import { apiSoftInsta } from '@/app/config/config'
import { useProfileStore } from '@/store/user-profile/user-profile'
import useCreatePost from '@/store/pages/create/createPost'
import Create from '../create-dialog/Create'
import { useProfileById } from '@/store/user-profile/user-profile-by-id'
import ThemeSwitcher from '@/app/components/ThemeSwitcher'
import { useSettingStore } from '@/store/pages/setting/useSettingStore'

const LightTooltip = styled(({ className, ...props }) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(() => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: 'white',
		color: 'black',
		cursor: 'pointer',
		padding: '8px',
		borderRadius: '8px',
		boxShadow: '0 0 5px 1px rgba(0,0,0, .0975)',
		fontSize: 14,
		fontWeight: 400,
		'.MuiTooltip-arrow': {
			color: 'white',
		},
	},
}))


const menuStyle = 'flex gap-4 p-4 text-sm cursor-pointer active:scale-90 active:opacity-50 items-center rounded-2xl hover:bg-slate-400/20 duration-300'
const MiniSideBar = ({ children }) => {
	let { history, getSearchHistory, setSearchValue, deleteHistory, addHistory, setOpenModalDelete, clearSearchValue, searchValue, getUsers, users } = useSearchStore();

	const [anchorEl, setAnchorEl] = useState(null);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const open = Boolean(anchorEl);
	const router = useRouter()
	const pathname = usePathname();
	const { setPersonId } = useProfileById();
	const { person: IAM, getPerson } = useProfileStore();
	const { changeCreatePostDialogOpened } = useCreatePost();
	const { darkMode: dm } = useSettingStore()

	useEffect(() => {
		getPerson();
	}, []);
	const { t } = useTranslation()

	useEffect(() => {
		getSearchHistory();
		getUsers();
	}, [searchValue]);

	const renderIcon = (path, activeIcon, inactiveIcon) => {
		return pathname === path ? inactiveIcon : activeIcon
	}

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	document.addEventListener('keydown', (e) => {
		if (e.key == 'Escape') {
			setIsSearchOpen(false)
		}
	})

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleSearchOpen = (is) => {
		if (is == true) {
			setIsSearchOpen(!isSearchOpen);
		} else {
			setIsSearchOpen(false);
		}
	};

	return (
		<div className='flex h-screen'>
			<ModalDelete />
			<section className={'flex z-[110] justify-center gap-3 px-3 h-[100vh] border-gray-500/50 ' + (isSearchOpen ? "" : "border-r-[1px]")}>
				<div className='sideBar h-full flex flex-col pt-6 justify-between pb-6 gap-[30px]'>
					<div className='flex justify-center hover:bg-gray-500/10 hover:scale-105 duration-300 rounded-md p-3 cursor-pointer'>
						{instagramMiniLogo}
					</div>
					<div className='flex flex-col justify-between h-full'>
						<div className='flex flex-col gap-2 h-full'>
							{/* Home Icon */}
							<LightTooltip title={t('layout.home')} placement='right' arrow>
								<Link href='/' passHref>
									<div className='p-3 super-svg hover:bg-gray-500/10 hover:scale-105 duration-300 rounded-md'>
										{renderIcon('/', homeIconActive, homeIcon)}
									</div>
								</Link>
							</LightTooltip>

							{/* Search Icon */}
							<LightTooltip title={t('layout.search')} placement='right' arrow>
								<div onClick={
									(e) => {
										e.stopPropagation()
										handleSearchOpen(true)
									}
								} className='p-3 super-svg hover:bg-gray-500/10 hover:scale-105 duration-300 rounded-md'>
									{renderIcon('/search', searchIconActive, searchIcon)}
								</div>
							</LightTooltip>

							{/* Explore Icon */}
							<LightTooltip title={t('layout.explore')} placement='right' arrow>
								<Link href='/explore' passHref>
									<div className='p-3 super-svg hover:bg-gray-500/10 hover:scale-105 duration-300 rounded-md'>
										{renderIcon('/explore', compasActive, compas)}
									</div>
								</Link>
							</LightTooltip>

							{/* Reels Icon */}
							<LightTooltip title={t('layout.reels')} placement='right' arrow>
								<Link href='/reels' passHref>
									<div className='p-3 super-svg hover:bg-gray-500/10 hover:scale-105 duration-300 rounded-md'>
										{renderIcon('/reels', videoActive, video)}
									</div>
								</Link>
							</LightTooltip>

							{/* Messages Icon */}
							<LightTooltip title={t('layout.message')} placement='right' arrow>
								<Link href='/chat' passHref>
									<div className='p-3 super-svg hover:bg-gray-500/10 hover:scale-105 duration-300 rounded-md'>
										{renderIcon('/chat', messageActive, message)}
									</div>
								</Link>
							</LightTooltip>

							{/* Notifications Icon */}
							<LightTooltip
								title={t('layout.notification')}
								placement='right'
								arrow
							>
								<div className='p-3 super-svg hover:bg-gray-500/10 hover:scale-105 cursor-pointer duration-300 rounded-md'>
									{renderIcon('/notification', likeActive, like)}
								</div>
							</LightTooltip>

							{/* Create Icon */}

							<LightTooltip title={t('layout.create')} placement='right' arrow>
								<button onClick={() => changeCreatePostDialogOpened(true)}>
									<div className='p-3 super-svg hover:bg-gray-500/10 hover:scale-105 duration-300 rounded-md'>
										{add}
									</div>
								</button>
							</LightTooltip>

							{/* Profile Icon */}
							<LightTooltip title={t('layout.profile')} placement='right' arrow>
								<Link href='/profile' passHref>
									<div className='p-3 super-svg hover:bg-gray-500/10 hover:scale-105 duration-300 rounded-md'>
										{IAM.image ?

											<Image
												className={`${router.pathname === '/profile'
													? 'border-[2px] border-[solid] border-[black] rounded-[50%]'
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
									</div>
								</Link>
							</LightTooltip>
						</div>
						<div className="p-3 cursor-pointer flex justify-center rounded-md hover:bg-gray-500/10 duration-300">
							<button onClick={handleClick} className="scale-150">
								{setting}
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
								<div className='flex flex-col rounded-xl mb-[4px]'>
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
						</div>
					</div>
				</div>
				{true &&
					<div onClick={() => handleSearchOpen(false)} className={"w-full duration-700 fixed left-[72.5px] h-full z-50 ".concat(
						!isSearchOpen ? "-translate-x-[200%]" : "")
					}>
						<div
							className='flex flex-col border-r-[1px] border-l-[1px] w-[396px] rounded-r-2xl modal-theme shadow-[10px_0_15px_] shadow-black/10 border-gray-500/20 h-full'
							onClick={
								(e) => {
									e.stopPropagation()
								}
							}>
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
									(history.length > 0 ? <div className='flex flex-col h-[63vh] overflow-auto'>{history?.slice(0, 7).map((person, i) =>
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
											className='hover:bg-gray-500/10 px-5 py-2 cursor-pointer flex items-center text-start justify-between duration-200'>
											<div className='flex items-center gap-3'>
												{person?.users.avatar ? (
													<Image
														src={'https://instagram-api.softclub.tj/images/' + person.users.avatar}
														width={50}
														height={50}
														className="rounded-full size-[45px] border"
														alt=""
													/>
												) : (
													<Person className='rounded-full ml-2 scale-[1.70] text-gray-500 mr-4 border' />
												)}
												<div>
													<p className='text-sm font-[600]'>{person.users.userName}</p>
													<p className='text-sm text-gray-500/90'>{person.users.fullName} • Подписчики: {person.users.subscribersCount}</p>
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
									</div>
								}
							</div>
						</div>
					</div>
				}
			</section>
			<div onClick={() => handleSearchOpen(false)} className='ml-[0px] w-full h-screen overflow-y-auto'>
				{children}
				<Create />
			</div>
		</div>
	)
}

export default MiniSideBar