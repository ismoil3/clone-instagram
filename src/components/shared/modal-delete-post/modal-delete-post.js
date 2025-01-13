import { useProfileStore } from '@/store/user-profile/user-profile';
import { Box, Modal, Typography } from '@mui/material';
import React from 'react';

const ModalDeletePost = () => {
    const {
        isOpenModalDeletePost,
        setCloseModalDeletePost,
        setOpenModalDeleteOkPost,
    } = useProfileStore();

    const actions = [
        { label: 'Удалить', onClick: () =>  {setOpenModalDeleteOkPost(), setCloseModalDeletePost()}, style: 'text-red-500' },
        { label: 'Редактировать', onClick: () => console.log('Редактировать') },
        { label: 'Скрыть число отметок "Нравится"', onClick: () => console.log('Скрыть') },
        { label: 'Выключить комментарии', onClick: () => console.log('Выключить комментарии') },
        { label: 'Перейти к публикации', onClick: () => console.log('Перейти') },
        { label: 'Поделиться...', onClick: () => console.log('Поделиться') },
        { label: 'Копировать ссылку', onClick: () => console.log('Копировать ссылку') },
        { label: 'Вставить на сайт', onClick: () => console.log('Вставить на сайт') },
        { label: 'Об аккаунте', onClick: () => console.log('Об аккаунте') },
        { label: 'Отмена', onClick: setCloseModalDeletePost },
    ];

    return (
        <Modal
            open={isOpenModalDeletePost}
            onClose={setCloseModalDeletePost}
            aria-labelledby="modal-actions"
        >
            <Box className='modal-theme'
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 300,
                    borderRadius: 3,
                    boxShadow: 24,
                    overflow: 'hidden',
                }}
            >
                {actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={action.onClick}
                        className={`w-full py-3 border-t-[1px] border-gray-300/70 first:border-none ${action.style || ''} hover:bg-gray-500/10`}
                    >
                        {action.label}
                    </button>
                ))}
            </Box>
        </Modal>
    );
};

export default ModalDeletePost;
