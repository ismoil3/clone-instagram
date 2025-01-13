"use client";
import {
  AssignmentInd,
  AutoAwesomeMotionRounded,
  BookmarkOutlined,
  Favorite,
  GridOn,
  KeyboardArrowDownRounded,
  ModeComment,
  MoreHorizOutlined,
  Person,
  RemoveRedEye,
  VideoLibraryRounded,
} from "@mui/icons-material";
import Image from "next/image";
import { apiSoftInsta } from "../../config/config";
import { Box, Button, IconButton, Tab, Tabs, Typography } from "@mui/material";
import { useProfileStore } from "@/store/user-profile/user-profile";
import { useEffect, useRef, useState } from "react";
import { setting, video } from "@/assets/icon/layout/svg";
import PropTypes from "prop-types";
import React from "react";
import Link from "next/link";
import AlertO from "@/components/shared/alert/alert";
import { useToolsStore } from "@/store/smile-tools/smile-tools";
import ModalViewSubscribers from "@/components/shared/modal-view-subscribers/modal-view-subscribers";
import { useProfileById } from "@/store/user-profile/user-profile-by-id";
import ModalSubSettings from "@/components/shared/modal-subscribe-settings-by-id/modal-subscribe-settings-by-id";
import ModalMoreProfileSettingsById from "@/components/shared/modal-more-setting-profile-by-id/modal-more-setting-profile-by-id";
import { useSettingStore } from "@/store/pages/setting/useSettingStore";
import ModalViewProfileByIdPost from "@/components/shared/modal-view-post-of-profile-by-id/modal-view-post-of-profile-by-id";
import ModalViewSubscriptions from "@/components/shared/modal-view-subscribers/modal-view-subscriptions";
import axiosRequest from "@/utils/axiosMy/axiosMy";
import { useRouter } from "next/navigation";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ width: "100%", maxWidth: "900px", marginX: "auto" }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const isImage = (fileName) => {
  return /\.(jpg|jpeg|png|gif|bmp)$/i.test(fileName);
};

const isVideo = (fileName) => {
  return /\.(mp4|webm|ogg|x-matroska|mkw)$/i.test(fileName);
};

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Profile = () => {
  const [value, setValue] = React.useState(0);
  const [Mouse, setMouse] = React.useState(false);
  const [MouseId, setMouseId] = React.useState(null);
  const [OpenModals, setOpenModals] = useState({
    viewSubOptions: false,
    viewMoreSettings: false,
  });
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false);
  const { windowWidth: ww } = useToolsStore();
  const { darkMode: dm } = useSettingStore();
  const {
    getPerson,
    person,
    getPersonPosts,
    personPosts,
    setOpenModalViewPost,
    getPersonReels,
    personReels,
    setOpenModalMyProfileSettings,
    setInitialSlide,
    setOpenModalViewSubscribers,
    myId,
    subscribe,
    stateDetector,
    setStateDetector,
  } = useProfileStore();
  const {
    getPersonById,
    setInitialSlideById,
    personById,
    setPersonId,
    getPersonPostsById,
    personId,
    personPostsById: posts,
  } = useProfileById();
  let personPostsById = posts.sort((a, b) => a.postId - b.postId);
  const myReels = personReels.filter((video) => video.userId == personId);
  console.log(myReels, "personReels");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const bp = new Proxy(
    {},
    {
      get(target, prop) {
        if (prop.startsWith("w")) {
          const width = parseInt(prop.slice(1), 10);
          if (!isNaN(width)) {
            return ww <= width ? true : false;
          }
        }
        return undefined;
      },
    }
  );

  const buttonStyle = {
    color: dm ? "white" : "black",
    bgcolor: "#bbb5",
    fontSize: bp.w835 ? "12px" : "14px",
    fontWeight: "600",
    padding: bp.w835 ? "3px 10px" : "5px 16px",
    textTransform: "none",
    borderRadius: "10px",
  };

  const btnS = {
    textTransform: "none",
    color: dm ? "white" : "black",
    flexWrap: "wrap",
    padding: bp.w540 ? "10px 5px" : "0 10px",
  };

  useEffect(() => {
    getPerson();
    getPersonPosts();
    getPersonReels();
  }, []);

  useEffect(() => {
    getPersonById();
    getPersonPostsById();
  }, [personId, stateDetector]);

  async function createChat(id) {
    try {
      const { data } = await axiosRequest.post(
        `${apiSoftInsta}/Chat/create-chat?receiverUserId=${id}`
      );
      localStorage.setItem("userId", id);
      router.push(`/chat/${data.data}`);
    } catch (error) {
      console.log(error);
    }
  }

  if (typeof window !== "undefined") {
    return (
      <div
        className={`flex flex-col h-screen overflow-y-auto px-1 pb-20 ${
          bp.w835 ? "pt-5 " : "pt-14"
        }`}
      >
        <title>Profile</title>
        <ModalSubSettings
          isOpen={OpenModals.viewSubOptions}
          onClose={() =>
            setOpenModals({ ...OpenModals, viewSubOptions: false })
          }
        />
        <ModalMoreProfileSettingsById
          isOpen={OpenModals.viewMoreSettings}
          onClose={() =>
            setOpenModals({ ...OpenModals, viewMoreSettings: false })
          }
        />
        <ModalViewProfileByIdPost />
        <ModalViewSubscriptions
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
        <ModalViewSubscribers />
        <AlertO />
        <div
          className={`flex ${
            bp.w540 ? "gap-4 justify-between" : "justify-between gap-10"
          } w-full p-2 max-w-[800px] mx-auto`}
        >
          <IconButton
            className={"bg-cover bg-center"}
            sx={{
              width: bp.w835 ? (bp.w540 ? "60px" : "130px") : "150px",
              color: "white",
              backgroundImage: `url("${
                apiSoftInsta + "/images/" + personById.image
              }")`,
              border: personById.image ? "none" : "1px solid #bbb",
              marginTop: bp.w540 ? "20px" : "",
              height: bp.w835 ? (bp.w540 ? "60px" : "130px") : "150px",
            }}
          >
            {personById.image ? (
              <Image
                className={"size-[0%] rounded-full shadow-lg"}
                src={apiSoftInsta + "/images/" + personById.image}
                width={50}
                priority
                quality={0}
                height={50}
                alt=""
              />
            ) : (
              <Person className="text-gray-500 scale-150" />
            )}
          </IconButton>
          <div className="flex flex-col gap-6">
            <div
              className={`flex flex-wrap ${bp.w835 ? "gap-1" : "gap-2"} h-fit`}
            >
              {!bp.w540 && (
                <Typography
                  variant="h6"
                  sx={{
                    marginRight: "10px",
                    maxWidth: "fit-content",
                    overflow: "hidden",
                  }}
                >
                  {personById.userName}
                </Typography>
              )}
              {!bp.w540 && (
                <div
                  className={`flex items-center ${bp.w835 ? "gap-1" : "gap-2"}`}
                >
                  {personById?.isSubscriber ? (
                    <Button
                      sx={buttonStyle}
                      onClick={() =>
                        setOpenModals({ ...OpenModals, viewSubOptions: true })
                      }
                    >
                      Подписки <KeyboardArrowDownRounded />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        subscribe(personId);
                        getPersonById();
                        setStateDetector();
                      }}
                      variant="contained"
                      sx={{
                        borderRadius: "10px",
                        padding: "5px 40px",
                        height: "fit-content",
                      }}
                    >
                      Подписаться
                    </Button>
                  )}
                  <Button onClick={() => createChat(personId)} sx={buttonStyle}>Отправить сообщение</Button>
                  <IconButton
                    sx={{ color: "black" }}
                    onClick={() => {
                      setOpenModals({ ...OpenModals, viewMoreSettings: true });
                    }}
                  >
                    <MoreHorizOutlined />
                  </IconButton>
                </div>
              )}
            </div>
            <div
              className={`flex h-fit ${bp.w540 ? "justify-between" : "gap-8"}`}
            >
              <Button sx={btnS}>
                <span className="font-[600] mr-1">{personById.postCount}</span>{" "}
                публикаций
              </Button>
              <Button
                onClick={() => {
                  setOpenModalViewSubscribers();
                  setPersonId(personId);
                }}
                color="primary"
                sx={btnS}
              >
                <span className="font-[600] mr-1">
                  {personById.subscribersCount}
                </span>{" "}
                подписчиков
              </Button>
              <Button
                onClick={() => {
                  setIsOpen(true);
                  setPersonId(personId);
                }}
                color="primary"
                sx={btnS}
              >
                <span className="font-[600] mr-1">
                  {personById.subscriptionsCount}
                </span>{" "}
                подписок
              </Button>
            </div>
            {!bp.w540 && (
              <div>
                <p className="font-[600] text-sm">
                  {personById.lastName} {personById.firstName}
                </p>
                <p className="font-[400] text-sm">{personById.about}</p>
              </div>
            )}
          </div>
        </div>
        <Box
          className={`${
            bp.w540 ? "mt-5" : "mt-20"
          } mx-auto gap-4 flex flex-col max-w-[952px]`}
          sx={{ width: "100%" }}
        >
          {bp.w540 && (
            <div>
              <Typography
                variant="h6"
                sx={{
                  marginRight: "10px",
                  maxWidth: "fit-content",
                  overflow: "hidden",
                }}
              >
                {personById.userName}
              </Typography>
              <div>
                <p className="font-[600] text-sm">
                  {personById.lastName} {personById.firstName}
                </p>
                <p className="font-[400] text-sm">{personById.about}</p>
              </div>
            </div>
          )}
          {bp.w540 && (
            <div className={`flex items-center p-2 justify-between pb-2 gap-1`}>
              <Link className="flex-grow-[1] w-max shrink-0" href="/setting">
                <Button sx={{ ...buttonStyle, width: "100%", flexGrow: "1" }}>
                  Редактировать профиль
                </Button>
              </Link>
              <Button sx={{ ...buttonStyle, flexGrow: "1" }}>
                Посмотреть архив
              </Button>
              <IconButton
                sx={{ color: dm ? "white" : "black" }}
                onClick={() => {
                  setOpenModalMyProfileSettings();
                }}
              >
                <p className="scale-[1.3]">{setting}</p>
              </IconButton>
            </div>
          )}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "#aaa5",
              width: "100%",
              marginX: "auto",
            }}
          >
            <Tabs
              textColor="black"
              sx={{
                marginX: "auto",
                width: bp.w540 ? "100%" : "fit-content",
                color: "#000",
              }}
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                sx={{
                  minWidth: bp.w540 ? "auto" : "",
                  color: dm ? "white" : "black",
                  flexGrow: bp.w540 ? "1" : "0",
                }}
                label={
                  <div>
                    <GridOn sx={{ color: !bp.w540 ? "gray" : "" }} />{" "}
                    {!bp.w540 ? "Публикации" : ""}{" "}
                  </div>
                }
                {...a11yProps(0)}
              />
              <Tab
                sx={{
                  minWidth: bp.w540 ? "auto" : "",
                  color: dm ? "white" : "black",
                  flexGrow: bp.w540 ? "1" : "0",
                }}
                label={
                  <div
                    className={`flex font-bold modal-text ${
                      !bp.w540 && "text-transparent "
                    } items-center`}
                  >
                    <h1
                      className={`${
                        !bp.w540
                          ? "text-gray-500"
                          : dm
                          ? "text-white"
                          : "text-black"
                      } scale-75`}
                    >
                      {video}
                    </h1>
                    {!bp.w540 ? "Reels" : ""}
                  </div>
                }
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            {personPostsById.length > 0 ? (
              <div className="w-full mx-auto grid h-full gap-1 grid-cols-3">
                {personPostsById?.map((post, i) => (
                  <div
                    onClick={() => {
                      setOpenModalViewPost();
                      setInitialSlideById(i);
                    }}
                    className="relative w-full max-w-[300px] h-[28vw] max-h-[300px] overflow-hidden bg-cover bg-center"
                    style={{}}
                    key={i}
                  >
                    {isImage(post?.images[0]) && (
                      <Image
                        src={apiSoftInsta + "/images/" + post.images[0]}
                        alt=""
                        width={100}
                        height={100}
                        className="absolute w-full object-cover rounded h-full"
                        unoptimized
                      />
                    )}{" "}
                    {isVideo(post?.images[0]) && (
                      <video className="absolute w-full rounded h-full object-cover">
                        <source
                          src={`${apiSoftInsta}/images/${post?.images[0]}`}
                          type={`video/${
                            post?.images[0].split(".").pop() || ""
                          }`}
                        />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    <Button
                      sx={{
                        width: "100%",
                        position: "relative",
                        height: "100%",
                        gap: "10px",
                        color: "transparent",
                        ":hover": {
                          bgcolor: "#0005",
                          color: "#fff",
                        },
                      }}
                    >
                      {isImage(post?.images[0]) ? (
                        post.images.length > 1 ? (
                          <AutoAwesomeMotionRounded
                            sx={{
                              position: "absolute",
                              right: "5px",
                              top: "5px",
                              color: "white",
                            }}
                          />
                        ) : (
                          ""
                        )
                      ) : (
                        <VideoLibraryRounded
                          sx={{
                            position: "absolute",
                            right: "5px",
                            top: "5px",
                            color: "white",
                          }}
                        />
                      )}

                      <div className="flex flex-wrap gap-1">
                        {post.postLikeCount != 0 && (
                          <div className="flex gap-1">
                            <Favorite />
                            <p>{post.postLikeCount}</p>
                          </div>
                        )}
                        <div>
                          <ModeComment /> {post.commentCount}
                        </div>
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full flex flex-col items-center h-full gap-2 mt-10 justify-center">
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAADwklEQVR4nO2awW8UVRzH5248egDiYdtuK2KlW9nqShdpbYHSrUEMMSIs20I9EDVhSdouJiRIqdGDBw8m7cEEEkikIIcSJUC70NpCJeGA/wENehW2lx7Mx/zWrdphn+3MvJnM6Pskn2y+L5nf+77pNGk6a1kGg8FgMBgMBsOaeP5DCLOW38SOQpj1/QYY/m+8fJiexn6KL/Wz2NgPUbDc9QhTm46Q8XT4RB8jicMQZZv6GHZ1+C05epK9kOxlqaWXgUQf662IIF2TOQale+UMzp+EVI5iKgepHINWREkdYkjO8NohJh1f3JqllM5C+n3WSd52kN2tWRbKayFWOm7N0iWdpXt5/SBPHN+AtgMg/iMvLK9FwIeqc6yZzv0gqnJY0da76z0QVTmsaOvd8y6IqhxWtPV+ex+IqhxWtPXe9w6Iqhw0+Vky+Tl+ys+yKJ/HZ+n2tff+vSCqcpCMTJMZuQ12z0yzx7fe2T0gqnKQjN7k3ugkVHHet959b4GoykEyfo0nl66BXVn3rfcHGRBVOUhuTXDv1lWwW7z69BOgrffRbhBVOUgeXKb75ytg98EVdvvW++MuEFU5aH69SPejceYfjVOSz18uPX14rb3zO0G0Z7ce28nisR3cz+/g9Ee7eM79rXDX2/GggU4Q7VmLHTwe6GCvxnOv2tvxoBMdIKqyU4538kyhnbYTHUzInMKb/F7w4SZo632yHURV9sLJdj4pz2vjt0Kr3l8Hbb0/3Q6iKnvl1HYmyjPf4JSlEW29R7aBaM/2dbd8lqZd5pxJc9/SiKq340FfpEG0Z/u6Wz5/nWcrs5z/u8pFb8eDvtwKoirrIIiZrvf4KgWiKusgiJmu9/j6VRDtuZpuy3q9fi0zXe8x1gKiPVfTbdl/m6lytIXFsSRTY8nqLztUvR2X+2YLiKqsg+WZHhz2rfe5ZhBVWQduZl5IsP5cgsGzzSzJtWebVz4J2npfaALRnlfTyx5OON/EkFx7vmnlay9Vb8cbXNwMoj2vppc9nHD5FdbJtd9uXvl3hKq34w2+awRRlXXgdWa167X1ntgEoirrwOvMatdr6/3DiyD+lTeysLwWdr/f+PfLUfs51sz1Bko3XoDrDX9+MeJmPV03Gngoa6FWOtazq9w5zobK+mPHN2AqzlSxHor1DFkRpRinUD5D3MUXJKbryMzUwXQtSzN1DP1YeRKiwFycDTO1FCrduR2v/hptVeZqGL5TC1F2rpbTlhfmY2TuxJi8G6N0twYiYYxSuXONy5+8wWAwGAwGg8H67/MHMcDC3tggiqEAAAAASUVORK5CYII="
                  alt="image"
                />
                <p className="text-center text-gray-500 text-2xl font-bold">
                  Публикаций нет
                </p>
                <p className="text-center text-gray-500">
                  Этот человек не имеет публикаций
                </p>
              </div>
            )}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            {myReels.length > 0 ? (
              <div className="w-full mx-auto grid h-full gap-1 grid-cols-3">
                {myReels?.map(
                  (post, i) =>
                    isVideo(post?.images) && (
                      <div
                        className="relative overflow-hidden w-full h-[43vw] max-h-[370px] bg-cover bg-center"
                        style={{}}
                        onPointerEnter={() => {
                          setMouse(true);
                          setMouseId(post.postId);
                        }}
                        onPointerLeave={() => {
                          setMouse(false);
                        }}
                        key={i}
                      >
                        {" "}
                        {isVideo(post?.images) && (
                          <video className="absolute w-full rounded h-full object-cover">
                            <source
                              src={`${apiSoftInsta}/images/${post?.images}`}
                              type={`video/${
                                post?.images.split(".").pop() || ""
                              }`}
                            />
                            Your browser does not support the video tag.
                          </video>
                        )}
                        <Button
                          sx={{
                            width: "100%",
                            position: "relative",
                            height: "100%",
                            gap: "10px",
                            color: "transparent",
                            ":hover": {
                              bgcolor: "#0005",
                              color: "#fff",
                            },
                          }}
                        >
                          {
                            <div
                              style={{
                                opacity:
                                  MouseId == post.postId && Mouse ? "0" : "1",
                                transition: "all 0.2s",
                              }}
                              className="absolute left-2 flex gap-1 bottom-2"
                            >
                              <RemoveRedEye sx={{ color: "white" }} />
                              <p className="text-white">{post.postView}</p>
                            </div>
                          }

                          <div className="flex flex-wrap gap-1">
                            {post.postLike && (
                              <div className="flex gap-1">
                                <Favorite />
                                <p>{post.postLikeCount}</p>
                              </div>
                            )}
                            <div>
                              <ModeComment /> {post.commentCount}
                            </div>
                          </div>
                        </Button>
                      </div>
                    )
                )}
              </div>
            ) : (
              <div className="w-full flex flex-col items-center h-full gap-2 mt-10 justify-center">
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAADeElEQVR4nO2XzWuUVxSHj12I/QtK0kXJtFJUWjFtmMlXQyRGjV9JqsWUJm0UGaqJTRDFWtpYmpoxVBdD20AjiRgVbOlHRFEEP7BgUrvtoot2FdOtuHCpTzm5piBmGOI9ceaW+8CzmDOX3/ubw/u+JCKRSCQSiUQikblZ3sfi0m6OlnTxT2k3hGBJN9OlXWS0u/hS2kWm0D/IwwHvBZToNl1Y1X9LeXSBJ5ZVJPOSvdTM3gniy0t7QM03K7Z5rrPz5pUPQc03K7Z5rrPzZlka1HyzYpvnOjtvXt8FIeu9gPKdELLeC0h+AKoEhlnvmg5QJTDMete/B6oEhlnvNe+CKoFh1rtpO6gSGGa9t7wDqgSGWe+tW0H1r8SilhZSal8fz8kCY9a7rRVU35ztLQzOZrW1crutmUpZQKx6S3szqAY59zTn/XaX197Mw/YtnO7YwIveJRewt+zYDKpVTvdNSA/Czlb3uXMz9zs3cXjbNp73LjvH9byD0htBtcrpueX86DLsPgjpTW6e3shUegMd+q7wLm3YW7qaQLXK+fTXx/34DPR0uu9mXM/k7iaSxdJbeteBapUzeGMOr8PnX8O+t92ZnrU86F3Hqb2reaHQvWV/I6hWOUNXc/vNRej/BA6sd2f3N3L3QCNrCtlbDjWAapVz+kp+R85BZo87f6iBvwvZW/pWg2qVM34pv+fOwvFd7vxn9U+3AKve0l8HqlXOtQu5vfIjjOyD/np3tv8t7n5RR0Mhe0umFlSrnN/Hn/T2L3D+CBxf685kankwUMupLz1egla95Vg1qFY5f/70uLeyMNzivlO/quLGsWpWFktvyVaCapUz/YPzrxEY3wHZKjfPVjKVTdGB0R9CVr1lKAmqVc7UWbjeC99Vu8/fJrk/lOTwaB1LvMvOcT3voBMVoPrmDL/JPc0Zq3d5wxU8PFHB2MnUwvwzZNVbTr4BqkHO4GzWaDm/jZaT8i73DHrLmVWg+ubosz1WTkq1es6fRW/5fiWoEhhmvX9+DVQJDLPeF1aAKoFh1vvyMlAlMMx6X30VVAkMs943l4IqgWHWe+JlCFnvBUwmIGTNFiB5ZsU2jwtIxDsAq0dgWoMmEtQU8paez3yyjNqZWRl3xJfJBAOFfpE9rRMJjngv4I/lLH60hJk7IQjLuKM/Xrt7LyASiUQikUhE/qf8C11P8gg1P6hwAAAAAElFTkSuQmCC"
                  alt="video"
                />
                <p className="text-center text-gray-500 text-2xl font-bold">
                  Видео нет
                </p>
                <p className="text-center text-gray-500">
                  Этот человек не имеет видео
                </p>
              </div>
            )}
          </CustomTabPanel>
        </Box>
      </div>
    );
  }
};

export default Profile;
