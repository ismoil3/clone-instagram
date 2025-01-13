'use client';
import { useChatStore } from "@/store/pages/chat/useChatStore";
import Default_chat from "../page";
import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from "react";
import { Avatar, Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress, IconButton } from "@mui/material";
import { apiSoftInsta } from "@/app/config/config";
import Link from "next/link";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Audio from "@/components/pages/chat/pages/audio/audio";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { useSettingStore } from "@/store/pages/setting/useSettingStore";
import { useProfileStore } from "@/store/user-profile/user-profile";
import { useProfileById } from "@/store/user-profile/user-profile-by-id";
import Image from "next/image";
import UploadFileIcon from '@mui/icons-material/UploadFile';

export default function ChatById() {
  const { message, getChat, postMessage, deleteMessage, data } = useChatStore();
  const params = useParams();
  const { person: IAM, getPerson } = useProfileStore();
  const { setPersonId } = useProfileById();

  const [userId, setUserId] = useState("defaultUserId");
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [windowWidth, setWindowWidth] = useState(0);

 
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);

 
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const { darkMode } = useSettingStore()
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }

    setWindowWidth(window.innerWidth);
    const resizeListener = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', resizeListener);
   
    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await getChat(params['chat-by-id']);
      } catch (error) {
        // console.log("Error loading chat data", error);
        // setError("Error loading data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(() => {
      getChat(params['chat-by-id']);
    }, 9000);

    return () => clearInterval(intervalId);
  }, [params]);

  const sortedMessages = useMemo(() => {
    return [...message].sort((a, b) => new Date(a.sendMassageDate) - new Date(b.sendMassageDate));
  }, [message]);


  
    useEffect(() => {
      getPerson();
    }, []);

  const handleDelete = async (id) => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await deleteMessage(id);
      await getChat(params['chat-by-id']);
    } catch (err) {
      console.log("Error deleting message", err);
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;
    const obj = new FormData();
    obj.append('ChatId', params['chat-by-id']);
    obj.append('MessageText', newMessage);
    if (file) {
      for (let i = 0; i < file?.length; i++) {
        obj.append('File', file[i]);
      }
    }
    try {
      await postMessage(obj);
      setNewMessage("");
      await getChat(params['chat-by-id']);
      setFile(null);
    } catch (error) {
      console.log("Error sending message", error);
      setError("Failed to send message. Please try again later.");
    }
  };

  const handleModalOpen = (messageId) => {
    setMessageToDelete(messageId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setMessageToDelete(null);
  };

  const handleClickVideo = (videoUrl) => {
    setCurrentVideoUrl(videoUrl);
    setIsVideoModalOpen(true);
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
    setCurrentVideoUrl(null);
  };

  const handleClickImage = (imageUrl) => {
    setCurrentImageUrl(imageUrl);
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setCurrentImageUrl(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading && newMessage.trim()) {
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }



  return (
    <div className={"h-screen flex flex-col ".concat(darkMode ? "bg-[#121212]" : "bg-white")}>
      <title>Chat friend</title>
      <div className="flex justify-between h-full w-full">
        {windowWidth >= 950 && (
          <div className="sm:w-[300px] md:w-[400px] rounded-lg shadow-md">
            <Default_chat path={true} />
          </div>
        )}

        <div className={"flex-1 w-full relative overflow-y-auto scrollChat rounded-lg shadow-md ".concat(darkMode ? "bg-[#121212]" : "bg-white")} >
          <div className={"mb-6 w-full flex justify-between items-center p-4 gap-4 border-b pb-4 rounded-sm sticky top-0 z-10 shadow-lg ".concat(darkMode ? " bg-[#121212]" : "bg-white")} >
            {data.filter((elem) => elem.receiveUserId === userId || elem.sendUserId === userId).map((user) => (
              <div key={user.id * 100} className="flex items-center gap-4">
                <Avatar
                  src={`${apiSoftInsta}/images/${user.sendUserId == userId ? user.sendUserImage : user?.receiveUserImage || 'default.png'}`}
                  alt="User Avatar"
                  sx={{ width: 55, height: 55, border: '2px solid #ddd' }}
                />
                <Link href={`/profile/${user.sendUserId == userId ? user.sendUserName : user?.receiveUserName}` }
                  onClick={() => {
                    setPersonId(userId)
                  }}>
                  <p className={"font-semibold text-lg ".concat(darkMode ? "text-slate-300" : "text-gray-800")} > {user.sendUserId == userId ? user.sendUserName : user?.receiveUserName}</p>
                </Link>
              </div>
            ))}
            <Link href="/chat">
              <p className="font-[900] text-[30px] text-red-600 hover:text-red-800">x</p>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <CircularProgress color="inherit" />
            </div>
          ) : (
            <div className="space-y-4 p-6 min-h-[350px]  overflow-auto ">
              {sortedMessages.length > 0 ? (
                sortedMessages.map((el) => (
                  <div
                    key={el.messageId * 100000}
                    onDoubleClick={() => handleModalOpen(el.messageId)}
                    className={`transition-all duration-300 ${el.userId === userId ? 'justify-end' : 'justify-start'} flex items-start gap-4`}
                  >
                    {el.userId !== userId && (
                      <Avatar
                        src={`${el.userImage ? `${apiSoftInsta}/images/${el.userImage}` : '/images/default.png'}`}
                        alt="User Avatar"
                        sx={{ width: 45, height: 45 }}
                      />
                    )}
                    <div
                      className={`flex gap-4 max-w-[75%] ${el.userId === userId ? 'bg-blue-500 text-white rounded-[10px_0_10px_10px]' : 'bg-gray-200 text-black rounded-[0px_10px_10px_10px]'} p-3 mb-2 rounded-lg shadow-lg`}
                      style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                    >
                      <div className="flex flex-col">
                        {el.file && (
                          <div className="flex gap-4">
                            {el.file.videoUrl && (
                              <div
                                className="cursor-pointer"
                                onClick={() => handleClickVideo(el.media.videoUrl)}
                              >
                                <PlayArrowIcon />
                              </div>
                            )}
                            {el.file && (
                              el.file.endsWith('.jpg') || el.file.endsWith('.jpeg') || el.file.endsWith('.png') ? (
                                <Image
                                  width={1000}
                                  height={1000}
                                  src={`${apiSoftInsta}/images/${el.file}`}
                                  alt="message attachment"
                                  className="max-w-[250px] rounded-lg cursor-pointer"
                                  onClick={() => handleClickImage(`${apiSoftInsta}/images/${el.file}`)}
                                />
                              ) : el.file.endsWith('.mp4') ? (
                                <div className="relative max-w-[250px] rounded-lg">
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
                              )
                            )}
                          </div>
                        )}
                        <p className="font-medium text-lg">{el.messageText}</p>
                        <p className="text-sm text-gray-800"> {formatDistanceToNow(new Date(el.sendMassageDate), { addSuffix: true, locale: ru })} </p>
                      </div>
                    </div>
                    {el.userId == userId && (
                      <Avatar
                        src={`${el.userImage ? `${apiSoftInsta}/images/${el.userImage}` : '/images/default.png'}`}
                        alt="User Avatar"
                        sx={{ width: 45, height: 45 }}
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 flex items-center justify-center gap-2">
                  <p>No messages yet</p>
                </div>
              )}
            </div>
          )}

          
          <div className={"flex items-center p-4 border-t  sticky bottom-0 z-10 ".concat(darkMode ? "bg-[#121212] text-[black]" : "bg-white")} >
            <input
              type="file"
              multiple
              className="hidden"
              id="fileInput"
              onChange={(e) => setFile(e.target.files)}
            />
              <IconButton sx={{color:'red'}}>
            <label htmlFor="fileInput" className="cursor-pointer px-[3px]">
              <UploadFileIcon/>
            </label>
              </IconButton>
            <input
              type="text"
              className="flex-1 border px-4 py-2 rounded-lg"
              placeholder="Type a message"
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
            />
            <Audio />
            <IconButton
              className="ml-3"
              color="primary"
              onClick={handleSendMessage}
              disabled={!newMessage}
            >
              <SendIcon />
            </IconButton>

          </div>
        </div>
      </div>

      
      <Dialog open={isVideoModalOpen} onClose={handleCloseVideoModal} fullWidth maxWidth="md">
      <div className={darkMode ? "bg-[#121212] text-[white]" : "bg-white text-[black]"}>
        <DialogTitle>Video</DialogTitle>
        <DialogContent className="h-[70vh]">
          <video width="100%" className="h-[100%]"  controls>
            <source src={currentVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVideoModal} color="primary">Close</Button>
        </DialogActions>
      </div>
      </Dialog>

      
      <Dialog open={isImageModalOpen} onClose={handleCloseImageModal} fullWidth>
      <div className={darkMode ? "bg-[#121212] text-[white]" : "bg-white text-[black]"}>
      <DialogTitle>Image</DialogTitle>
        <DialogContent>
          <Image width={1000} height={1000} src={currentImageUrl} alt="Message Image" className="w-full" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImageModal} color="primary">Close</Button>
        </DialogActions>
      </div>
      </Dialog>

      
      <Dialog  open={isModalOpen} onClose={handleModalClose}>
       <div className={darkMode ? "bg-[#121212] text-[white]" : "bg-white text-[black]"}>
       <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this message?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">Cancel</Button>
          <Button
            onClick={() => handleDelete(messageToDelete)}
            color="secondary"
            disabled={isDeleting}
          >
            {isDeleting ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
       </div>
      </Dialog>
    </div>
  );
}
