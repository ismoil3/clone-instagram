import { useSettingStore } from '@/store/pages/setting/useSettingStore';
import { useProfileStore } from '@/store/user-profile/user-profile';
import { useProfileById } from '@/store/user-profile/user-profile-by-id';
import { Close, Person } from '@mui/icons-material';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalSubSettings from '../modal-subscribe-settings-by-id/modal-subscribe-settings-by-id';
import ModalSubMySettings from '../modal-subscribe-settings-by-id/modal-subscribe-my-settings';

const ModalViewSubscriptions = ({ isOpen, onClose }) => {
    const [searchValue, setSearchValue] = useState('');
    const [id, setId] = useState(null);
    const [person, setPerson] = useState(null);
    const { darkMode: dm } = useSettingStore()
    const { t } = useTranslation()
    const {
        getMySubscriptions,
        mySubscriptions,
        subscribe,
        stateDetector
    } = useProfileStore();
    const { personId, setPersonId } = useProfileById();
    const { myId } = useProfileStore()
    const [isOpenOk, setIsOpenOk] = useState(false);
    const [isOpenOkOfOther, setIsOpenOkOfOther] = useState(false);

    useEffect(() => {
        getMySubscriptions(personId);
    }, [personId, stateDetector]);

    return (<>
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-actions"
        >
            <Box
                className="outline-none modal-theme"
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100%',
                    maxWidth: '400px',
                    maxHeight: '400px',
                    borderRadius: 3,
                    boxShadow: 24,
                    overflow: 'auto',
                }}
            >
                <div className='sticky top-0 modal-theme z-50'>
                    <div className='relative flex justify-center border-b-[1px] border-gray-500/40 py-2'>
                        <p className='font-[600]'>Ваши подписчики</p>
                        <IconButton onClick={onClose} sx={{ position: 'absolute', top: '0', right: '0', color: 'currentColor' }}><Close /></IconButton>
                    </div>
                    <div className='px-4 py-2'>
                        <div className='rounded-lg bg-gray-300/20 w-full items-center flex justify-between py-2 px-4'>
                            <input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="outline-none bg-transparent w-full" type="text" placeholder={t('layout.search')} />
                            {searchValue != '' &&
                                <button
                                    onClick={() => setSearchValue('')}
                                    className='bg-gray-500/40 px-[3px] text-white text-sm h-fit py-[0px] rounded-full'>⨉</button>}
                        </div>
                    </div>
                </div>
                <div className='flex flex-col'>{mySubscriptions.length > 0 &&
                    mySubscriptions?.filter((person) => person.userShortInfo.userName.trim().toLowerCase().includes(searchValue.trim().toLowerCase())).map((person, i) =>
                        <div
                            className='hover:bg-gray-500/10 flex items-center px-4 py-2 text-start justify-between duration-200'
                            key={i}>
                            <div className='flex items-center gap-3 justify-start'>
                                {person?.userShortInfo?.userPhoto ? (
                                    <Image
                                        src={'https://instagram-api.softclub.tj/images/' + person?.userShortInfo?.userPhoto}
                                        width={50}
                                        height={50}
                                        className="rounded-full size-[45px] border"
                                        alt=""
                                    />
                                ) : (
                                    <Person className='rounded-full ml-2 scale-[1.70] text-gray-500 mr-4 border' />
                                )}
                                <div>
                                    <div className='flex gap-2 items-center'>
                                        <p className='text-sm font-[600]'>{person?.userShortInfo?.userName}</p>
                                    </div>
                                    <p className='text-sm text-gray-500/90'>{person?.userShortInfo?.fullname}</p>
                                </div>
                            </div>
                            {(personId == myId) == true &&
                                <Button onClick={() => {
                                    setId(person?.userShortInfo?.userId)
                                    setPerson(person?.userShortInfo)
                                    if (personId == myId) {
                                        setIsOpenOk(true)
                                    } else {
                                        setIsOpenOkOfOther(true)
                                    }
                                }} variant='contained' sx={{ padding: '3px 10px', textTransform: 'none', backgroundColor: '#1571', color: dm ? 'white' : 'black', borderRadius: '10px', fontSize: '14px' }}>Подписки</Button>
                            }

                            {(personId == myId) == false && (myId != person?.userShortInfo?.userId) == true &&
                                <Button onClick={() => subscribe(person?.userShortInfo?.userId)} variant='contained' sx={{ padding: '3px 10px', textTransform: 'none', borderRadius: '10px', fontSize: '14px' }}>Подписаться</Button>
                            }
                        </div>)}
                </div>
            </Box>
        </Modal>
        <ModalSubMySettings id={id} person={person} isOpen={isOpenOk} onClose={() => setIsOpenOk(false)} />
        <ModalSubSettings id={id} person={person} isOpen={isOpenOkOfOther} onClose={() => setIsOpenOkOfOther(false)} />
    </>
    );
};

export default ModalViewSubscriptions;
