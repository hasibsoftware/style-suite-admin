'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { 
    FiGrid, FiShoppingCart, FiUsers, FiPackage, 
    FiRefreshCcw, FiTruck, FiBox, FiBarChart2,
    FiBriefcase, FiUserCheck, FiActivity, FiSettings,
    FiHeadphones, FiLogOut,
    FiCalendar, FiSearch, FiBell, FiMenu, FiX,
    FiSun, FiMoon // ডার্ক ও লাইট মোডের জন্য আইকন ইম্পোর্ট করা হয়েছে
} from 'react-icons/fi';
import styles from './dashboard.module.css';

const mainMenuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiGrid /> },
    { name: 'Orders', path: '/orders', icon: <FiShoppingCart /> },
    { name: 'Customers', path: '/customers', icon: <FiUsers /> },
    { name: 'Packing', path: '/packing', icon: <FiPackage /> },
    { name: 'Returns', path: '/returns', icon: <FiRefreshCcw /> },
    { name: 'Courier', path: '/courier', icon: <FiTruck /> },
    { name: 'Products', path: '/products', icon: <FiBox /> },
    { name: 'Reports & Analytics', path: '/reports', icon: <FiBarChart2 /> },
];

const managementMenuItems = [
    { name: 'Payroll', path: '/payroll', icon: <FiBriefcase /> },
    { name: 'Users', path: '/users', icon: <FiUserCheck /> },
    { name: 'Activity Logs', path: '/activity-logs', icon: <FiActivity /> },
    { name: 'Settings', path: '/settings', icon: <FiSettings /> },
];

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [userName, setUserName] = useState('Admin');
    const [userRole, setUserRole] = useState('ADMIN');
    
    // ডার্ক মোডের জন্য স্টেট
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        const storedRole = localStorage.getItem('userRole');
        if (storedName) setUserName(storedName);
        if (storedRole) setUserRole(storedRole);

        // পেজ লোড হওয়ার সময় লোকালস্টোরেজ থেকে থিম চেক করা
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark-mode');
        }
    }, []);

    // থিম টগল করার ফাংশন
    const toggleTheme = () => {
        if (isDarkMode) {
            setIsDarkMode(false);
            localStorage.setItem('theme', 'light');
            document.documentElement.classList.remove('dark-mode');
        } else {
            setIsDarkMode(true);
            localStorage.setItem('theme', 'dark');
            document.documentElement.classList.add('dark-mode');
        }
    };

    const userInitial = userName ? userName.charAt(0).toUpperCase() : 'A';
    const today = new Date();
    const formattedDate = `Today, ${today.getDate()} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;

    return (
        <div className={`${styles.adminLayout} ${isDarkMode ? styles.darkLayout : ''}`}>
            
            <Toaster position="top-right" reverseOrder={false} />

            {/* সাইডবার */}
            <aside className={`${styles.sidebar} ${isMobileOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logo}>SS</div>
                    <div className={styles.brandInfo}>
                        <span className={styles.brandTitle}>STYLE SUITE</span>
                        <span className={styles.brandSubtitle}>Super Admin Panel</span>
                    </div>
                </div>

                <div className={styles.menuContainer}>
                    <ul className={styles.menuList}>
                        {mainMenuItems.map((item, index) => {
                            const isActive = pathname === item.path;
                            return (
                                <li key={index}>
                                    <Link 
                                        href={item.path} 
                                        className={`${styles.menuItem} ${isActive ? styles.activeItem : ''}`}
                                        onClick={() => setIsMobileOpen(false)}
                                    >
                                        <span className={styles.menuIcon}>{item.icon}</span>
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    <h3 className={styles.sectionTitle}>MANAGEMENT</h3>
                    <ul className={styles.menuList}>
                        {managementMenuItems.map((item, index) => {
                            const isActive = pathname === item.path;
                            return (
                                <li key={index}>
                                    <Link 
                                        href={item.path} 
                                        className={`${styles.menuItem} ${isActive ? styles.activeItem : ''}`}
                                        onClick={() => setIsMobileOpen(false)}
                                    >
                                        <span className={styles.menuIcon}>{item.icon}</span>
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    <div className={styles.bottomSection}>
                        <div className={styles.helpCard}>
                            <div className={styles.helpIconWrapper}><FiHeadphones /></div>
                            <h4 className={styles.helpTitle}>Need Help?</h4>
                            <p className={styles.helpText}>Contact our support team.</p>
                            <button className={styles.contactBtn}>Contact Support</button>
                        </div>
                        <button className={styles.logoutBtn} onClick={() => {
                            localStorage.clear();
                            window.location.href = '/login';
                        }}>
                            <FiLogOut style={{ fontSize: '18px' }} /> Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* মূল কন্টেন্ট ও টপবার */}
            <main className={styles.mainContent}>
                <header className={styles.topbar}>
                    <button className={styles.menuToggleBtn} onClick={() => setIsMobileOpen(!isMobileOpen)}>
                        {isMobileOpen ? <FiX /> : <FiMenu />}
                    </button>

                    <div className={styles.dateBadge}>
                        <FiCalendar style={{ color: '#718096' }} />
                        <span>{formattedDate}</span>
                    </div>

                    {/* টপবারের সার্চ বক্স */}
                    <div className={styles.searchContainer}>
                        <FiSearch style={{ color: '#718096' }} />
                        <input type="text" placeholder="Search..." className={styles.topbarSearchInput} />
                    </div>

                    <div className={styles.profileSection}>
                        
                        {/* নোটিফিকেশন বেলের পাশে ডার্ক/লাইট মোড টগল বাটন */}
                        <button 
                            onClick={toggleTheme}
                            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            style={{ 
                                background: 'transparent', 
                                border: '1px solid #cbd5e0', 
                                borderRadius: '50%', 
                                width: '36px', 
                                height: '36px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                cursor: 'pointer',
                                color: isDarkMode ? '#f6e05e' : '#4a5568',
                                transition: 'all 0.2s ease',
                                marginRight: '4px'
                            }}
                        >
                            {isDarkMode ? <FiSun size={17} /> : <FiMoon size={17} />}
                        </button>

                        <FiBell className={styles.bellIcon} />
                        
                        <div className={styles.userProfile}>
                            <div className={styles.userDetails}>
                                <span className={styles.userName}>{userName}</span>
                                <span className={styles.userRole}>{userRole}</span>
                            </div>
                            <div className={styles.userAvatar}>{userInitial}</div>
                        </div>
                    </div>
                </header>

                <div className={styles.pageContent}>
                    {children}
                </div>
            </main>
        </div>
    );
}