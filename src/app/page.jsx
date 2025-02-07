"use client";
import { useEffect, useState, useRef } from "react";
import { useHomeStore } from "./store/useHomeStore";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import "./globals.css";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CloseIcon from "@mui/icons-material/Close";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

// Modal
import Modal from "@mui/material/Modal";

// Post icons
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import { Favorite } from "@mui/icons-material";
import MoreHorizSharpIcon from "@mui/icons-material/MoreHorizSharp";
import AddIcon from "@mui/icons-material/Add";

// Date
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

// Config
import { apiSoftInsta } from "./config/config";
import Link from "next/link";
import ModalViewPost from "@/app/components/modal-post-view/modal-post-view";
import { useProfileStore } from "@/store/user-profile/user-profile";
import { useProfileById } from "@/store/user-profile/user-profile-by-id";
import { useToolsStore } from "@/store/smile-tools/smile-tools";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useSettingStore } from "@/store/pages/setting/useSettingStore";
import { useRouter } from "next/navigation";
import InstagramStories from "./components/stories/sotories";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  height: "100vh",
  bgcolor: "#404040",
  boxShadow: 24,
  p: 4,
};

const formatInstagramDate = (dateString) => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true, locale: ru });
};

export default function Main() {
  const {
    getStory,
    postsState,
    setPostsState,
    favoritePost,
    getPosts,
    likePost,
    userProfile,
    setInitialSlide,
    getUserProfile,
    setOpenModalViewPost,
    users,
    getUsers,
  } = useHomeStore();
  const { person: IAM, getPerson, myId } = useProfileStore();
  const { windowWidth: ww } = useToolsStore();
  const { setPersonId } = useProfileById();
  const [shadowColor, setShadowColor] = useState("rgba(0, 0, 0, 0.5)");
  const { darkMode } = useSettingStore();

  useEffect(() => {
    getPerson();
  }, []);

  const videoRef = useRef(null);

  // Video Gradient
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const video = videoRef?.current;

    video?.addEventListener("play", () => {
      setInterval(() => {
        if (video.paused || video.ended) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        let r = 0,
          g = 0,
          b = 0;
        let pixelCount = pixels.length / 4;
        for (let i = 0; i < pixels.length; i += 4) {
          r += pixels[i];
          g += pixels[i + 1];
          b += pixels[i + 2];
        }

        r = Math.floor(r / pixelCount);
        g = Math.floor(g / pixelCount);
        b = Math.floor(b / pixelCount);

        setShadowColor(`rgba(${r}, ${g}, ${b}, 0.5)`);
      }, 100);
    });
  }, []);

  useEffect(() => {
    getPosts();
    getUserProfile();
    getUsers();
  }, [getPosts, getUserProfile, getUsers]);

  // Post
  const isImagePost = (images) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp|tiff|svg|ico|heic|heif|raw|cr2|nef|orf|sr2|dng|arw|avif)$/i.test(
      images
    );
  };

  const isVideoPost = (images) => {
    return /\.(mp4|webm|ogg|mov|avi|mkv|flv|wmv|3gp|m4v|f4v|rmvb|mts|m2ts|asf|vob|divx)$/i.test(
      images
    );
  };

  // Style Story
  const styleStory = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    backgroundColor: "white",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  //-----------
  const fileInputRef = useRef(null);

  //------------

  // button style
  const buttonS =
    "w-full py-3 px-8 border-t-[1px] border-gray-500/40 duration-200 active:bg-gray-400/30";

  // Pagination Post
  const [textOpen, setTextOpen] = useState(false);

  // BackPoints
  const bp = {
    w1483: ww <= 1483 ? true : false,
    w1387: ww <= 1387 ? true : false,
    w972: ww <= 972 ? true : false,
    w400: ww <= 400 ? true : false,
  };

  // Post Like & Favorite
  function handleLikePost(el) {
    likePost(el.postId);
    setPostsState(
      postsState.map((ele) => {
        if (ele.postId == el.postId) {
          (ele.postLike = !ele.postLike),
            (ele.postLikeCount = ele.postLike
              ? ele.postLikeCount + 1
              : ele.postLikeCount - 1);
        }
        return ele;
      })
    );
  }

  function handleFavoritePost(el) {
    favoritePost(el.postId);
    setPostsState(
      postsState.map((ele) => {
        if (ele.postId == el.postId) {
          ele.postFavorite = !ele.postFavorite;
        }
        return ele;
      })
    );
  }

  return (
    <Box className="h-screen overflow-auto">
      <ModalViewPost />

      <Box
        className={`flex justify-around gap-[25px] p-[30px_5px] ${
          bp.w972 ? "flex-col p-[10px]" : "flex"
        }`}
      >
        <Box className={`max-w-[750px] w-[100%] ${bp.w1387 ? "m-auto" : ""} `}>
          {/*  Stories */}
          <Box className="flex gap-[25px] max-w-[800px] w-[100%] justify-between items-center">
            <InstagramStories />
          </Box>

          {/* Map Posts */}
          <Box className="max-w-[450px] m-auto mt-[50px]">
            {postsState.length > 0 &&
              postsState.map((el, index) => {
                const fileType = el?.images[0]?.split(".").pop() || "";
                return (
                  <Box
                    key={index}
                    className="mb-[80px] flex flex-col shadow-lg gap-2 rounded-lg"
                  >
                    <Box className="flex justify-between items-center p-3">
                      <Link
                        href={
                          el?.userName != IAM.userName
                            ? `/profile/${el.userName}`
                            : "/profile"
                        }
                        onClick={() => {
                          setPersonId(el.userId);
                        }}
                        className="flex gap-[15px] items-center"
                      >
                        <Avatar
                          src={
                            el.userImage && el.userImage.trim() !== ""
                              ? `${apiSoftInsta}/images/${el.userImage}`
                              : `https://via.placeholder.com/150/000000/FFFFFF?text=${
                                  el?.userName?.[0]?.toUpperCase() || "U"
                                }`
                          }
                          alt={`Photo of ${el?.userName || "User"}`}
                          sx={{
                            width: 45,
                            height: 45,
                          }}
                        />
                        <Box>
                          <Typography fontWeight={"600"}>
                            {el?.userName || "user"}
                          </Typography>
                          <Typography fontSize={"13px"}>
                            {formatInstagramDate(el.datePublished)}
                          </Typography>
                        </Box>
                      </Link>
                      <IconButton sx={{ color: darkMode ? "white" : "black" }}>
                        {" "}
                        <MoreHorizSharpIcon />{" "}
                      </IconButton>
                    </Box>

                    <Box
                      className="cursor-pointer"
                      onClick={() => {
                        setOpenModalViewPost();
                        setInitialSlide(index);
                      }}
                    >
                      {isImagePost(el?.images[0]) ? (
                        <img
                          src={`${apiSoftInsta}/images/${el?.images[0]}`}
                          alt={`Post of ${el?.userName}`}
                          className="w-[100%] h-[80vh] object-cover rounded-[5px]"
                        />
                      ) : isVideoPost(el?.images[0]) ? (
                        <video
                          controls
                          // autoPlay
                          loop
                          className="rounded-[5px]"
                          ref={videoRef}
                          style={{
                            width: "100%",
                            height: "80vh",
                            objectFit: "cover",
                            boxShadow: `0px 4px 12px ${shadowColor}`,
                          }}
                        >
                          <source
                            src={`${apiSoftInsta}/images/${el?.images[0]}`}
                            type={`video/${fileType}`}
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <Typography sx={{ textAlign: "center" }}>
                          Unsupported media type.
                        </Typography>
                      )}
                    </Box>

                    <Box className="flex items-center justify-between mt-[10px]">
                      <Box className="flex items-center">
                        <IconButton onClick={() => handleLikePost(el)}>
                          {" "}
                          {el.postLike ? (
                            <Favorite className="text-red-500" />
                          ) : (
                            <FavoriteBorderIcon sx={{ color: "red" }} />
                          )}{" "}
                        </IconButton>
                        <IconButton
                          sx={{ color: darkMode ? "white" : "black" }}
                          onClick={() => {
                            setOpenModalViewPost();
                            setInitialSlide(index);
                          }}
                        >
                          {" "}
                          <ChatBubbleOutlineIcon />{" "}
                        </IconButton>
                        <IconButton
                          sx={{ color: darkMode ? "white" : "black" }}
                        >
                          {" "}
                          <SendOutlinedIcon />{" "}
                        </IconButton>
                      </Box>
                      <IconButton
                        sx={{ color: darkMode ? "white" : "gray" }}
                        onClick={() => handleFavoritePost(el)}
                      >
                        {el.postFavorite ? (
                          <BookmarkIcon />
                        ) : (
                          <BookmarkBorderOutlinedIcon />
                        )}{" "}
                      </IconButton>
                    </Box>

                    <Box className="m-[5px_10px]">
                      <Typography fontSize={"15px"} fontWeight={"600"}>
                        {el.postLikeCount} отметкок "Нравится"
                      </Typography>
                      <Box className="flex items-center gap-[10px]">
                        <Link
                          href={
                            el.userName != IAM.userName
                              ? `/profile/${el.userName}`
                              : "/profile"
                          }
                          onClick={() => {
                            setPersonId(el.userId);
                          }}
                          fontSize={"15px"}
                          className="font-medium"
                        >
                          {el?.userName}
                        </Link>
                        <Typography fontSize={"17px"}>{el?.title}</Typography>
                      </Box>
                      <Box>
                        <Tooltip title={textOpen ? "" : "Увидеть больше"}>
                          <Typography
                            sx={{
                              fontSize: "14px",
                              display: "-webkit-box",
                              WebkitLineClamp: textOpen ? "none" : "1",
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              opacity: "70%",
                              textOverflow: textOpen ? "unset" : "ellipsis",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              color: "gray",
                            }}
                            onClick={() => setTextOpen(!textOpen)}
                          >
                            {el?.content}
                          </Typography>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
          </Box>
        </Box>

        {/* userProfile & Recomendation users*/}
        <Box className="max-w-[300px]">
          <Box
            className={`items-center flex gap-[10px] ${
              bp.w1387 ? "hidden" : "block"
            }`}
          >
            {
              <Link
                href={
                  userProfile?.userName != IAM.userName
                    ? `/profile/${userProfile?.userName}`
                    : "/profile"
                }
                onClick={() => {
                  setPersonId(userProfile?.userId);
                }}
              >
                {" "}
                <Avatar
                  src={
                    userProfile?.image && userProfile?.image.trim() !== ""
                      ? `${apiSoftInsta}/images/${userProfile?.image}`
                      : `https://via.placeholder.com/150/000000/FFFFFF?text=${
                          userProfile?.userName?.[0]?.toUpperCase() || "U"
                        }`
                  }
                  alt={`Photo of ${userProfile?.userName || "User"}`}
                  sx={{
                    width: 65,
                    height: 65,
                    cursor: "pointer",
                  }}
                />{" "}
              </Link>
            }
            <Box>
              <Link
                href={
                  userProfile?.userName != IAM.userName
                    ? `/profile/${userProfile?.userName}`
                    : "/profile"
                }
                onClick={() => {
                  setPersonId(userProfile?.userId);
                }}
              >
                {" "}
                <Typography fontWeight={"700"} fontSize={"20px"}>
                  {userProfile?.userName}
                </Typography>{" "}
              </Link>
              <Box className="flex items-center gap-[7px]">
                <Typography fontSize={"15px"}>
                  {userProfile?.firstName}
                </Typography>
                <Typography fontSize={"15px"}>
                  {userProfile?.lastName}
                </Typography>
              </Box>
              <Link
                className="text-[12px] text-blue-600 font-medium"
                href="/login"
              >
                Переключиться
              </Link>
            </Box>
          </Box>

          <Box className={`mt-[30px] ${bp.w1387 ? "hidden" : ""} `}>
            <Typography fontWeight={"600"} color="gray">
              Рекомендации для вас
            </Typography>
            <Box>
              {users.length > 0 &&
                users.slice(0, 6).map((person, i) => (
                  <Box
                    key={i}
                    className="flex items-center gap-3 mt-[10px] text-start"
                  >
                    <Avatar
                      src={
                        person?.avatar && person?.avatar.trim() !== ""
                          ? `${apiSoftInsta}/images/${person?.avatar}`
                          : `https://via.placeholder.com/150/000000/FFFFFF?text=${
                              person?.userName?.[0]?.toUpperCase() || "User"
                            }`
                      }
                      alt={`Photo of ${person?.userName || "User"}`}
                      sx={{
                        width: 50,
                        height: 50,
                      }}
                    />
                    <Link
                      href={
                        person?.userName != IAM.userName
                          ? `/profile/${person?.userName}`
                          : "/profile"
                      }
                      onClick={() => {
                        setPersonId(person?.id);
                      }}
                    >
                      <p className="text-sm font-[600]">
                        {person?.userName || "user"}
                      </p>
                      <p className="text-sm text-gray-500/90">
                        {" "}
                        • Подписчики: {person?.subscribersCount}
                      </p>
                    </Link>
                  </Box>
                ))}
            </Box>
            <div className="flex flex-wrap mt-[20px] text-[12px] text-gray-400">
              Информация - Помощь - Пресса - API - Вакансии - Конфиденциальность
              - Условия - Места - Язык - Meta Verified
            </div>
            <p className="mt-[13px] text-gray-400 text-[13px]">
              © 2024 INSTAGRAM FROM META
            </p>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
