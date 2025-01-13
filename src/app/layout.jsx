'use client';

import { useEffect, useState } from 'react';
import './globals.css'; // для глобальных стилей, включая стили темной темы
import BottomNavigation from '@/components/layout/bottom-navigation/bottom-navigation';
import MiniSideBar from '@/components/layout/mini-side-bar/mini-side-bar';
import SideBar from '@/components/layout/side-bar/side-bar';
import { usePathname } from 'next/navigation';
import TranslatorProvider from '@/components/providers/translator-provider'
import ThemeWrapper from '@/components/providers/theme-provider'
import { useToolsStore } from '@/store/smile-tools/smile-tools';
import useDarkSide from '@/hook/useDarkSide';
import Switcher from '@/components/shared/switcher/switcher';
import Layout from './components/Layout';
import AuthCheck from './auth-check';

export default function RootLayout({ children }) {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { setWindowWidth: setWinWidth } = useToolsStore()
  const pathname = usePathname();



  // Логика для выбора типа боковой панели в зависимости от ширины окна
  const getBarType = () => {
    if (windowWidth <= 767) {
      return 'bottom';
    }
    if (windowWidth <= 1279 || pathname === '/search' || pathname.includes('chat')) {
      return 'minibar';
    }
    if (pathname === '/login' || pathname === '/registration') {
      return 'log'
    }
    return 'bar';
  };

  const barType = getBarType();
  const renderBar = (children) => {
    switch (barType) {
      case 'bottom':
        return <BottomNavigation>{children}</BottomNavigation>;
      case 'minibar':
        return <MiniSideBar>{children}</MiniSideBar>;
      case 'log':
        return <div>{children}</div>;
      case 'bar':
      default:
        return <SideBar>{children}</SideBar>;
    }
  };

  // Слушаем изменения размера окна
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWinWidth(window.innerWidth)
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <TranslatorProvider>
      <html lang="en">
        {/* Ensure there is no space or text node here */}
        <body className="h-full">
        <link rel="icon" href="https://www.logo.wine/a/logo/Instagram/Instagram-Logo.wine.svg" />
        <AuthCheck >
        <ThemeWrapper>
            <Layout>
            {pathname != '/login' && pathname != '/registration' ? renderBar(children) : children}
            </Layout>
          </ThemeWrapper>
        </AuthCheck>
          
        </body>
      </html>
    </TranslatorProvider>
  );
}
