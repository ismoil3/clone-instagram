"use client"
import Profile from '@/assets/icon/layout/instagramDefaultProfile.jpg'
import {
  add,
  compas,
  compasActive,
  homeIcon,
  homeIconActive,
  message,
  messageActive,
  video,
  videoActive,
} from '@/assets/icon/layout/svg'
import useCreatePost from '@/store/pages/create/createPost'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Create from '../create-dialog/Create'
import { useSettingStore } from '@/store/pages/setting/useSettingStore'

export default function BottomNavigation({ children }) {
  const pathname = usePathname();
  const { changeCreatePostDialogOpened } = useCreatePost();
  const { darkMode: dm } = useSettingStore();

  const iconClass = "flex items-center gap-4 rounded-[8px] h-[52px] px-0 m-[0] justify-center"
  const profileClass = "w-[25px] h-[25px] rounded-[50%]"

  const icons = {
    '/': { active: homeIcon, inactive: homeIconActive },
    '/explore': { active: compas, inactive: compasActive },
    '/reels': { active: video, inactive: videoActive },
    '/chat': { active: message, inactive: messageActive },
    '/profile': { active: Profile, inactive: Profile },
  }

  return (
    <div>
      {children}
      <Create/>
      <section className="fixed w-[100%] z-[10] border-t-[1px] modal-theme border-gray-500/50 bottom-0">
        <div className={"flex gap-[0.5rem] align-bottom dark justify-evenly"}>
          {/* Home */}
          <Link className="block" href="/">
            <div className={iconClass}>
              {pathname === '/' ? icons['/'].active : icons['/'].inactive}
            </div>
          </Link>

          {/* Explore */}
          <Link href="/explore">
            <div className={iconClass}>
              {pathname === '/explore' ? icons['/explore'].active : icons['/explore'].inactive}
            </div>
          </Link>

          {/* Reels */}
          <Link href="/reels">
            <div className={iconClass}>
              {pathname === '/reels' ? icons['/reels'].active : icons['/reels'].inactive}
            </div>
          </Link>

          {/* Create Button */}
          <div onClick={()=>changeCreatePostDialogOpened(true)} className={iconClass}>
            {add}
          </div>

          {/* Chats */}
          <Link href="/chat">
            <div className={iconClass}>
              {pathname === '/chat' ? icons['/chat'].active : icons['/chat'].inactive}
            </div>
          </Link>

          {/* Profile */}
          <Link href="/profile">
            <div className={iconClass}>
              <Image
                className={`${pathname === '/profile' ? 'border-[2px] border-[solid] border-[black]' : ''} ${profileClass}`}
                src={Profile}
                alt="Profile"
              />
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
