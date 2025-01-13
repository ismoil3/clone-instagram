import axiosRequest from '@/utils/axiosMy/axiosMy'
import { create } from 'zustand'

export const useProfileById = create((set, get) => ({
    personById: {},
    personId: localStorage.getItem('user_profile_id') || null,
    setPersonId: (id) => set(() => ({
        personId: id,
    })),
    getPersonById: async () => {
        const { personId } = get()
        localStorage.setItem('user_profile_id', personId)
        
        try {
            const { data } = await axiosRequest.get(`/UserProfile/get-is-follow-user-profile-by-id?followingUserId=${personId}`);

            set({ personById: data.data, personId: personId })
        } catch (error) {
            console.log(error)
        }
    },
    likePostById: async postId => {
        try {
            const { data } = await axiosRequest.post(
                `/Post/like-post?postId=${postId}`
            )
            useProfileById.getState().getPersonPostsById()
        } catch (error) {
            console.log(error)
        }
    },
    personPostsById: [],
    getPersonPostsById: async () => {
        const { personId } = get()
        try {
            const { data } = await axiosRequest.get(`/Post/get-posts?UserId=${personId}`)

            set({ personPostsById: data.data })
        } catch (error) {
            console.log(error)
        }
    },
    initialSlideById: null,
    setInitialSlideById: index =>
        set(() => ({
            initialSlideById: index
        })),
    inputsById: {},
    setInputById: (id, value) =>
        set(state => ({
            inputsById: { ...state.inputsById, [id]: value }
        })),
    addCommentToPostById: async obj => {
        try {
            const { data } = await axiosRequest.post('/Post/add-comment', obj)
            useProfileById.getState().getPersonPostsById()
        } catch (error) {
            console.log(error)
        }
    },
}))