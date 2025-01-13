import { apiSoftInsta } from "@/app/config/config";
import axiosRequest from "@/utils/axiosMy/axiosMy";
import axios from "axios";
import { create } from "zustand";

export const useChatStore = create((set, get) => ({
    data: [],
    getChats: async () => {
        try {
            const { data } = await axios.get(`${apiSoftInsta}/Chat/get-chats`, {
                headers: {
                    "Authorization": ` Bearer ${localStorage.getItem("access_token")}`
                }
            })
            set({ data: data.data })
        } catch (error) {
            console.log(error);

        }
    },
    message: [],
    getChat: async (id) => {
        try {
            const { data } = await axiosRequest.get(`${apiSoftInsta}/Chat/get-chat-by-id?chatId=${id}`)
            set({ message: data.data })
        } catch (error) {
            console.log(error);
        }
    },
    deleteMessage: async (id) => {
        try {
            const { data } = await axiosRequest.delete(`${apiSoftInsta}/Chat/delete-message?massageId=${id}`)
        } catch (error) {
            console.log(error);
        }
    },
    deleteChat: async (id) => {
        try {
            const { data } = await axiosRequest.delete(`${apiSoftInsta}/Chat/delete-chat?chatId=${id}`)
            get().getChats()
        } catch (error) {
            console.log(error);
        }
    },
    postMessage: async (obj) => {
        try {
            const { data } = await axiosRequest.put(`${apiSoftInsta}/Chat/send-message`, obj)
        } catch (error) {
            console.log(error);
        }
    }
}))