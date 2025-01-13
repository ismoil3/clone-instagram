'use client'

import '../globals.css'
import ThemeWrapper from '@/components/providers/theme-provider'
import Link from 'next/link'
import { Button, Drawer } from '@mui/material'
import { NavigateBefore, NotificationsOutlined, PersonOutlineRounded } from '@mui/icons-material'
import { usePathname } from 'next/navigation'
import { useToolsStore } from '@/store/smile-tools/smile-tools'
import { useState } from 'react'

export default function SettingLayout({ children }) {
    const path = usePathname()
    const { windowWidth: ww } = useToolsStore()
    const [openDrawer, setOpenDrawer] = useState(false);
    const [Title, setTitle] = useState('Редактировать профиль');

    const bp = new Proxy({}, {
        get(target, prop) {
            if (prop.startsWith('w')) {
                const width = parseInt(prop.slice(1), 10);
                if (!isNaN(width)) {
                    return ww <= width ? true : false;
                }
            }
            return undefined;
        }
    });

    const links = [
        {
            name: 'Редактировать профиль',
            href: '/setting',
            icon: <PersonOutlineRounded />
        },
        {
            name: 'Уведомления',
            href: '/setting/notifications',
            icon: <NotificationsOutlined />
        }
    ]
    return (
        <ThemeWrapper>
            <div className='flex w-full'>
                <title>{Title}</title>
                {!bp.w767 && <div className='h-full flex flex-col min-w-[280px] gap-4 px-4 pt-10'>
                    <p className='text-xl font-[700] ml-8'>Настройки</p>
                    <div className='flex flex-col gap-1'>
                        {links.map((link, i) => <Link key={i} onClick={() => setTitle(link.name)} href={link.href}>
                            <div className={"flex items-center active:opacity-50 gap-4 rounded-md p-3 hover:bg-gray-500/10 duration-300 hover:scale-[1.01] cursor-pointer" + (path == link.href && " bg-gray-500/10")}>
                                {link.icon}
                                <p className="text-sm">{link.name}</p>
                            </div>
                        </Link>)}
                    </div>
                </div>}

                {bp.w767 && openDrawer &&
                        <Drawer
                            PaperProps={{
                                sx: {
                                    borderRadius: "0 10px 10px 0",
                                }
                            }} open={openDrawer} onClose={() => setOpenDrawer(false)}>
                            <div className='h-full flex flex-col modal-theme modal-text min-w-[280px] gap-4 px-4 pt-10'>
                                <p className='text-xl font-[700] ml-8'>Настройки</p>
                                <div className='flex flex-col gap-1'>
                                    {links.map((link, i) => <Link key={i} onClick={() => setTitle(link.name)} href={link.href}>
                                        <div className={"flex items-center active:opacity-50 gap-4 rounded-md p-3 hover:bg-gray-500/10 duration-300 hover:scale-[1.01] cursor-pointer" + (path == link.href && " bg-gray-500/10")}>
                                            {link.icon}
                                            <p className="text-sm">{link.name}</p>
                                        </div>
                                    </Link>)}
                                </div>
                            </div>
                        </Drawer>}
                <div className='w-full max-w-[650px] flex flex-col mx-auto'>
                    {bp.w767 &&
                        <Button color='black' onClick={() => setOpenDrawer(true)} sx={{
                            padding: '2px 5px',
                            borderBottom: '1px solid #aaa5',
                            position: 'sticky',
                            textTransform: 'none',
                            top: '0',
                            justifyContent: 'start',
                            width: '100%',
                        }}><NavigateBefore />Настройки</Button>}
                    {children}</div>
            </div>
        </ThemeWrapper>
    )
}
