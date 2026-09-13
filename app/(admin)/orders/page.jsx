'use client';

import { useState } from 'react';
import styles from '../dashboard.module.css';
import { FiSearch, FiGrid, FiList, FiMoreVertical } from 'react-icons/fi';

export default function OrdersPage() {
    const [activeTab, setActiveTab] = useState('All orders');
    const [activeDateFilter, setActiveDateFilter] = useState('Today');
    const [viewMode, setViewMode] = useState('grid'); 
    const [searchTerm, setSearchTerm] = useState('');

    const tabs = ['All orders', 'New orders', 'Review', 'Packed', 'Pending', 'Delivery', 'Cancel', 'Trash'];
    const dateFilters = ['Today', 'Yesterday', 'Last 7', 'Last 30', 'All Time'];

    const demoOrders = [
        { id: '#4227', name: 'Rahim Ahmed', items: '2 Items (Jamdani)', amount: '৳ 3,500', status: 'Pending', statusColor: '#c05621', statusBg: '#feebc8' },
        { id: '#4228', name: 'Sumaiya Akter', items: '1 Item (Silk)', amount: '৳ 7,200', status: 'Packed', statusColor: '#22543d', statusBg: '#c6f6d5' },
        { id: '#4229', name: 'Tanvir Hasan', items: '3 Items (Cotton)', amount: '৳ 1,800', status: 'New', statusColor: '#2b6cb0', statusBg: '#bee3f8' },
        { id: '#4230', name: 'Sadia Islam', items: '1 Item (Georgette)', amount: '৳ 2,500', status: 'Review', statusColor: '#805ad5', statusBg: '#e9d8fd' },
        { id: '#4231', name: 'Kazi Arif', items: '2 Items (Panjabi)', amount: '৳ 4,100', status: 'Delivery', statusColor: '#38a169', statusBg: '#c6f6d5' },
        { id: '#4232', name: 'Nusrat Jahan', items: '1 Item (Jamdani)', amount: '৳ 12,000', status: 'Pending', statusColor: '#c05621', statusBg: '#feebc8' },
        { id: '#4233', name: 'Rakib Hossain', items: '4 Items (Mixed)', amount: '৳ 9,300', status: 'Cancel', statusColor: '#e53e3e', statusBg: '#fed7d7' },
        { id: '#4234', name: 'Mitu Akter', items: '1 Item (Silk)', amount: '৳ 3,200', status: 'Packed', statusColor: '#22543d', statusBg: '#c6f6d5' },
    ];

    return (
        <div>
            {/* ১. টপ ট্যাব মেনু */}
            <div className={styles.orderTabs}>
                {tabs.map((tab) => (
                    <div 
                        key={tab} 
                        className={`${styles.orderTab} ${activeTab === tab ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            {/* ২. অ্যাকশন বার */}
            <div className={styles.actionBar}>
                {/* সার্চ বক্স (এখানে ক্লাস ব্যবহার করা হয়েছে যাতে লেখা কালো দেখায়) */}
                <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid #cbd5e0', borderRadius: '6px', padding: '8px 12px', width: '280px', flexGrow: 1, maxWidth: '400px' }}>
                    <FiSearch style={{ color: '#718096', marginRight: '8px', fontSize: '16px' }} />
                    <input 
                        type="text" 
                        placeholder="Search order id, customer..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

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

                <div className={styles.viewToggles}>
                    <button 
                        className={`${styles.viewToggleBtn} ${viewMode === 'grid' ? styles.activeView : ''}`}
                        onClick={() => setViewMode('grid')}
                        title="Grid View"
                    >
                        <FiGrid />
                    </button>
                    <button 
                        className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.activeView : ''}`}
                        onClick={() => setViewMode('list')}
                        title="List View"
                    >
                        <FiList />
                    </button>
                </div>
            </div>

            {/* ৩. অর্ডার গ্রিড */}
            {viewMode === 'grid' ? (
                <div className={styles.orderGrid}>
                    {demoOrders.map((order, index) => (
                        <div key={index} className={styles.orderBox}>
                            <div className={styles.boxHeader}>
                                <span className={styles.boxOrderId}>{order.id}</span>
                                <span className={styles.boxStatus} style={{ background: order.statusBg, color: order.statusColor }}>
                                    {order.status}
                                </span>
                            </div>
                            <div className={styles.boxCustomerInfo}>
                                <div className={styles.boxCustomerName}>{order.name}</div>
                                <div className={styles.boxItemCount}>{order.items}</div>
                            </div>
                            <div className={styles.boxFooter}>
                                <div className={styles.boxAmount}>{order.amount}</div>
                                <FiMoreVertical style={{ color: '#a0aec0', cursor: 'pointer' }} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.cardBox}>
                    <p style={{ textAlign: 'center', color: '#718096', padding: '30px' }}>
                        List view layout will appear here. Currently showing Grid view from sketch.
                    </p>
                </div>
            )}
        </div>
    );
}