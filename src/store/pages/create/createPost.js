'use client'
import axiosRequest from "@/utils/axiosMy/axiosMy";
// import axiosFormdata from "@/utils/axiosFormdata/axiosFormdata";
import { create } from "zustand";

const useCreatePost = create((set)=>({
    createPostDialogOpened: false, 
    changeCreatePostDialogOpened: (value) => set(()=>({createPostDialogOpened: value})),

    addPost : async (formData) => {
        try {
            const {data} = await axiosRequest.post("/Post/add-post", formData);
            console.log(data.data);
        } catch (error) {
            console.log(error);
            
        }
    }
}))

export default useCreatePost;