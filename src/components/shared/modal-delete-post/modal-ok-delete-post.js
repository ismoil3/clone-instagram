import { useProfileStore } from '@/store/user-profile/user-profile';
import { Box, Modal, Typography } from '@mui/material';
import React from 'react';
import AlertO from '../alert/alert';

const ModalDeleteOkPost = () => {
    const {
        setCloseModalDeleteOkPost,
        setCloseModalViewPost,
        isOpenModalDeleteOkPost,
        deletePost,
        postId
    } = useProfileStore();

    const actions = [
        { label: 'Удалить', onClick: () => { deletePost(postId), setCloseModalDeleteOkPost(), setCloseModalViewPost() }, style: 'text-red-500' },
        { label: 'Отмена', onClick: () => setCloseModalDeleteOkPost() },
    ];

    return (<>
        <AlertO />
        <Modal
            open={isOpenModalDeleteOkPost}
            onClose={setCloseModalDeleteOkPost}
            aria-labelledby="modal-actions"
        >
            <Box className='modal-theme'
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: 300,
                    width: '100%',
                    borderRadius: 3,
                    boxShadow: 24,
                    overflow: 'hidden',
                }}
            >
                {actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={action.onClick}
                        className={`w-full py-3 border-t-[1px] border-gray-300/70 first:border-none ${action.style || ''} hover:bg-gray-500/50`}
                    >
                        {action.label}
                    </button>
                ))}
            </Box>
        </Modal>
    </>);
};

export default ModalDeleteOkPost;
