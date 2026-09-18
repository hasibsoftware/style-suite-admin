'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import styles from './login.module.css';

// ফায়ারবেস ইম্পোর্ট
import { auth } from '@/lib/firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    
    // ইনপুট থেকে ডেটা নেওয়ার জন্য স্টেট
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // লোডিং এবং এরর দেখানোর স্টেট
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // ফায়ারবেস লগইন ফাংশন
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            // ফায়ারবেসে ইমেইল-পাসওয়ার্ড পাঠানো হচ্ছে
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // লগইন সফল হলে ফায়ারবেস থেকে একটি সিকিউর টোকেন নেওয়া হচ্ছে
            const token = await user.getIdToken();

            // মিডলওয়্যার (চেকপোস্ট) যেন ড্যাশবোর্ডে ঢুকতে দেয়, তাই টোকেনটি কুকিতে (Cookie) সেভ করা হচ্ছে
            document.cookie = `auth-token=${token}; path=/; max-age=86400`; // 1 দিনের জন্য ভ্যালিড

            // আপনার আগের ডিজাইনের জন্য লোকালস্টোরেজ আপডেট (নামের প্রথম অংশটুকু সেভ করা হচ্ছে)
            const namePrefix = user.email.split('@')[0];
            localStorage.setItem('userName', namePrefix); 
            localStorage.setItem('userRole', 'SUPER ADMIN');
            
            // সফল লগইনের পর ড্যাশবোর্ডে চলে যাবে
            window.location.href = '/dashboard';
        } catch (err) {
            console.error("Login Error:", err);
            setError('Invalid email or password! Please try again.');
        } finally {
            setLoading(false);
        }
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

                    {/* এরর মেসেজ দেখানোর জায়গা */}
                    {error && <div style={{ color: '#e53e3e', fontSize: '13px', marginBottom: '10px', textAlign: 'center', backgroundColor: '#fff5f5', padding: '8px', borderRadius: '6px', border: '1px solid #feb2b2' }}>{error}</div>}

                    <form onSubmit={handleLogin}>
                        {/* ইমেল ইনপুট */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Email Address</label>
                            <div className={styles.inputField}>
                                <FiMail className={styles.fieldIcon} />
                                <input 
                                    type="email" 
                                    id="email" 
                                    placeholder="admin@example.com" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* পাসওয়ার্ড ইনপুট */}
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                        <button type="submit" className={styles.submitBtn} disabled={loading} style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                            {loading ? 'Signing In...' : <>Sign In <FiArrowRight /></>}
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