import { useProfileStore } from '@/store/user-profile/user-profile'
import { Box, Modal, Typography } from '@mui/material'
import { useRef } from 'react'

let buttonModal =
  'w-full py-3 border-t-[1px] border-gray-500/40 duration-200 active:bg-gray-400/30'
const ModalPhoto = () => {
  const { setCloseModalPhoto, editPhotoProfile, isOpenModalPhoto, deletePhotoProfile } =
    useProfileStore()

  const fileInputRef = useRef(null)
  const handleOpenFileExplorer = () => {
    fileInputRef.current.click()
  }
  const handleFileChange = event => {
    const photo = new FormData()
    photo.set('imageFile', event.target.files[0])
    editPhotoProfile(photo)
    setCloseModalPhoto(false)
  }
  return (
    <Modal
      open={isOpenModalPhoto}
      onClose={setCloseModalPhoto}
      aria-labelledby='modal-modal-delete'
    >
      <Box className='modal-theme'
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          outline: 'none',
          maxWidth: '400px',
          transform: 'translate(-50%, -50%)',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 3,
          boxShadow: 24
        }}
      >
        <div className='py-6 flex flex-col gap-1 items-center px-8'>
          <Typography
            id='modal-modal-title'
            sx={{ fontWeight: '400' }}
            variant='h6'
            component='h2'
          >
            Изменить фото профиля
          </Typography>
        </div>
        <div className='w-full text-sm font-[600]'>
          <button
            onClick={handleOpenFileExplorer}
            className={buttonModal + ' text-blue-500'}
          >
            Загрузить фото
          </button>
          <input
            type='file'
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept='image/*'
            onChange={handleFileChange}
          />
          <button
            onClick={() => {
              deletePhotoProfile()
              setCloseModalPhoto()
            }}
            className='w-full py-3 border-t-[1px] border-gray-500/40 duration-200 text-red-500 active:bg-gray-400/30'
          >
            Удалить текущее фото
          </button>
          <button
            onClick={() => {
              setCloseModalPhoto()
            }}
            className={buttonModal}
          >
            Отмена
          </button>
        </div>
      </Box>
    </Modal>
  )
}

export default ModalPhoto
