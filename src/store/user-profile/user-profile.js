'use client'
import axiosRequest from '@/utils/axiosMy/axiosMy'
import { jwtDecode } from 'jwt-decode'
import { create } from 'zustand'

export const useProfileStore = create((set, get) => ({
  person: {},
  stateDetector: false,
  setStateDetector: () => set((state) => ({
    stateDetector: !state.stateDetector
  })), 
  myId: localStorage.getItem('access_token') ? jwtDecode(localStorage.getItem('access_token'))?.sid : null,
  getPerson: async () => {
    try {
      const { data } = await axiosRequest.get('/UserProfile/get-my-profile')
      set({ person: data.data })
    } catch (error) {
      // console.log(error)
    }
  },
  personPosts: [],
  getPersonPosts: async () => {
    try {
      const { data } = await axiosRequest.get('/Post/get-my-posts')
      set({ personPosts: data })
    } catch (error) {
      console.log(error)
    }
  },
  personSaved: [],
  getPersonSaved: async () => {
    try {
      const { data } = await axiosRequest.get('/UserProfile/get-post-favorites')
      set({ personSaved: data.data })
    } catch (error) {
      console.log(error)
    }
  },
  mySubscribers: [],
  getMySubscribers: async (id) => {
    try {
      const { data } = await axiosRequest.get(`/FollowingRelationShip/get-subscribers?UserId=${id}`)
      set({ mySubscribers: data.data })
    } catch (error) {
      console.log(error)
    }
  },
  mySubscriptions: [],
  getMySubscriptions: async (id) => {
    try {
      const { data } = await axiosRequest.get(`/FollowingRelationShip/get-subscriptions?UserId=${id}`)
      set({ mySubscriptions: data.data })
    } catch (error) {
      console.log(error)
    }
  },
  deleteMySubscriber: async id => {
    try {
      const { data } = await axiosRequest.delete(
        `/FollowingRelationShip/delete-following-relation-ship?followingUserId=${id}`
      )
      
    } catch (error) {
      console.log(error)
    }
  },
  subscribe: async userId => {
    try {
      const { data } = await axiosRequest.post(
        `/FollowingRelationShip/add-following-relation-ship?followingUserId=${userId}`
      )
    } catch (error) {
      console.log(error)
    }
  },
  personReels: [],
  getPersonReels: async () => {
    try {
      const { data } = await axiosRequest.get('/Post/get-reels')
      set({ personReels: data.data })
    } catch (error) {
      console.log(error)
    }
  },
  deletePhotoProfile: async () => {
    try {
      const { data } = await axiosRequest.delete(
        '/UserProfile/delete-user-image-profile'
      )
      useProfileStore.getState().getPerson()
    } catch (error) {
      console.log(error)
    }
  },
  commentId: null,
  setCommentId: (id) =>
    set(() => ({
      commentId: id
    })),
  deleteComment: async commentId => {
    try {
      const { data } = await axiosRequest.delete(
        `/Post/delete-comment?commentId=${commentId}`
      )
      useProfileStore.getState().getPersonPosts()
      useProfileStore.getState().getPersonReels()
    } catch (error) {
      console.log(error)
    }
  },
  deletePost: async id => {
    try {
      const { data } = await axiosRequest.delete(
        `/Post/delete-post?id=${id}`
      )
      useProfileStore.getState().getPersonPosts()
      useProfileStore.getState().getPersonReels()
      set({
        isAlert: data.statusCode ? true : false,
        AlertMessage: 'Публикация успешно удалена'
      })
    } catch (error) {
      console.log(error)
    }
  },
  likePost: async postId => {
    try {
      const { data } = await axiosRequest.post(
        `/Post/like-post?postId=${postId}`
      )
      useProfileStore.getState().getPersonPosts()
      useProfileStore.getState().getPersonReels()
    } catch (error) {
      console.log(error)
    }
  },
  savePost: async postId => {
    try {
      const { data } = await axiosRequest.post(
        '/Post/add-post-favorite', {
          postId: postId
        }
      )
      useProfileStore.getState().getPersonPosts()
      useProfileStore.getState().getPersonReels()
    } catch (error) {
      console.log(error)
    }
  },

  addCommentToPost: async obj => {
    try {
      const { data } = await axiosRequest.post('/Post/add-comment', obj)
      useProfileStore.getState().getPersonPosts()
      useProfileStore.getState().getPersonReels()
    } catch (error) {
      console.log(error)
    }
  },
   
  
  editPhotoProfile: async obj => {
    try {
      const { data } = await axiosRequest.put(
        '/UserProfile/update-user-image-profile',
        obj
      )
      set({
        isAlert: data.statusCode ? true : false,
        AlertMessage: 'Фото добавлен'
      })

      useProfileStore.getState().getPerson()
    } catch (error) {
      console.log(error)
    }
  },
  isAlert: false,
  AlertMessage: '',
  updateProfile: async obj => {
    try {
      const { data } = await axiosRequest.put(
        '/UserProfile/update-user-profile',
        obj
      )
      useProfileStore.getState().getPerson()
      set({
        isAlert: data.statusCode ? true : false,
        AlertMessage: 'Профиль обновлён'
      })
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  },
  isOpenModalPhoto: false,
  setOpenModalPhoto: () =>
    set(() => ({
      isOpenModalPhoto: true
    })),
  setCloseModalPhoto: () =>
    set(() => ({
      isOpenModalPhoto: false
    })),
  isOpenModalViewPost: false,
  setOpenModalViewPost: () =>
    set(() => ({
      isOpenModalViewPost: true
    })),
  setCloseModalViewPost: () =>
    set(() => ({
      isOpenModalViewPost: false
    })),
  isOpenModalViewSavedPost: false,
  setOpenModalViewSavedPost: () =>
    set(() => ({
      isOpenModalViewSavedPost: true
    })),
  setCloseModalViewSavedPost: () =>
    set(() => ({
      isOpenModalViewSavedPost: false
    })),
  setOpenAlert: () =>
    set(() => ({
      isAlert: true
    })),
  setCloseAlert: () =>
    set(() => ({
      isAlert: false
    })),
  initialSlide: null,
  setInitialSlide: index =>
    set(() => ({
      initialSlide: index
    })),

  initialSlideOfSavedPost: null,
  setInitialSlideOfSavedPost: index =>
    set(() => ({
      initialSlideOfSavedPost: index
    })),
  inputs: {},
  setInput: (id, value) =>
    set(state => ({
      inputs: { ...state.inputs, [id]: value }
    })),
  isOpenModalDeleteComment: false,
  setOpenModalDeleteComment: () =>
    set(() => ({
      isOpenModalDeleteComment: true
    })),
  setCloseModalDeleteComment: () =>
    set(() => ({
      isOpenModalDeleteComment: false
    })),
  isOpenModalDeletePost: false,
  setOpenModalDeletePost: () =>
    set(() => ({
      isOpenModalDeletePost: true
    })),
  setCloseModalDeletePost: () =>
    set(() => ({
      isOpenModalDeletePost: false
    })),
  isOpenModalDeleteOkPost: false,
  setOpenModalDeleteOkPost: () =>
    set(() => ({
      isOpenModalDeleteOkPost: true
    })),
  setCloseModalDeleteOkPost: () =>
    set(() => ({
      isOpenModalDeleteOkPost: false
    })),
  isOpenModalMyProfileSettings: false,
  setOpenModalMyProfileSettings: () =>
    set(() => ({
      isOpenModalMyProfileSettings: true
    })),
  setCloseModalMyProfileSettings: () =>
    set(() => ({
      isOpenModalMyProfileSettings: false
    })),

  isOpenModalViewSubscribers: false,
  setOpenModalViewSubscribers: () =>
    set(() => ({
      isOpenModalViewSubscribers: true
    })),
  setCloseModalViewSubscribers: () =>
    set(() => ({
      isOpenModalViewSubscribers: false
    })),
  postId: null,
  setPostId: index =>
    set(() => ({
      postId: index
    }))
}))
