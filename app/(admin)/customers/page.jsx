'use client';

import { useState } from 'react';
import styles from '../dashboard.module.css';
import { FiSearch, FiPhone, FiFilter } from 'react-icons/fi';

export default function CustomersPage() {
    const [activeDateFilter, setActiveDateFilter] = useState('Today');
    const [sortBy, setSortBy] = useState('New'); // 'New', 'Old', 'Spend'
    const [searchTerm, setSearchTerm] = useState('');

    const dateFilters = ['Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'All time'];

    // ডেমো কাস্টমার ডাটা
    const demoCustomers = [
        { name: 'Rahim Ahmed', phone: '01712-345678', orders: '12 Orders', totalSpent: '৳ 24,500', spendVal: 24500, type: 'Repeat', date: '2026-08-01' },
        { name: 'Sumaiya Akter', phone: '01819-876543', orders: '3 Orders', totalSpent: '৳ 7,200', spendVal: 7200, type: 'New', date: '2026-08-03' },
        { name: 'Tanvir Hasan', phone: '01911-223344', orders: '8 Orders', totalSpent: '৳ 15,300', spendVal: 15300, type: 'Repeat', date: '2026-07-15' },
        { name: 'Sadia Islam', phone: '01521-556677', orders: '1 Order', totalSpent: '৳ 2,500', spendVal: 2500, type: 'New', date: '2026-08-02' },
        { name: 'Kazi Arif', phone: '01678-990011', orders: '5 Orders', totalSpent: '৳ 11,400', spendVal: 11400, type: 'Repeat', date: '2026-06-10' },
        { name: 'Nusrat Jahan', phone: '01300-445566', orders: '2 Orders', totalSpent: '৳ 4,800', spendVal: 4800, type: 'New', date: '2026-08-03' },
    ];

    // সর্টিং লজিক (Spend, New, Old অনুযায়ী কাস্টমার সাজানো)
    const sortedCustomers = [...demoCustomers].sort((a, b) => {
        if (sortBy === 'Spend') {
            return b.spendVal - a.spendVal;
        } else if (sortBy === 'New') {
            return new Date(b.date) - new Date(a.date);
        } else if (sortBy === 'Old') {
            return new Date(a.date) - new Date(b.date);
        }
        return 0;
    });

    return (
        <div>
            {/* ১. টপ স্ট্যাট কার্ডসমূহ */}
            <div className={styles.customerStatsGrid}>
                <div className={styles.customerStatCard}>
                    <div className={styles.customerStatTitle}>Total Customer</div>
                    <div className={styles.customerStatValue}>1,428</div>
                </div>
                <div className={styles.customerStatCard}>
                    <div className={styles.customerStatTitle}>Repeat Customer</div>
                    <div className={styles.customerStatValue} style={{ color: '#3182ce' }}>412</div>
                </div>
                <div className={styles.customerStatCard}>
                    <div className={styles.customerStatTitle}>New This Month</div>
                    <div className={styles.customerStatValue} style={{ color: '#38a169' }}>94</div>
                </div>
                <div className={styles.customerStatCard}>
                    <div className={styles.customerStatTitle}>Lifetime Sells</div>
                    <div className={styles.customerStatValue} style={{ color: '#90273c' }}>৳ 14,85,000</div>
                </div>
            </div>

            {/* ২. অ্যাকশন বার */}
            <div className={styles.customerActionBar}>
                {/* সার্চ বক্স (এখানে ক্লাস ব্যবহার করা হয়েছে যাতে লেখা কালো দেখায়) */}
                <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid #cbd5e0', borderRadius: '6px', padding: '8px 12px', width: '280px', flexGrow: 1, maxWidth: '320px' }}>
                    <FiSearch style={{ color: '#718096', marginRight: '8px', fontSize: '16px' }} />
                    <input 
                        type="text" 
                        placeholder="Search customer by name or phone..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                {/* ডেট ফিল্টার */}
                <div className={styles.dateFilters}>
                    {dateFilters.map((filter) => (
                        <button 
                            key={filter} 
                            className={`${styles.dateFilterBtn} ${activeDateFilter === filter ? styles.activeDate : ''}`}
                            onClick={() => setActiveDateFilter(filter)}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* সর্ট অপশন (Spend | New | Old) */}
                <div className={styles.sortDropdownContainer}>
                    <FiFilter style={{ color: '#718096' }} />
                    <span>Sort by:</span>
                    <button 
                        onClick={() => setSortBy('Spend')}
                        style={{ 
                            background: sortBy === 'Spend' ? '#90273c' : 'transparent', 
                            color: sortBy === 'Spend' ? '#fff' : '#4a5568', 
                            border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' 
                        }}
                    >
                        Spend
                    </button>
                    <button 
                        onClick={() => setSortBy('New')}
                        style={{ 
                            background: sortBy === 'New' ? '#90273c' : 'transparent', 
                            color: sortBy === 'New' ? '#fff' : '#4a5568', 
                            border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' 
                        }}
                    >
                        New
                    </button>
                    <button 
                        onClick={() => setSortBy('Old')}
                        style={{ 
                            background: sortBy === 'Old' ? '#90273c' : 'transparent', 
                            color: sortBy === 'Old' ? '#fff' : '#4a5568', 
                            border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' 
                        }}
                    >
                        Old
                    </button>
                </div>
            </div>

            {/* ৩. কাস্টমার গ্রিড */}
            <div className={styles.customerGrid}>
                {sortedCustomers.map((customer, index) => {
                    const initial = customer.name.charAt(0);
                    return (
                        <div key={index} className={styles.customerBox}>
                            <div className={styles.customerBoxHeader}>
                                <div className={styles.customerAvatarCircle}>{initial}</div>
                                <div>
                                    <div className={styles.customerDetailsName}>{customer.name}</div>
                                    <div className={styles.customerDetailsPhone}>
                                        <FiPhone style={{ display: 'inline', marginRight: '4px' }} />
                                        {customer.phone}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div className={styles.customerInfoRow}>
                                    <span>Total Orders:</span>
                                    <span>{customer.orders}</span>
                                </div>
                                <div className={styles.customerInfoRow}>
                                    <span>Total Spent:</span>
                                    <span style={{ color: '#90273c', fontWeight: '700' }}>{customer.totalSpent}</span>
                                </div>
                                <div className={styles.customerInfoRow}>
                                    <span>Customer Type:</span>
                                    <span style={{ 
                                        background: customer.type === 'Repeat' ? '#c6f6d5' : '#bee3f8', 
                                        color: customer.type === 'Repeat' ? '#22543d' : '#2b6cb0',
                                        padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700'
                                    }}>
                                        {customer.type}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}