import useCreatePost from '@/store/pages/create/createPost'
import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Grid2, IconButton, TextField, Typography } from '@mui/material';
import React, { useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import img1 from "./images/image.png";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { apiSoftInsta } from '@/app/config/config';
import { useSettingStore } from '@/store/pages/setting/useSettingStore';

const Create = () => {
  const { createPostDialogOpened , changeCreatePostDialogOpened , addPost } = useCreatePost();
  const { darkMode } = useSettingStore();
  const bgColor = darkMode ? "#111" : "#eee";
  const [currentStep, setCurrentStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [props, setProps] = useState({ title: "", desc: "" })
  const filesRef = useRef(null);

  async function AddPost() {
    const formData = new FormData;

    if(props.title && props.desc){
      formData.append("title", props.title);
      formData.append("content", props.desc);
      for(let i = 0; i < files.length; i++){
        formData.append("images", files[i]);
      }

      await addPost(formData);
      changeCreatePostDialogOpened(false);
      setFiles([]);
      setProps({ title: "", desc: "" });
      setCurrentStep(1);
    }
    else{
      alert("Please fill all fields!");
    }
  }

  return (
    <Dialog sx={{'& .MuiPaper-root': { backgroundColor: darkMode ? '#222222' : '#ffffff', color: darkMode ? '#ffffff' : '#000000' }}} open={createPostDialogOpened} onClose={() => {changeCreatePostDialogOpened(false); setCurrentStep(1); setFiles([]); setProps({ title: "", desc: "" });}}>
      <DialogTitle>Create new post</DialogTitle>
      <IconButton sx={{position:"absolute", top:"10px", right:"10px", color: darkMode ? '#ffffff' : '#111111', '&:hover': { backgroundColor: darkMode ? '#616161' : '#115293' }}} onClick={() => {changeCreatePostDialogOpened(false); setCurrentStep(1); setFiles([]); setProps({ title: "", desc: "" });}}><CloseIcon/></IconButton>
      <Divider/>
      <DialogContent sx={{mx:{md:"100px",xs:"40px"}, mb:"30px", mt:"10px"}}>
        { currentStep == 1 && 
          <>
            <Image className='m-auto' width={200} height={200} src={img1} alt='images logo'/>
            <Typography sx={{fontWeight:"600", textAlign:"center", mb:"20px"}} variant='h5'>Choose files from your device</Typography>
            <Button sx={{margin:"auto", display:"block", backgroundColor: darkMode ? '#424242' : '#1976d2', color: darkMode ? '#ffffff' : '#ffffff', '&:hover': { backgroundColor: darkMode ? '#616161' : '#115293' }}} variant='contained' onClick={() => filesRef.current.click()}>
              Choose files { files.length > 0 && ` (${files.length} ${files.length > 0 ? `file` : `files`} selected)`}
              <input type="file" multiple hidden ref={filesRef} onChange={(e) => {setFiles(e.target.files); setCurrentStep(2);}} />
            </Button>
          </>
        }
        { currentStep == 2 && 
          <>
            <IconButton onClick={() => setCurrentStep(1)} sx={{position:"absolute", left:"50px", color: darkMode ? '#ffffff' : '#111111', '&:hover': { backgroundColor: darkMode ? '#616161' : '#115293' }}}><ArrowBackIcon/></IconButton>
            <Typography sx={{fontWeight:"600", mb:"20px"}} variant='h6'>Add information about your post</Typography>
            <TextField InputLabelProps={{
          sx: {
            color: darkMode ? '#ffffff' : '#000000',
          },
        }}
        InputProps={{
          sx: {
            '& .MuiInputBase-input': {
              color: darkMode ? '#ffffff' : '#000000',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: darkMode ? '#ffffff' : '#000000',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: darkMode ? '#bdbdbd' : '#1976d2',
            },
          },
        }} variant='filled' value={props.title} onChange={(e) => {setProps({ title: e.target.value, desc: props.desc });}} sx={{width:"100%", mb:"15px"}} label="Title" placeholder="Title:" />
            <TextField InputLabelProps={{
          sx: {
            color: darkMode ? '#ffffff' : '#000000',
          },
        }}
        InputProps={{
          sx: {
            '& .MuiInputBase-input': {
              color: darkMode ? '#ffffff' : '#000000',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: darkMode ? '#ffffff' : '#000000',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: darkMode ? '#bdbdbd' : '#1976d2',
            },
          },
        }} variant='filled' value={props.desc} onChange={(e) => {setProps({ title: props.title, desc: e.target.value });}} multiline rows={3} sx={{width:"100%", mb:"15px"}} label="Description" placeholder="Description:" />
            <Button variant="contained" sx={{display:"block", m:"auto", p:"10px 20px", backgroundColor: darkMode ? '#424242' : '#1976d2', color: darkMode ? '#ffffff' : '#ffffff', '&:hover': { backgroundColor: darkMode ? '#616161' : '#115293' }}} onClick={() => AddPost()}>Add post</Button>
          </>
        }
      </DialogContent>
    </Dialog>
  )
}

export default Create