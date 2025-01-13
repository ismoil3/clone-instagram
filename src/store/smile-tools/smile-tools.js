import { create } from 'zustand'

export const useToolsStore = create((set) => ({
    windowWidth: window.innerWidth,
    setWindowWidth: (width) => set(() => ({
        windowWidth: width
    }))
}))