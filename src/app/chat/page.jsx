'use client';
import { useChatStore } from '@/store/pages/chat/useChatStore';
import React, { useEffect, useState } from 'react';
import { apiSoftInsta } from '../config/config';
import { Avatar, Modal, Box, Button, CircularProgress } from '@mui/material';
import Link from 'next/link';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { Person } from '@mui/icons-material';
import axiosRequest from '@/utils/axiosMy/axiosMy';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { jwtDecode } from 'jwt-decode';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { useSettingStore } from '@/store/pages/setting/useSettingStore';
import { useRouter } from 'next/navigation';



const DefaultChat = ({ path }) => {
    const { data = [], getChats, deleteChat } = useChatStore();
    const [loadingChats, setLoadingChats] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [openModal1, setOpenModal1] = useState(false);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const { darkMode } = useSettingStore()
    const router = useRouter()
    console.log(darkMode);

    const { t } = useTranslation();

    const clearSearchValue = () => setSearchValue('');

   
    async function getUsers() {
        setLoadingUsers(true);
        try {
            const { data } = await axiosRequest.get(`${apiSoftInsta}/User/get-users?UserName=${searchValue}`);
            setUsers(data.data);
        } catch (error) {
           console.log(error);
        } finally {
            setLoadingUsers(false);
        }
    }

   
    async function createChat(id) {
        try {
            const { data } = await axiosRequest.post(`${apiSoftInsta}/Chat/create-chat?receiverUserId=${id}`);
            getChats();
            localStorage.setItem('userId', id)
            router.push(`/chat/${data.data}`)
            closeModal1();
        } catch (error) {
           console.log(error);
        }
    }

    useEffect(() => {
        setLoadingChats(true);
        getChats().finally(() => setLoadingChats(false));
    }, [getChats]);
    useEffect(() => {
        getUsers();
    }, [searchValue])
    const handleDeleteChat = () => {
        if (selectedChatId) {
            deleteChat(selectedChatId);
            setOpenModal(false);
        }
    };

    const openDeleteModal = (chatId) => {
        setSelectedChatId(chatId);
        setOpenModal(true);
    };

    const tokenId = jwtDecode(localStorage.getItem('access_token')).sid
    console.log(tokenId);

    const closeModal = () => setOpenModal(false);
    const closeModal1 = () => setOpenModal1(false)
    return (
        <div className='h-full'>
            <title>Chat</title>
            <div className=" items-center h-full flex">
                <div className={`p-2 border rounded-lg shadow-lg max-w-[400px] w-[400px] h-full overflow-auto ${darkMode ? "bg-transparent" : "bg-white"}`}>
                    <div className="flex justify-between p-[10px] items-center">
                        <h1 className={"font-bold text-[20px] text-center  mb-4".concat(darkMode ? "text-white" : "text-gray-800")} >Сообщения</h1>
                        <EditNoteOutlinedIcon onClick={() => setOpenModal1(true)} className="cursor-pointer" />
                    </div>

                    {loadingChats ? (
                        <div className="flex justify-center items-center h-full">
                            <CircularProgress color="inherit" />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {data?.length > 0 ? (
                                data.map((el) => (
                                    <div className={`flex items-center gap-4 justify-between p-3 rounded-lg  cursor-pointer border-b-[1px] `.concat(darkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100')} key={el.chatId * 993939}>
                                        <Link
                                            onClick={() => { getChats(), localStorage.setItem('userId', el.sendUserId == tokenId ? el?.receiveUserId : el.sendUserId); }}
                                            href={`/chat/${el?.chatId}`}
                                            className="w-full"
                                        >
                                            <div className="flex items-center gap-4 p-2 rounded-lg cursor-pointer w-full">
                                                <Avatar
                                                    src={`${apiSoftInsta}/images/${el.sendUserId == tokenId ? el?.receiveUserImage : el?.sendUserImage}`}
                                                    alt="User Avatar"
                                                    sx={{ width: 50, height: 50 }}
                                                />
                                                <div className="flex flex-col">
                                                    <p className={"font-semibold text-[16px]".concat(darkMode ? ' text-gray-300' : ' text-gray-900')} >{el.sendUserId == tokenId ? el.receiveUserName : el.sendUserName}</p>
                                                    <p className="text-[14px] text-gray-500">{el.receiveUser?.fullname || 'No Name Provided'}</p>
                                                </div>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={() => openDeleteModal(el.chatId)}
                                            className="text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                                        >
                                            <PersonRemoveIcon />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">Сообщений не найдено</p>
                            )}
                        </div>
                    )}
                </div>

                {!path && (
                    <div className='m-auto hidden lg:block'>
                        <img className={`w-[130px] m-auto ${darkMode && "invert-[1]"} `} src="https://static.vecteezy.com/system/resources/previews/002/428/264/non_2x/messenger-outline-icon-free-vector.jpg" alt="" />
                        <h1 className='mt-[10px] font-[900] text-[24px]'>Ваши сообщения</h1>
                    </div>
                )}
            </div>
            {/* Delete Chat Modal */}
            <Modal open={openModal} onClose={closeModal} aria-labelledby="delete-chat-modal" aria-describedby="delete-chat-modal-description">
                <Box sx={modalStyle}>
                    <h2 id="delete-chat-modal" className="text-lg font-semibold">Удалить чат?</h2>
                    <p id="delete-chat-modal-description" className="mb-4">
                        Вы уверены, что хотите удалить этот чат?
                    </p>
                    <div className="flex justify-between">
                        <Button variant="contained" color="error" onClick={handleDeleteChat}>
                            Да, удалить
                        </Button>
                        <Button variant="outlined" onClick={closeModal}>
                            Отмена
                        </Button>
                    </div>
                </Box>
            </Modal>

            {/* Create Chat Modal */}
            <Modal open={openModal1} onClose={closeModal1} aria-labelledby="create-chat-modal" aria-describedby="create-chat-modal-description">
                <Box sx={{ ...modalStyle2, bgcolor: darkMode ? "#121212" : "white" }}>
                    <div className='flex items-center justify-between'>
                        <h1 className='font-[800] text-[24px]'>Создать чат</h1>
                        <h1 style={{ fontSize: '30px', fontWeight: '600', cursor: 'pointer' }} onClick={closeModal1}>х</h1>
                    </div>
                    <div className='mt-6 rounded-lg bg-gray-300/20 w-full items-center flex justify-between py-2 px-4'>
                        <input
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="outline-none bg-transparent w-full"
                            type="text"
                            placeholder={t('layout.search')}
                        />
                        {searchValue !== '' && (
                            <button onClick={clearSearchValue} className='bg-gray-500/40 px-[3px] text-white text-sm h-fit py-[0px] rounded-full'>
                                ⨉
                            </button>
                        )}
                    </div>
                    <div className=''>
                        {loadingUsers ? (
                            <div className="flex justify-center items-center h-40">
                                <CircularProgress color="inherit" />
                            </div>
                        ) : (
                            <div className='flex flex-col max-h-[400px] overflow-auto'>
                                {users.map((person, i) => (
                                    <button
                                        key={i * 1000900}
                                        onClick={() => { createChat(person.id); }}
                                        className='hover:bg-gray-500/10 flex items-center gap-3 px-5 py-2 text-start justify-start duration-200'
                                    >
                                        {person.avatar ? (
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
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: 4,
    borderRadius: 2,
    boxShadow: 24,
    width: 300,
    textAlign: 'center',
};

const modalStyle2 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 2,
    boxShadow: 24,
    width: 450,
    textAlign: 'center',
    maxHeight: '600px'
};

export default DefaultChat;
