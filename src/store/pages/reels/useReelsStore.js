import { apiSoftInsta } from "@/app/config/config";
import axiosRequest from "@/utils/axiosMy/axiosMy";
import { create } from "zustand";

export const useReelsStore = create((set, get) => ({
  reels: [],
  GetReels: async () => {
    try {
      const { data } = await axiosRequest.get('/Post/get-reels?PageSize=10000000000000000000000000000000000000000000000000000000')
      set({ reels: data.data })
    } catch (error) {
      console.log(error);

    }
  },
  viewPost: async (id) => {
    try {
      const { data } = await axiosRequest.post(`${apiSoftInsta}/Post/view-post?postId=${id}`)
    } catch (error) {
      console.log(error);
    }
  },
  likePost: async (id) => {
    try {
      const { data } = await axiosRequest.post(`${apiSoftInsta}/Post/like-post?postId=${id}`)
    } catch (error) {
      console.log(error);
    }
  },
  postComment: async (obj) => {
    try {
      const { data } = await axiosRequest.post(`/Post/add-comment`, obj)
    } catch (error) {
      console.log(error);
    }
  },
  deleteCommentPost: async (id) => {
    console.log(id);

    try {
      const { data } = await axiosRequest.delete(`https://instagram-api.softclub.tj/Post/delete-comment?commentId=${id}`)
    } catch (error) {
      console.log(error);
    }
  },
  UnFollow: async (id) => {
    try {
      const { data } = await axiosRequest.delete(`/FollowingRelationShip/delete-following-relation-ship?followingUserId=${id}`)
    } catch (error) {
      console.log(error);
    }
  },
  Follow: async (id) => {
    try {
      const { data } = await axiosRequest.post(`/FollowingRelationShip/add-following-relation-ship?followingUserId=${id}`)
    } catch (error) {
      console.log(error);
    }
  },
  postFavorite: async (obj) => {
    try {
      const { data } = await axiosRequest.post(`/Post/add-post-favorite`, obj)
    } catch (error) {
      console.log(error);
    }
  },
}))