"use client"

import { useState, useEffect, useRef } from "react"
import { Box, Typography, Avatar, IconButton, Modal, Button } from "@mui/material"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import FavoriteIcon from "@mui/icons-material/Favorite"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import SendIcon from "@mui/icons-material/Send"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import ImageIcon from "@mui/icons-material/Image"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import axiosRequest from "@/utils/axiosMy/axiosMy"
import { apiSoftInsta } from "@/app/config/config"
import { useHomeStore } from "@/app/store/useHomeStore"
import { jwtDecode } from "jwt-decode"
import DeleteIcon from "@mui/icons-material/Delete" 


const formatInstagramDate = (dateString) => {
  const date = new Date(dateString)
  return formatDistanceToNow(date, { addSuffix: true, locale: ru })
}

const isImage = (fileName) => {
  return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName)
}

const isVideo = (fileName) => {
  return /\.(mp4|webm|ogg)$/i.test(fileName)
}

const InstagramStories = () => {
  const [stories, setStories] = useState([])
  const [currentUserIndex, setCurrentUserIndex] = useState(0)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [storyViewerOpen, setStoryViewerOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef(null)
  const timerRef = useRef(null)
  const fileInputRef = useRef(null)

  const [addStoryModalOpen, setAddStoryModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const { likeStory } = useHomeStore()
  const [myId, setMyId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        setMyId(jwtDecode(accessToken).sid);
      }
    }
  }, []);
  console.log(myId,"sal");
  console.log(  stories[currentUserIndex]?.stories[currentStoryIndex].id,"ss");
  

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const { data } = await axiosRequest(`${apiSoftInsta}/Story/get-stories`)
        setStories(data)
      } catch (error) {
        console.error("Error fetching stories:", error)
      }
    }

    fetchStories()
  }, [])

  useEffect(() => {
    if (!storyViewerOpen) return

    const currentStory = stories[currentUserIndex].stories[currentStoryIndex]

    if (isImage(currentStory.fileName)) {
      timerRef.current = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(timerRef.current)
            handleNextStory()
            return 0
          }
          return prevProgress + 100 / 50
        })
      }, 100)
    } else if (isVideo(currentStory.fileName) && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [storyViewerOpen, currentUserIndex, currentStoryIndex, stories])

  const handleOpenStoryViewer = (index) => {
    setCurrentUserIndex(index)
    setCurrentStoryIndex(0)
    setProgress(0)
    setStoryViewerOpen(true)
  }

  const handleCloseStoryViewer = () => {
    setStoryViewerOpen(false)
    setProgress(0)
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  const handleNextStory = () => {
    setProgress(0)
    if (currentStoryIndex < stories[currentUserIndex].stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1)
    } else if (currentUserIndex < stories.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1)
      setCurrentStoryIndex(0)
    } else {
      handleCloseStoryViewer()
    }
  }

  const handlePrevStory = () => {
    setProgress(0)
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1)
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex(currentUserIndex - 1)
      setCurrentStoryIndex(stories[currentUserIndex - 1].stories.length - 1)
    }
  }

  const handleVideoEnd = () => {
    handleNextStory()
  }

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(progress)
    }
  }

  const handleLikeStory = async () => {
    await likeStory(stories[currentUserIndex].stories[currentStoryIndex].id)
  }

  const handleAddStoryClick = () => {
    setAddStoryModalOpen(true)
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handlePostStory = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("Image", selectedFile)

    try {
      await axiosRequest(`${apiSoftInsta}/Story/AddStories`)

      const { data } = await axiosRequest(`${apiSoftInsta}/Story/get-stories`)
      setStories(data)
      setSelectedFile(null)
      setPreviewUrl("")
      setAddStoryModalOpen(false)
    } catch (error) {
      console.error("Error posting story:", error)
    } finally {
      setIsUploading(false)
    }
  }


  const handleDeleteStory = async (storyId) => {
    console.log(storyId,"ss");
    
    try {
      
      await axiosRequest(`${apiSoftInsta}/Story/DeleteStory?id=${storyId}`)
      
      
      setStories(stories.filter(story => story.id !== storyId))
    } catch (error) {
      console.error("Error deleting story:", error)
    }
  }

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 2 }}>
      <Swiper slidesPerView="auto" spaceBetween={10} navigation modules={[Navigation]} className="mySwiper">
        <SwiperSlide style={{ width: "auto" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={handleAddStoryClick}
          >
            <IconButton
              sx={{
                width: 66,
                height: 66,
                border: "2px dashed grey",
                borderRadius: "50%",
              }}
            >
              <AddIcon />
            </IconButton>
            <Typography variant="caption" sx={{ marginTop: 1 }}>
              Your Story
            </Typography>
          </Box>
        </SwiperSlide>
        {stories.map((story, index) => (
          <SwiperSlide key={index} style={{ width: "auto" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => handleOpenStoryViewer(index)}
            >
              <Avatar
                src={`${apiSoftInsta}/images/${story.userImage}`}
                sx={{
                  width: 66,
                  height: 66,
                  border: "3px solid #e1306c",
                  padding: "3px",
                  backgroundColor: "white",
                }}
              />
              <Typography variant="caption" sx={{ marginTop: 1 }}>
                {story.userName}
              </Typography>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>

      <Modal
        open={addStoryModalOpen}
        onClose={() => {
          setAddStoryModalOpen(false)
          setSelectedFile(null)
          setPreviewUrl("")
        }}
        aria-labelledby="add-story-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 0,
            outline: "none",
          }}
        >
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" component="h2">
              New Story
            </Typography>
            <IconButton onClick={() => setAddStoryModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 2 }}>
            {!selectedFile ? (
              <Box
                sx={{
                  height: 400,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px dashed",
                  borderColor: "divider",
                  borderRadius: 1,
                  cursor: "pointer",
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" hidden ref={fileInputRef} accept="image/*,video/*" onChange={handleFileSelect} />
                <ImageIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  Click to upload photo or video
                </Typography>
              </Box>
            ) : (
              <Box sx={{ position: "relative", height: 400 }}>
                {isImage(selectedFile.name) ? (
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Story preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <video
                    src={previewUrl}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    controls
                  />
                )}
              </Box>
            )}
          </Box>

          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedFile(null)
                setPreviewUrl("")
              }}
              disabled={!selectedFile || isUploading}
            >
              Clear
            </Button>
            <Button variant="contained" onClick={handlePostStory} disabled={!selectedFile || isUploading}>
              {isUploading ? "Posting..." : "Share to Story"}
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={storyViewerOpen}
        onClose={handleCloseStoryViewer}
        aria-labelledby="story-viewer-modal"
        aria-describedby="instagram-story-viewer"
      >
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {storyViewerOpen && stories[currentUserIndex] && (
            <Box sx={{ position: "relative", width: "100%", maxWidth: 400, height: "100vh" }}>
              <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", padding: 2, zIndex: 2 }}>
                {stories[currentUserIndex].stories.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: 1,
                      height: 2,
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                      marginRight: 0.5,
                    }}
                  >
                    {index === currentStoryIndex && (
                      <Box
                        sx={{
                          height: "100%",
                          backgroundColor: "white",
                          width: `${progress}%`,
                          transition: "width 0.1s linear",
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Box>

              <Box sx={{ position: "absolute", top: 30, left: 16, display: "flex", alignItems: "center", zIndex: 2 }}>
                <Avatar
                  src={`${apiSoftInsta}/images/${stories[currentUserIndex].userImage}`}
                  sx={{ width: 40, height: 40, marginRight: 1 }}
                />
                <Typography color="white" variant="subtitle1">
                  {stories[currentUserIndex].userName}
                </Typography>
                <Typography color="white" variant="caption" sx={{ marginLeft: 1 }}>
                  {formatInstagramDate(stories[currentUserIndex].stories[currentStoryIndex].createAt)}
                </Typography>
              </Box>

              <IconButton
                onClick={handleCloseStoryViewer}
                sx={{ position: "absolute", top: 30, right: 8, color: "white", zIndex: 2 }}
              >
                <CloseIcon />
              </IconButton>

              <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {isImage(stories[currentUserIndex].stories[currentStoryIndex].fileName) ? (
                  <img
                    src={`${apiSoftInsta}/images/${stories[currentUserIndex].stories[currentStoryIndex].fileName}`}
                    alt={`Story ${currentStoryIndex + 1}`}
                    style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                  />
                ) : isVideo(stories[currentUserIndex].stories[currentStoryIndex].fileName) ? (
                  <video
                    ref={videoRef}
                    src={`${apiSoftInsta}/images/${stories[currentUserIndex].stories[currentStoryIndex].fileName}`}
                    style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                    onEnded={handleVideoEnd}
                    onTimeUpdate={handleVideoTimeUpdate}
                    autoPlay
                    playsInline
                  />
                ) : (
                  <Typography color="white">Unsupported media type</Typography>
                )}
              </Box>

              <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex" }}>
                <Box sx={{ flex: 1 }} onClick={handlePrevStory} />
                <Box sx={{ flex: 1 }} onClick={handleNextStory} />
              </Box>

              <Box
                sx={{ position: "absolute", bottom: 16, left: 16, right: 16, display: "flex", alignItems: "center" }}
              >
                <Box
                  sx={{ flex: 1, backgroundColor: "rgba(255, 255, 255, 0.2)", borderRadius: 20, padding: "8px 16px" }}
                >
                  <Typography color="white" variant="body2">
                    Send message
                  </Typography>
                </Box>
                <IconButton sx={{ color: "white", marginLeft: 1 }} onClick={handleLikeStory}>
                  {stories[currentUserIndex].stories[currentStoryIndex].liked ? (
                    <FavoriteIcon sx={{ color: "red" }} />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
                <IconButton sx={{ color: "white", marginLeft: 1 }}>
                  <SendIcon />
                </IconButton>
                {stories[currentUserIndex].userId === myId && (
                <IconButton
                  onClick={() =>
                    handleDeleteStory(stories[currentUserIndex]?.stories[currentStoryIndex].id)
                  }
                  sx={{  color: "white", zIndex: 2 }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
                <IconButton sx={{ color: "white", marginLeft: 1 }}>
                  <MoreHorizIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  )
}

export default InstagramStories

