import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import { Close, Person } from '@mui/icons-material';
import { useProfileById } from '@/store/user-profile/user-profile-by-id';
import Image from 'next/image';
import { apiSoftInsta } from '@/app/config/config';
import { useProfileStore } from '@/store/user-profile/user-profile';
const ModalSubMySettings = ({ isOpen, onClose, id, person}) => {
    const { } = useProfileById()
    const { deleteMySubscriber, setStateDetector } = useProfileStore()
    
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-actions"
        >
            <Box className='modal-theme'
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '300px',
                    borderRadius: 2,
                    boxShadow: 24,
                    overflow: 'hidden',
                }}
            >
                <div className='relative flex flex-col justify-center border-b-[1px] border-gray-500/40 py-2'>
                    <div className="flex flex-col gap-1 p-4 items-center">
                        <div style={{ backgroundImage: `url("${apiSoftInsta + '/images/' + person?.userPhoto}")` }} className="size-[55px] bg-cover bg-center border rounded-full flex flex-col items-center justify-center">
                            {person?.userPhoto ?(
                                <Image
                                    className={'size-[0%] rounded-full shadow-lg'}
                                    src={apiSoftInsta + '/images/' + person?.userPhoto}
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
                        <div className='flex flex-col'>
                            <p className="font-[700]">{person?.userName}</p>
                        </div>
                    </div>
                    <IconButton onClick={onClose} sx={{ position: 'absolute', top: '0', right: '0', color: 'currentColor' }}><Close /></IconButton>
                </div>
                <button
                    onClick={() => {
                        deleteMySubscriber(id);
                        onClose()
                        setStateDetector();
                    }}
                    className='w-full py-3 border-t-[1px] border-gray-500/40 duration-200 active:bg-gray-400/30'
                >
                    Отменить подписку
                </button>
            </Box>
        </Modal>
    );
};

export default ModalSubMySettings;