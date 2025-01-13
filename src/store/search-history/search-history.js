import { apiSoftInsta } from "@/app/config/config";
import axiosRequest from "@/utils/axiosMy/axiosMy";
import axios from "axios";
import { create } from "zustand";

export const useSearchStore = create((set,get) => ({
    history: [],
    getSearchHistory: async () => {
        try {
            const { data } = await axiosRequest.get('/User/get-user-search-histories')

            set(({ history: data.data }));
        } catch (error) {
            console.log(error)
        }
    },
    searchValue: '',
    setSearchValue: (e) => set(() => ({
        searchValue: e.target.value
    })),
    clearSearchValue: () => set(() => ({
        searchValue: ''
    })),
    users: [],
    getUsers: async () => {
        const { searchValue } = get()
        
        try {
            const { data } = await axiosRequest.get(`/User/get-users?UserName=${searchValue}`)

            set(({ users: data.data }));
        } catch (error) {
           console.log(error);
        }
    },
    addHistory: async (userId) => {
        try {
            const { data } = await axiosRequest.post(`/User/add-user-search-history?UserSearchId=${userId}`)

            useSearchStore.getState().getSearchHistory()
        } catch (error) {
            console.log(error);
        }
    },
    isOpenModalDelete: false,
    setOpenModalDelete: () => set(() => ({
        isOpenModalDelete: true,
    })),
    setCloseModalDelete: () => set(() => ({
        isOpenModalDelete: false,
    })),
    modalStyle: {},
    deleteAllUsers: async () => {
        try {
            const { data } = await axiosRequest.delete('/User/delete-user-search-histories')
            useSearchStore.getState().getSearchHistory()
        } catch (error) {
            console.log(error)
        }
    },
    deleteHistory: async (id) => {
        try {
            const { data } = await axiosRequest.delete(`/User/delete-user-search-history?id=${id}`)
            useSearchStore.getState().getSearchHistory()
        } catch (error) {
            console.log(error)
        }
    },
}))