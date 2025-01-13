import { create } from "zustand";




export const useSettingStore = create((set, get) => ({
    darkMode: localStorage.getItem('theme') == 'light' ? false : true,
    setDarkMode: (theme) => set((state)=> ({darkMode: theme}))
}))