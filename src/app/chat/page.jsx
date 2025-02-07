"use client"
import { useEffect, useState } from "react"
import { useChatStore } from "@/store/pages/chat/useChatStore"
import { useSettingStore } from "@/store/pages/setting/useSettingStore"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import axiosRequest from "@/utils/axiosMy/axiosMy"
import { apiSoftInsta } from "../config/config"
import Image from "next/image"
import Link from "next/link"
import { Avatar, Modal, Box, Button, CircularProgress, TextField, IconButton } from "@mui/material"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined"
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined"

const InstagramStyleChat = ({ path }) => {
  const { data = [], getChats, deleteChat } = useChatStore()
  const [loadingChats, setLoadingChats] = useState(true)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openNewChatModal, setOpenNewChatModal] = useState(false)
  const [selectedChatId, setSelectedChatId] = useState(null)
  const [searchValue, setSearchValue] = useState("")
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const { darkMode } = useSettingStore()
  const router = useRouter()
  const { t } = useTranslation()

  const [tokenId, setTokenId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        setTokenId(jwtDecode(accessToken).sid);
      }
    }
  }, []);
  const clearSearchValue = () => setSearchValue("")

  async function getUsers() {
    setLoadingUsers(true)
    try {
      const { data } = await axiosRequest.get(`${apiSoftInsta}/User/get-users?UserName=${searchValue}`)
      setUsers(data.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoadingUsers(false)
    }
  }

  async function createChat(id) {
    try {
      const { data } = await axiosRequest.post(`${apiSoftInsta}/Chat/create-chat?receiverUserId=${id}`)
      getChats()
      if (typeof window !== "undefined") {
        localStorage.setItem("userId", id)
      }
      router.push(`/chat/${data.data}`)
      setOpenNewChatModal(false)
    } catch (error) {
      console.error("Error creating chat:", error)
    }
  }

  useEffect(() => {
    setLoadingChats(true)
    getChats().finally(() => setLoadingChats(false))
  }, [getChats])

  useEffect(() => {
    getUsers()
  }, [searchValue]) // Added getUsers to dependencies

  const handleDeleteChat = () => {
    if (selectedChatId) {
      deleteChat(selectedChatId)
      setOpenDeleteModal(false)
    }
  }

  const ChatMessage = ({ chat }) => (
    <div
      className={`flex items-center justify-between p-3 rounded-lg ${
        darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
      }`}
    >
      <Link
       onClick={() => {
        getChats();
        
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "userId",
            chat.sendUserId === tokenId ? chat?.receiveUserId : chat.sendUserId
          );
        }
      }}
      
        href={`/chat/${chat?.chatId}`}
        className="flex items-center gap-3 flex-1"
      >
        <Avatar
          src={`${apiSoftInsta}/images/${chat.sendUserId == tokenId ? chat?.receiveUserImage : chat?.sendUserImage}`}
          alt="User Avatar"
          sx={{ width: 56, height: 56 }}
        />
        <div className="flex flex-col">
          <p className="font-semibold">{chat.sendUserId == tokenId ? chat.receiveUserName : chat.sendUserName}</p>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {chat.receiveUser?.fullname || "No Name Provided"}
          </p>
        </div>
      </Link>
      <IconButton
        onClick={() => {
          setSelectedChatId(chat.chatId)
          setOpenDeleteModal(true)
        }}
        className={`text-red-500 hover:text-red-700 p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
      >
        <DeleteOutlinedIcon className="w-5 h-5" />
      </IconButton>
    </div>
  )

  return (
    <div
      className={`h-screen flex flex-col md:flex-row ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
    >
      {/* Chat List Sidebar */}
      <div
        className={`w-full md:w-[400px] border-r ${darkMode ? "border-gray-800" : "border-gray-200"} h-screen overflow-y-auto`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Messages</h1>
            <IconButton
              onClick={() => setOpenNewChatModal(true)}
              className={`${darkMode ? "text-white" : "text-black"} hover:bg-gray-200 dark:hover:bg-gray-800`}
            >
              <EditOutlinedIcon className="w-6 h-6" />
            </IconButton>
          </div>
        </div>

        {loadingChats ? (
          <div className="flex justify-center items-center h-full">
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <div className="space-y-2 p-2">
            {data?.length > 0 ? (
              data.map((chat) => <ChatMessage key={chat.chatId} chat={chat} />)
            ) : (
              <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>No messages found</p>
            )}
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      {!path && (
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:absolute md:left-[400px] md:right-0 md:top-0 md:bottom-0">
          <ChatBubbleOutlineOutlinedIcon className={`w-20 h-20 ${darkMode ? "text-gray-700" : "text-gray-300"}`} />
          <h1 className="mt-4 text-2xl font-bold">Your Messages</h1>
          <p className={`mt-2 text-center ${darkMode ? "text-gray-500" : "text-gray-600"}`}>
            Send private messages to a friend or group.
          </p>
        </div>
      )}

      {/* Delete Chat Modal */}
      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Box
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-xl w-[90%] max-w-sm`}
        >
          <h2 className="text-lg font-semibold mb-4">Delete Chat?</h2>
          <p className="mb-6">Are you sure you want to delete this chat?</p>
          <div className="flex justify-between">
            <Button variant="contained" color="error" onClick={handleDeleteChat} className="w-[48%]">
              Yes, Delete
            </Button>
            <Button variant="outlined" onClick={() => setOpenDeleteModal(false)} className="w-[48%]">
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Create Chat Modal */}
      <Modal open={openNewChatModal} onClose={() => setOpenNewChatModal(false)}>
        <Box
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-xl w-[90%] max-w-md max-h-[90vh] overflow-auto`}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">New Message</h1>
            <IconButton onClick={() => setOpenNewChatModal(false)}>
              <CloseOutlinedIcon className={`w-6 h-6 ${darkMode ? "text-white" : "text-black"}`} />
            </IconButton>
          </div>
          <div className="relative mb-6">
            <SearchOutlinedIcon className={`absolute left-3 top-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
            <TextField
              fullWidth
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search users..."
              variant="outlined"
              className="w-full"
              sx={{
                bgcolor: darkMode ? "#333" : "#f0f0f0",
                borderRadius: "10px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "transparent",
                  },
                  "&:hover fieldset": {
                    borderColor: "transparent",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "transparent",
                  },
                },
              }}
              InputProps={{
                startAdornment: <span className="w-10" />,
              }}
            />
          </div>
          {loadingUsers ? (
            <div className="flex justify-center items-center h-40">
              <CircularProgress color="inherit" />
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-auto">
              {users.map((person) => (
                <button
                  key={person.id}
                  onClick={() => createChat(person.id)}
                  className={`w-full text-left p-3 rounded-lg ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                >
                  <div className="flex items-center gap-4">
                    {person.avatar ? (
                      <Image
                        src={`${apiSoftInsta}/images/${person.avatar}`}
                        width={40}
                        height={40}
                        className="rounded-full"
                        alt=""
                      />
                    ) : (
                      <PersonOutlinedIcon
                        className={`rounded-full w-10 h-10 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      />
                    )}
                    <div>
                      <p className="font-semibold">{person.userName}</p>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{person.fullName}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Box>
      </Modal>
    </div>
  )
}

export default InstagramStyleChat

