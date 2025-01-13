'use client'
import useExplorePosts from '@/store/pages/explore/explorePosts'
import { CircularProgress, Grid2, OutlinedInput } from '@mui/material';
import React, { useEffect, useRef } from 'react'
import { apiSoftInsta } from '../config/config';
import Image from 'next/image';
import ModalViewPost from './modal-view-post';
import axiosRequest from '@/utils/axiosMy/axiosMy';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import ImageIcon from '@mui/icons-material/Image';

const Explore = () => {
  const { posts , changePosts , changePage , changeHasMore , loading , changeLoading , searchValue , changeSearchValue , changePostByIdModalOpened , changeCurrentSlide } = useExplorePosts();
  let { page , hasMore } = useExplorePosts();
  const DataGrid = useRef(null);

  const GetPosts = async () => {
	if(loading || !hasMore) return;
	changeLoading(true);
	try {
		const {data} = await axiosRequest.get(`/Post/get-posts?PageNumber=${page}&PageSize=12`);
		posts.push(...data.data)
		changePosts(posts);
		hasMore = data.data.length > 0;
		changeHasMore(hasMore);
		page++;
		changePage(page);
	} catch (error) {
		console.log(error);
	} finally {
		changeLoading(false);
	}
  }

  const handleScroll = () => {
    const scrollElement = DataGrid.current;

	if (scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight - 300 && hasMore) {
      GetPosts();
    }
  };

  useEffect(()=>{
	GetPosts();
    DataGrid.current.addEventListener("scroll", handleScroll);
    return () => DataGrid.current && DataGrid.current.removeEventListener("scroll", handleScroll);
  }, [])


  return <>
	<OutlinedInput value={searchValue} onChange={(e) => changeSearchValue(e.target.value)} sx={{display:{md:"none", xs:"block"}, width:"90%", m:"30px"}} placeholder='Search:'/>
	<Grid2 ref={DataGrid} sx={{p:"30px", height:"100vh", overflowY:"auto"}} container spacing={2}>
	   {
		  posts.length>0 && posts.filter((e, i) => {if(e.title) return e.title.toLowerCase().includes(searchValue.toLowerCase())}).map((post, index)=>{
			return <Grid2 sx={{position:"relative", "&:hover":{transform: "scale(1.05)", cursor:"pointer", transition: "0.4s"}}} onClick={() => { changePostByIdModalOpened(true); changeCurrentSlide(index) }} size={{md:4, sm:6, xs:12}} key={index}>
				{ post.images[0].split('.')[1]=="mp4" && <> <video width={1000} className='w-[100%] h-[500px]' style={{objectFit:"cover"}} src={`${apiSoftInsta}/images/${post.images[0]}`}></video> <PlayCircleFilledIcon fontSize='large' color='primary' sx={{position:"absolute", top:"10px", right:"10px"}}/> </> }
				{ ( post.images[0].split('.')[1]=="png" || post.images[0].split('.')[1]=="jpg" || post.images[0].split('.')[1]=="webp" || post.images[0].split('.')[1]=="jpeg") && <> <Image width={1000} height={1000} style={{objectFit:"cover"}} alt='Post image' className='w-[100%] h-[500px]' src={`${apiSoftInsta}/images/${post.images[0]}`}/> <ImageIcon fontSize='large' color='primary' sx={{position:"absolute", top:"10px", right:"10px"}}/> </> }
			</Grid2>
		  })
	   }
	</Grid2>
	{ loading && <CircularProgress/> }
	<ModalViewPost/>
  </>
}

export default Explore