import { create } from "zustand";
import { apiSoftInsta } from "../config/config";
import axiosRequest from "@/utils/axiosMy/axiosMy";

export const useHomeStore = create((set, get) => ({
  story: [],
  storiesState: [],
  getStory: async () => {
    try {
      const { data } = await axiosRequest.get(`/Story/get-stories`);
      set({ story: data });
      set({storiesState: data})
    } catch (error) {
      console.log("Not Found !", error);
    }
  },

  setStoriesState: (newArr) => set(()=>({storiesState: newArr})),

  deleteStory: async (id) => {
    try {
      const response = await axiosRequest.delete(`/Story/DeleteStory?id=${id}`)
      await get().getStory()
    } catch (error) {
      console.log("Not Found !", error);
    }
  },

  likeStory: async (id) => {
    try {
      const {data} = await axiosRequest.post(`/Story/LikeStory?storyId=${id}`)
    } catch (error) {
      console.log(error)
    }
  },


  postsState: [],
  posts: [],
  getPosts: async () => {
    try {
      const { data } = await axiosRequest.get(`/Post/get-posts`);
      set({ posts: data.data });
      set({postsState: data.data})
    } catch (error) {
      console.log("Not Found !", error);
    }
  },
  setPostsState: (newArr) => set(()=>({postsState: newArr})),

  postStory: async (obj) => {
    try {
      const { data } = await axiosRequest.post(`/Story/AddStories`, obj);
      await get().getStory();
    } catch (error) {
      console.log("Not Found !", error);
    }
  },

  likePost: async (id) => {
    try {
      const { data } = await axiosRequest.post(`/Post/like-post?postId=${id}`);
    } catch (error) {
      console.log("Not Found !", error);
    }
  },

  favoritePost: async (id) => {
    try {
      const { data } = await axiosRequest.post(`/Post/add-post-favorite`, {"postId": id});
    } catch (error) {
      console.log("Not Found !", error);
    }
  },

  userProfile: [],

  getUserProfile: async () => {
    try {
      const { data } = await axiosRequest.get(`/UserProfile/get-my-profile`);
      set({ userProfile: data.data });
    } catch (error) {
      console.log("Not Found !", error);
    }
  },

  users: [],

  getUsers: async () => {
    try {
      const { data } = await axiosRequest.get(`/User/get-users`);
      set({ users: data.data });
    } catch (error) {
      // console.log("Not Found !", error);
    }
  },


  myStory: [],

  getMyStory: async () => {
    try {
      const { data } = await axiosRequest.get(`/Story/get-my-stories`);
      set({ myStory: data.data });
    } catch (error) {
      // console.log("Not Found !", error);
    }
  },

  initialSlide: null,
  setInitialSlide: (index) =>
    set(() => ({
      initialSlide: index,
    })),

  isOpenModalViewPost: false,
  setOpenModalViewPost: () =>
    set(() => ({
      isOpenModalViewPost: true,
    })),
  setCloseModalViewPost: () =>
    set(() => ({
      isOpenModalViewPost: false,
    })),
}));
