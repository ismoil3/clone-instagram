"use client"
import { useChatStore } from "@/store/pages/chat/useChatStore"
import Default_chat from "../page"
import { useParams } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import {
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material"
import { apiSoftInsta } from "@/app/config/config"
import Link from "next/link"
import SendIcon from "@mui/icons-material/Send"
import CloseIcon from "@mui/icons-material/Close"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import { useSettingStore } from "@/store/pages/setting/useSettingStore"
import { useProfileStore } from "@/store/user-profile/user-profile"
import { useProfileById } from "@/store/user-profile/user-profile-by-id"
import Image from "next/image"
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions"
import ImageIcon from "@mui/icons-material/Image"
import Brightness4Icon from "@mui/icons-material/Brightness4"
import Brightness7Icon from "@mui/icons-material/Brightness7"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined"
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined"
import LocalVideoCall from "../call"

export default function ChatById() {
  const { message, getChat, postMessage, deleteMessage, data } = useChatStore()
  const params = useParams()
  const { person: IAM, getPerson } = useProfileStore()
  const { setPersonId } = useProfileById()

  const [userId, setUserId] = useState("defaultUserId")
  const [error, setError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [file, setFile] = useState(null)
  const [windowWidth, setWindowWidth] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState([])

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null)

  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [currentImageUrl, setCurrentImageUrl] = useState(null)
  const { darkMode, toggleDarkMode } = useSettingStore()

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    if (storedUserId) {
      setUserId(storedUserId)
    }

    setWindowWidth(window.innerWidth)
    const resizeListener = () => setWindowWidth(window.innerWidth)
    window.addEventListener("resize", resizeListener)

    return () => window.removeEventListener("resize", resizeListener)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        await getChat(params["chat-by-id"])
      } catch (error) {
        // console.log("Error loading chat data", error);
        // setError("Error loading data. Please try again later.");
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
    const intervalId = setInterval(() => {
      getChat(params["chat-by-id"])
    }, 9000)

    return () => clearInterval(intervalId)
  }, [params, getChat]) // Added getChat to dependencies

  const sortedMessages = useMemo(() => {
    return [...message].sort((a, b) => new Date(a.sendMassageDate) - new Date(b.sendMassageDate))
  }, [message])

  useEffect(() => {
    getPerson()
  }, [])

  const handleDelete = async (id) => {
    if (!id) return
    setIsDeleting(true)
    try {
      await deleteMessage(id)
      await getChat(params["chat-by-id"])
    } catch (err) {
      console.log("Error deleting message", err)
    } finally {
      setIsDeleting(false)
      setIsModalOpen(false)
    }
  }

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" && !file) return
    const obj = new FormData()
    obj.append("ChatId", params["chat-by-id"])
    obj.append("MessageText", newMessage)
    if (file) {
      for (let i = 0; i < file.length; i++) {
        obj.append("File", file[i])
      }
    }
    try {
      await postMessage(obj)
      setNewMessage("")
      await getChat(params["chat-by-id"])
      setFile(null)
      document.getElementById("fileInput").value = ""
      setSelectedFiles([])
    } catch (error) {
      console.error("Error sending message", error)
      setError("Failed to send message. Please try again later.")
    }
  }

  const handleModalOpen = (messageId) => {
    setMessageToDelete(messageId)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setMessageToDelete(null)
  }

  const handleClickVideo = (videoUrl) => {
    setCurrentVideoUrl(videoUrl)
    setIsVideoModalOpen(true)
  }

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false)
    setCurrentVideoUrl(null)
  }

  const handleClickImage = (imageUrl) => {
    setCurrentImageUrl(imageUrl)
    setIsImageModalOpen(true)
  }

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false)
    setCurrentImageUrl(null)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading && newMessage.trim()) {
      handleSendMessage()
    }
  }

  const handleInputChange = (e) => {
    setNewMessage(e.target.value)
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  const SelectedFiles = ({ files, onRemove }) => (
    <div className="flex flex-wrap mt-2">
      {files.map((file, index) => (
        <div key={index} className="bg-gray-200 rounded-full px-3 py-1 m-1 text-sm flex items-center">
          {file}
          <CloseIcon className="ml-2 cursor-pointer" onClick={() => onRemove(index)} />
        </div>
      ))}
    </div>
  )

  return (
    <div className={`h-screen flex flex-col ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
      <title>Chat friend</title>
      <div className="flex justify-between h-full w-full">
        {windowWidth >= 950 && (
          <div className="sm:w-[300px] md:w-[400px] rounded-lg shadow-md">
            <Default_chat path={true} />
          </div>
        )}

        <div
          className={`flex-1 w-full relative overflow-y-auto scrollChat rounded-lg shadow-md ${darkMode ? "bg-black" : "bg-white"}`}
        >
          <div
            className={`mb-6 w-full flex justify-between items-center p-4 gap-4 border-b pb-4 rounded-sm sticky top-0 z-10 shadow-lg ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          >
            {data
              .filter((elem) => elem.receiveUserId === userId || elem.sendUserId === userId)
              .map((user) => (
                <div key={user.id * 100} className="flex items-center gap-4">
                  <Avatar
                    src={`${apiSoftInsta}/images/${user.sendUserId == userId ? user.sendUserImage : user?.receiveUserImage || "default.png"}`}
                    alt="User Avatar"
                    sx={{ width: 40, height: 40, border: "2px solid #ddd" }}
                  />
                  <Link
                    href={`/profile/${user.sendUserId == userId ? user.sendUserName : user?.receiveUserName}`}
                    onClick={() => {
                      setPersonId(userId)
                    }}
                  >
                    <p className={`font-semibold text-lg ${darkMode ? "text-white" : "text-gray-800"}`}>
                      {user.sendUserId == userId ? user.sendUserName : user?.receiveUserName}
                    </p>
                  </Link>
                </div>
              ))}
            <div className="flex items-center gap-2">
              <IconButton onClick={() => {}} color="inherit">
                <PhoneOutlinedIcon />
              </IconButton>
              <LocalVideoCall/>
              <IconButton onClick={() => {}} color="inherit">
                <InfoOutlinedIcon />
              </IconButton>
             
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <CircularProgress color="inherit" />
            </div>
          ) : (
            <div className="space-y-4 mb-[19px]  md:mb-[0px] p-6 min-h-[100vh] overflow-auto">
              {sortedMessages.length > 0 ? (
                sortedMessages.map((el) => (
                  <div
                    key={el.messageId * 100000}
                    onDoubleClick={() => handleModalOpen(el.messageId)}
                    className={`flex ${el.userId === userId ? "justify-end" : "justify-start"} mb-4`}
                  >
                    <div
                      className={`max-w-[75%] ${el.userId === userId ? "bg-blue-500 text-white" : darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"} p-3 rounded-3xl shadow-sm`}
                    >
                      {el.file && (
                        <div className="mb-2">
                          {el.file.endsWith(".jpg") ||
                          el.file.endsWith(".jpeg") ||
                          el.file.endsWith(".png") ||
                          el.file.endsWith(".webp") ? (
                            <Image
                              width={250}
                              height={250}
                              src={`${apiSoftInsta}/images/${el.file}`}
                              alt="message attachment"
                              className="rounded-lg cursor-pointer"
                              onClick={() => handleClickImage(`${apiSoftInsta}/images/${el.file}`)}
                            />
                          ) : el.file.endsWith(".mp4") ? (
                            <div className="relative rounded-lg">
                              <video
                                className="w-full h-auto rounded-lg"
                                onClick={() => handleClickVideo(`${apiSoftInsta}/images/${el.file}`)}
                              >
                                <source src={`${apiSoftInsta}/images/${el.file}`} type="video/mp4" />
                              </video>
                              <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1 cursor-pointer">
                                <PlayArrowIcon onClick={() => handleClickVideo(`${apiSoftInsta}/images/${el.file}`)} />
                              </div>
                            </div>
                          ) : (
                            <p>Unsupported file type</p>
                          )}
                        </div>
                      )}
                      <p className="font-medium">{el.messageText}</p>
                      <p className="text-xs mt-1 opacity-75">
                        {formatDistanceToNow(new Date(el.sendMassageDate), { addSuffix: true, locale: ru })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 flex items-center justify-center gap-2">
                  <p>No messages yet</p>
                </div>
              )}
            </div>
          )}

          <div
            className={`flex items-center   p-2 border-t sticky bottom-[48px] md:bottom-0 z-10 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Message..."
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              InputProps={{
                endAdornment: (
                  <>
                    <IconButton onClick={() => document.getElementById("fileInput").click()}>
                      <ImageIcon />
                    </IconButton>
                    <IconButton>
                      <EmojiEmotionsIcon />
                    </IconButton>
                  </>
                ),
                style: {
                  backgroundColor: darkMode ? "#374151" : "#F3F4F6",
                  borderRadius: "24px",
                  // padding: "8px 16px",
                },
              }}
            />
            <input
              type="file"
              multiple
              className="hidden"
              id="fileInput"
              onChange={(e) => {
                setFile(e.target.files)
                setSelectedFiles(Array.from(e.target.files).map((file) => file.name))
              }}
            />
            {selectedFiles.length > 0 && (
              <SelectedFiles
                files={selectedFiles}
                onRemove={(index) => {
                  const newFiles = [...selectedFiles]
                  newFiles.splice(index, 1)
                  setSelectedFiles(newFiles)
                  const dt = new DataTransfer()
                  Array.from(file).forEach((file, i) => {
                    if (i !== index) dt.items.add(file)
                  })
                  setFile(dt.files)
                }}
              />
            )}
            <IconButton className="ml-3" color="primary" onClick={handleSendMessage} disabled={!newMessage && !file}>
              <SendIcon />
            </IconButton>
          </div>
        </div>
      </div>

      <Dialog open={isVideoModalOpen} onClose={handleCloseVideoModal} fullWidth maxWidth="md">
        <div className={darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}>
          <DialogTitle>Video</DialogTitle>
          <DialogContent className="h-[70vh]">
            <video width="100%" className="h-[100%]" controls>
              <source src={currentVideoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseVideoModal} color="primary">
              Close
            </Button>
          </DialogActions>
        </div>
      </Dialog>

      <Dialog open={isImageModalOpen} onClose={handleCloseImageModal} fullWidth>
        <div className={darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}>
          <DialogTitle>Image</DialogTitle>
          <DialogContent>
            <Image
              width={1000}
              height={1000}
              src={currentImageUrl || "/placeholder.svg"}
              alt="Message Image"
              className="w-full"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseImageModal} color="primary">
              Close
            </Button>
          </DialogActions>
        </div>
      </Dialog>

      <Dialog open={isModalOpen} onClose={handleModalClose}>
        <div className={darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>Are you sure you want to delete this message?</DialogContent>
          <DialogActions>
            <Button onClick={handleModalClose} color="primary">
              Cancel
            </Button>
            <Button onClick={() => handleDelete(messageToDelete)} color="secondary" disabled={isDeleting}>
              {isDeleting ? <CircularProgress size={24} /> : "Delete"}
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  )
}

