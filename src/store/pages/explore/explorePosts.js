import { create } from 'zustand';

const useExplorePosts = create((set)=>({
    posts: [],
    changePosts: (value) => set(() => ({posts: value})),

    postByIdModalOpened: false,
    changePostByIdModalOpened: (value) => set(() => ({postByIdModalOpened: value})),

    currentSlide: 0,
    changeCurrentSlide: (value) => set(() => ({currentSlide: value})),

    page: 1,
    changePage: (value) => set(() => ({page: value})),

    hasMore: true,
    changeHasMore: (value) => set(() => ({hasMore: value})),

    loading: false,
    changeLoading: (value) => set(() => ({loading: value})),

    searchValue: "",
    changeSearchValue: (value) => set(() => ({searchValue: value}))
}))

export default useExplorePosts;