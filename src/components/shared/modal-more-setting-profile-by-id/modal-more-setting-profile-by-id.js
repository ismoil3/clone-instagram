import { useProfileStore } from '@/store/user-profile/user-profile';
import { Box, Modal } from '@mui/material';
import React from 'react';
import Router from "next/navigation";

const ModalMoreProfileSettingsById = ({ isOpen, onClose }) => {

    const actions = [
        { label: 'Заблокировать', onClick: () => console.log('Заблокировать'), style: 'font-bold text-red-500' },
        { label: 'Ограничить', onClick: () => console.log('Ограничить'), style: '' },
        { label: 'Пожаловаться', onClick: () => console.log('Пожаловаться'), style: '' },
        { label: 'Поделиться...', onClick: () => console.log('Поделиться...'), style: '' },
        { label: 'Об аккаунте', onClick: () => console.log('Об аккаунте'), style: '' },
        { label: 'Отмена', onClick: () => onClose(), style: 'font-bold' },
      ];

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
                    maxWidth: 400,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 3,
                    boxShadow: 24,
                    overflow: 'hidden',
                }}
            >
                {actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={action.onClick}
                        className={`w-full py-3 px-4 duration-200 text-[14px] font-medium border-t-[1px] border-gray-200 first:border-none ${action.style || ''} hover:bg-gray-500/10`}
                    >
                        {action.label}
                    </button>
                ))}
            </Box>
        </Modal>
    );
};

export default ModalMoreProfileSettingsById;