import { useSearchStore } from '@/store/search-history/search-history'
import { Box, Modal, Typography } from '@mui/material'
import React from 'react'

const ModalDelete = () => {
    const { isOpenModalDelete, deleteAllUsers, setCloseModalDelete } = useSearchStore()
    return (<Modal
        open={isOpenModalDelete}
        onClose={setCloseModalDelete}
        aria-labelledby="modal-modal-delete"
    >
        <Box className='modal-theme' sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: 400,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 3,
            boxShadow: 24,
        }}>
            <div className='py-6 flex flex-col gap-1 items-center px-8'>
                <Typography id="modal-modal-title" sx={{ fontWeight: '400' }} variant="h6" component="h2">
                    Очистить историю поиска?
                </Typography>
                <Typography id="modal-modal-description" variant='body2' sx={{ textAlign: 'center' }}>
                    Вы не сможете отменить это действие. Если вы очистите историю поиска, аккаунты, которые вы искали, могут по-прежнему отображаться в рекомендуемых результатах.
                </Typography>
            </div>
            <div className='w-full text-sm font-[600]'>
                <button
                    onClick={() => {
                        deleteAllUsers()
                        setCloseModalDelete()
                    }}
                    className='w-full py-3 border-t-[1px] border-gray-500/40 duration-200 text-red-500 active:bg-gray-400/30'>Очистить все</button>
                <button
                    onClick={() => {
                        setCloseModalDelete()
                    }}
                    className='w-full py-3 border-t-[1px] border-gray-500/40 duration-200 active:bg-gray-400/30'>Не сейчас</button>
            </div>
        </Box>
    </Modal>)
}

export default ModalDelete