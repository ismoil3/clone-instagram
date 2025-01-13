// src/components/ThemeSwitcher.js
import { useState, useEffect } from 'react';
import Switch from '@mui/material/Switch';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { useSettingStore } from '@/store/pages/setting/useSettingStore';

const ThemeSwitcher = () => {
    const {darkMode, setDarkMode} = useSettingStore();
    const menuStyle = 'flex gap-4 p-4 text-sm cursor-pointer active:scale-90 active:opacity-50 items-center rounded-2xl hover:bg-slate-400/20 duration-300'

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setDarkMode(savedTheme === 'dark');
        } else {
            setDarkMode(false);
        }
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);
    return (
        <div onClick={() => setDarkMode(!darkMode)} className={menuStyle}>
            <p>
                <DarkModeSwitch
                    moonColor='white'
                    sunColor='dark'
                    checked={darkMode}
                    size={20}
                />  </p>
            <p>Переключить тему</p>
        </div>
    );
};

export default ThemeSwitcher;
