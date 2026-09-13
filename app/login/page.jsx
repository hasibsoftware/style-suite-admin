'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import styles from './login.module.css';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    // লগইন সাবমিট হ্যান্ডলার (এখানে ইউজারের নাম ও রোল সেট করা হচ্ছে)
    const handleLogin = (e) => {
        e.preventDefault();
        
        // লোকালস্টোরেজে নাম ও রোল সেভ করা (যা ড্যাশবোর্ডের টপবারে শো করবে)
        localStorage.setItem('userName', 'Style Suite Admin'); 
        localStorage.setItem('userRole', 'SUPER ADMIN');
        
        // সফল লগইনের পর ড্যাশবোর্ডে চলে যাবে
        window.location.href = '/dashboard';
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                {/* হেডার সেকশন */}
                <div className={styles.headerSection}>
                    <div className={styles.logoCircle}>
                        <span>SS</span>
                    </div>
                    <h1 className={styles.brandTitle}>STYLE SUITE</h1>
                    <p className={styles.brandSubtitle}>CUSTOMER & ADMIN PORTAL</p>
                </div>

                {/* ফর্ম সেকশন */}
                <div className={styles.formSection}>
                    <h2 className={styles.welcomeTitle}>Welcome Back!</h2>

                    <form onSubmit={handleLogin}>
                        {/* ইমেল / ফোন ইনপুট */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Email or Phone</label>
                            <div className={styles.inputField}>
                                <FiMail className={styles.fieldIcon} />
                                <input 
                                    type="text" 
                                    id="email" 
                                    placeholder="01752410562" 
                                    required 
                                />
                            </div>
                        </div>

                        {/* পাসওয়ার্ড ইনপুট */}
                        <div className={styles.inputGroup}>
                            <div className={styles.labelRow}>
                                <label htmlFor="password">Password</label>
                                <Link href="#" className={styles.forgotPass}>
                                    Forgot password?
                                </Link>
                            </div>
                            <div className={styles.inputField}>
                                <FiLock className={styles.fieldIcon} />
                                <input 
                                    type={showPassword ? 'text' : 'password'} 
                                    id="password" 
                                    placeholder="••••••••••••" 
                                    required 
                                />
                                <div 
                                    className={styles.toggleEye}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </div>
                            </div>
                        </div>

                        {/* সাইন ইন বাটন */}
                        <button type="submit" className={styles.submitBtn}>
                            Sign In <FiArrowRight />
                        </button>
                    </form>

                    <p className={styles.footerText}>
                        Don't have an account? <Link href="/register">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}