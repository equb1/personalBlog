// Navbar.tsx
'use client';

import { memo, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaBars, FaTimes } from 'react-icons/fa';
import { FaSun, FaMoon } from 'react-icons/fa';
import Image from 'next/image'; // 导入 next/image

// 定义带有子分类的菜单项
type MenuItemType = {
  name: string;
  icon: string;
  path: string;
  subItems?: { name: string; path: string }[];
};

const menuItems: MenuItemType[] = [
  {
    name: '主页',
    icon: '🏠',
    path: '/',
  },
  {
    name: '技术文章',
    icon: '💻',
    path: '/posts',
    subItems: [
      { name: '学习笔记', path: '/posts/learning-notes' },
      { name: '笔试面试', path: '/posts/interviews' },
      { name: '项目实践', path: '/posts/projects' },
    ],
  },
  {
    name: '兴趣文章',
    icon: '🎨',
    path: '/interests',
    subItems: [
      { name: '游戏攻略', path: '/interests/games' },
      { name: '动漫观感', path: '/interests/anime' },
      { name: '阅读笔记', path: '/interests/reading' },
    ],
  },
  {
    name: '生活点滴',
    icon: '📝',
    path: '/life',
    subItems: [
      { name: '生活杂谈', path: '/life/miscellaneous' },
    ],
  },
  {
    name: '书籍分享',
    icon: '📚',
    path: '/books',
    subItems: [
      { name: '书架', path: '/books/shelf' },
    ],
  },
  {
    name: '视频分享',
    icon: '🎥',
    path: '/videos',
    subItems: [
      { name: '技术视频', path: '/videos/tech' },
      { name: '生活视频', path: '/videos/life' },
      { name: '兴趣视频', path: '/videos/hobbies' },
    ],
  },
];

// 搜索框组件
const SearchBox = memo(({ isScrolled }: { isScrolled: boolean }) => {
  if (!isScrolled) return null;
  return (
    <motion.div
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: 200 }}
      exit={{ opacity: 0, width: 0 }}
      className="relative"
    >
      <input
        type="text"
        placeholder="搜索..."
        className="w-full pl-4 pr-8 py-2 rounded-full 
            bg-white/90 dark:bg-gray-700/90
            border border-slate-200 dark:border-gray-600
            focus:outline-none focus:ring-2
            focus:ring-cyan-400 dark:focus:ring-cyan-500
            text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400
            transition-all"
      />
      <button className="absolute right-2 top-2 p-1 
                  text-slate-500 dark:text-gray-400">
        🔍
      </button>
    </motion.div>
  );
});
SearchBox.displayName = 'SearchBox'; // 添加 displayName

// 菜单项组件
const MenuItem = memo(({ item, activeItem, setActiveItem, setSubmenuOpen, submenuOpen, handleNavigation, isScrolled }: {
  item: MenuItemType;
  activeItem: string;
  setActiveItem: (value: string) => void;
  setSubmenuOpen: (value: string | null) => void;
  submenuOpen: string | null;
  handleNavigation: (path: string) => void;
  isScrolled: boolean;
}) => {
  const handleMouseEnter = () => {
    setActiveItem(item.name);
    setSubmenuOpen(item.name);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      if (submenuOpen !== item.name) {
        setSubmenuOpen(null);
      }
    }, 200);
  };

  return (
    <li
      key={item.name}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => handleNavigation(item.path)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all
              ${isScrolled
               ? 'text-slate-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400'
                : ' hover:text-cyan-300'}
              ${activeItem === item.name && 'bg-white/10 dark:bg-gray-700/50'}`}
      >
        <span className="text-lg">{item.icon}</span>
        <span className="font-medium">{item.name}</span>
        {/* 下划线动画 */}
        {activeItem === item.name && (
          <motion.div
            layoutId="underline"
            className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 dark:bg-cyan-500"
            transition={{ type: 'spring', bounce: 0.25 }}
          />
        )}
      </button>
      {/* 子菜单 */}
      {item.subItems && submenuOpen === item.name && (
        <motion.ul
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="absolute left-0 top-16 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg 
          rounded-lg shadow-soft py-2 w-48"
          transition={{ duration: 0.2 }}
          onMouseEnter={() => setSubmenuOpen(item.name)}
          onMouseLeave={() => setSubmenuOpen(null)}
        >
          {item.subItems.map((subItem) => (
            <li key={subItem.name}>
              <button
                className="block w-full px-4 py-2 text-left 
                  hover:bg-gray-100/50 dark:hover:bg-gray-700/50
                  text-gray-800 dark:text-gray-200"
                onClick={() => handleNavigation(subItem.path)}
              >
                {subItem.name}
              </button>
            </li>
          ))}
        </motion.ul>
      )}
    </li>
  );
});
MenuItem.displayName = 'MenuItem'; // 添加 displayName

// 移动端菜单项组件
const MobileMenuItem = memo(({ item, activeItem, setSubmenuOpen, submenuOpen, handleNavigation, setIsMenuOpen, isScrolled }: {
  item: MenuItemType;
  activeItem: string;
  setSubmenuOpen: (value: string | null) => void;
  submenuOpen: string | null;
  handleNavigation: (path: string) => void;
  setIsMenuOpen: (value: boolean) => void;
  isScrolled: boolean;
}) => {
  return (
    <li key={item.name}>
      <button
        onClick={() => {
          handleNavigation(item.path);
          setSubmenuOpen(null);
        }}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all
              ${isScrolled
               ? 'text-slate-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400'
                : 'text-white/90 hover:text-cyan-300'}
              ${activeItem === item.name && 'bg-white/10 dark:bg-gray-700/50'}`}
      >
        <span className="text-lg">{item.icon}</span>
        <span className="font-medium">{item.name}</span>
      </button>
      {/* 子菜单 */}
      {item.subItems && submenuOpen === item.name && (
        <ul className="pl-4 space-y-1">
          {item.subItems.map((subItem) => (
            <li key={subItem.name}>
              <button
                className="block w-full px-4 py-2 text-left 
                  hover:bg-gray-100/50 dark:hover:bg-gray-700/50
                  text-gray-800 dark:text-gray-200"
                onClick={() => {
                  handleNavigation(subItem.path);
                  setIsMenuOpen(false);
                }}
              >
                {subItem.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      {item.subItems && (
        <button
          className="absolute right-4 top-3 text-slate-500 dark:text-gray-400"
          onClick={() =>
            setSubmenuOpen(submenuOpen === item.name ? null : item.name)
          }
        >
          {submenuOpen === item.name ? <FaTimes size={16} /> : <FaBars size={16} />}
        </button>
      )}
    </li>
  );
});
MobileMenuItem.displayName = 'MobileMenuItem'; // 添加 displayName

export default function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState('主页');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false); // 状态管理当前模式
  const { data: session } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // 控制用户菜单的显示状态

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // 假设大屏显示导航栏的阈值为 1024px
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false); // 点击导航项后关闭菜单
  };

  // 切换白天/夜间模式
  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle('dark'); // 使用 Tailwind 默认的 'dark' 类
    const isDark = html.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light'); // 保存主题偏好
    setIsDarkMode(isDark); // 更新状态
    console.log("Current theme:", isDark ? 'dark' : 'light'); // 打印当前主题
  };
  
  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      setIsDarkMode(savedTheme === 'dark');
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', systemDark);
      setIsDarkMode(systemDark);
    }
    console.log("theme", savedTheme)
  }, []);

  // 生成默认头像
  const generateDefaultAvatar = (username: string) => {
    const initials = username
      .split(' ')
      .map((word) => word[0].toUpperCase())
      .join('');
    return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=128`;
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 
      ${isScrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-soft'
          : 'dark:bg-transparent'}`}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-16 flex items-center justify-between">
          {/* Logo区域 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`text-xl font-bold transition-colors cursor-pointer
              ${isScrolled
                  ? 'text-slate-800 dark:text-gray-100'
                  : 'text-white'}`}
            onClick={() => router.push('/')}
          >
            🚀 npcdyc
          </motion.div>

          {/* 移动端菜单按钮 */}
          <button
            className="lg:hidden p-2 rounded-full transition-all
              hover:bg-white/10 dark:hover:bg-gray-700/50
              text-slate-600 dark:text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>

          {/* 导航菜单（大屏幕） */}
          <ul className="hidden lg:flex space-x-6">
            {menuItems.map((item) => (
              <MenuItem
                key={item.name}
                item={item}
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                setSubmenuOpen={setSubmenuOpen}
                submenuOpen={submenuOpen}
                handleNavigation={handleNavigation}
                isScrolled={isScrolled}
              />
            ))}
          </ul>

          {/* 右侧功能区 */}
          <div className="flex items-center gap-4">
            <AnimatePresence>
              <SearchBox isScrolled={isScrolled} />
            </AnimatePresence>
            {/* 白天/夜间模式切换按钮 */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full transition-all
              hover:bg-white/10 dark:hover:bg-gray-700/50
              text-slate-600 dark:text-gray-300"
            >
              {isDarkMode ? <FaMoon size={20} /> : <FaSun size={20} />}
            </button>
            {/* 用户头像和菜单 */}
            {session ? (
              <div className="relative">
                <Image
                  src={session.user.image || generateDefaultAvatar(session.user.username)}
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-white dark:border-gray-900 cursor-pointer"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                />
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg"
                  >
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => router.push('/profile')}
                    >
                      个人空间
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => signOut()}
                    >
                      退出登录
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className={`px-4 py-2 rounded-full transition-all
                ${isScrolled
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white'}`}
              >
                登录
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 移动端侧边栏菜单 */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed top-0 left-0 h-full w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-soft z-40"
          >
            <ul className="p-4 space-y-2">
              {menuItems.map((item) => (
                <MobileMenuItem
                  key={item.name}
                  item={item}
                  activeItem={activeItem}
                  setSubmenuOpen={setSubmenuOpen}
                  submenuOpen={submenuOpen}
                  handleNavigation={handleNavigation}
                  setIsMenuOpen={setIsMenuOpen}
                  isScrolled={isScrolled}
                />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}