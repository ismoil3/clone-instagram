// src/components/Layout.js

import ThemeSwitcher from "./ThemeSwitcher";

const Layout = ({ children }) => {
  return (
    <div>      
      <div className="hidden">
      <ThemeSwitcher  />
      </div>
      {/* Основной контент страницы */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
