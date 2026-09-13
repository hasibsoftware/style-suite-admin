'use client';

import { useState } from 'react';
import styles from '../dashboard.module.css';
import { FiSearch, FiBox, FiClock, FiRotateCcw } from 'react-icons/fi';

export default function PackingPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeDateFilter, setActiveDateFilter] = useState('Today');
    const [showHistory, setShowHistory] = useState(false); // হিস্ট্রি দেখানোর জন্য স্টেট
    const dateFilters = ['Today', 'Yesterday', 'Last 7', 'Last 30', 'All Time'];

    // ডেমো অ্যাক্টিভ প্যাকিং লিস্ট
    const packingItems = [
        { id: '#PK-501', order: '#4227', customer: 'Rahim Ahmed', item: 'Jamdani Saree (Red)', status: 'Ready to Pack' },
        { id: '#PK-502', order: '#4228', customer: 'Sumaiya Akter', item: 'Katan Silk (Blue)', status: 'Packed' },
        { id: '#PK-503', order: '#4229', customer: 'Tanvir Hasan', item: 'Cotton Saree (White)', status: 'Pending' },
        { id: '#PK-504', order: '#4230', customer: 'Sadia Islam', item: 'Georgette (Black)', status: 'Ready to Pack' },
    ];

    // ডেমো হিস্ট্রি ডাটা
    const historyList = [
        { id: '#PK-401', date: '03 Aug 2026', parcel: '2 Parcels', saree: '3 Sarees', status: 'Packed', customer: 'Rahim Ahmed' },
        { id: '#PK-402', date: '02 Aug 2026', parcel: '1 Parcel', saree: '2 Sarees', status: 'Packed', customer: 'Sumaiya Akter' },
        { id: '#PK-403', date: '01 Aug 2026', parcel: '4 Parcels', saree: '5 Sarees', status: 'Packed', customer: 'Tanvir Hasan' },
    ];

    return (
        <div>
            {/* ১. ওপরের স্ট্যাট ও ক্লিকযোগ্য হিস্ট্রি ব্যানার */}
            <div className={styles.packingTopGrid}>
                <div className={styles.packingStatCardSaree}>
                    <div className={styles.packingStatTitle}>Total Saree Packed</div>
                    <div className={styles.packingStatValue}>142</div>
                </div>

                {/* এই ব্যানারটিতে ক্লিক করলে হিস্ট্রি শো/হাইড্র হবে */}
                <div 
                    className={styles.packingHistoryBanner} 
                    onClick={() => setShowHistory(!showHistory)}
                    style={{ cursor: 'pointer', border: showHistory ? '2px solid #90273c' : '1px solid #e2e8f0' }}
                    title="Click to view Packing History"
                >
                    <div>
                        <div className={styles.packingHistoryTitle}>
                            {showHistory ? '📦 Active Packing View' : 'Packing History & Logs'}
                        </div>
                        <p style={{ fontSize: '13px', color: '#718096', margin: '4px 0 0 0' }}>
                            {showHistory ? 'Click here to switch back to active queue.' : 'Click here to view completed packing history & logs.'}
                        </p>
                    </div>
                    <FiClock style={{ fontSize: '28px', color: '#90273c' }} />
                </div>
            </div>

            {/* যদি হিস্ট্রি টগল অন থাকে, তবে হিস্ট্রি সেকশন ডেট ফিল্টারসহ দেখাবে */}
            {showHistory ? (
                <div className={styles.packingCardBox} style={{ background: '#fdf2f4', border: '1px solid #f5c6cb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#90273c', margin: 0 }}>
                            📜 Packing History Records (Total Parcel: 129, Total Saree: 175)
                        </h3>
                        <button 
                            onClick={() => setShowHistory(false)}
                            style={{ background: '#90273c', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
                        >
                            Close History
                        </button>
                    </div>

                    {/* স্কেচ অনুযায়ী হিস্ট্রি পেজের ভেতরে ডেট ফিল্টার বক্স */}
                    <div className={styles.customerActionBar} style={{ marginBottom: '15px', background: '#fff', padding: '10px', borderRadius: '8px' }}>
                        <div className={styles.dateFilters} style={{ flexWrap: 'wrap' }}>
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
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {historyList.map((item, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a202c' }}>{item.id} - {item.customer}</div>
                                    <div style={{ fontSize: '12px', color: '#718096' }}>{item.date} • {item.parcel} • {item.saree}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ background: '#c6f6d5', color: '#22543d', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>
                                        {item.status}
                                    </span>
                                    <button style={{ background: '#fed7d7', color: '#c53030', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <FiRotateCcw /> Unpack
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* অন্যথায় নরমাল প্যাকিং কিউ ও সিএম ডিটেইলস দেখাবে */
                <div className={styles.packingMainLayout}>
                    {/* বাম পাশের বক্স: সার্চ, ফিল্টার ও আইটেম লিস্ট */}
                    <div className={styles.packingCardBox}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '15px' }}>
                            Active Packing Queue
                        </h3>

                        <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid #cbd5e0', borderRadius: '6px', padding: '8px 12px', marginBottom: '15px' }}>
                            <FiSearch style={{ color: '#718096', marginRight: '8px', fontSize: '16px' }} />
                            <input 
                                type="text" 
                                placeholder="Search order or item..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        <div className={styles.dateFilters} style={{ marginBottom: '15px', flexWrap: 'wrap' }}>
                            {dateFilters.map((filter) => (
                                <button 
                                    key={filter} 
                                    className={`${styles.dateFilterBtn} ${activeDateFilter === filter ? styles.activeDate : ''}`}
                                    onClick={() => setActiveDateFilter(filter)}
                                    style={{ fontSize: '11px', padding: '5px 8px' }}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {packingItems.map((item, index) => (
                                <div key={index} className={styles.packingItemRow}>
                                    <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                                    <div style={{ flexGrow: 1 }}>
                                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>{item.item}</div>
                                        <div style={{ fontSize: '12px', color: '#718096' }}>Order: {item.order} • {item.customer}</div>
                                    </div>
                                    <span style={{ 
                                        background: item.status === 'Packed' ? '#c6f6d5' : '#feebc8', 
                                        color: item.status === 'Packed' ? '#22543d' : '#c05621',
                                        padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700'
                                    }}>
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ডান পাশের বক্স: CM Details & Dispatch */}
                    <div className={styles.packingCardBox}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c' }}>CM Details & Dispatch</h3>
                            <span style={{ background: '#ebf4ff', color: '#3182ce', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>
                                Express CM
                            </span>
                        </div>

                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
                            <div style={{ fontSize: '13px', color: '#4a5568', marginBottom: '6px' }}>
                                <strong>Selected Order:</strong> #4227 (Rahim Ahmed)
                            </div>
                            <div style={{ fontSize: '13px', color: '#4a5568', marginBottom: '6px' }}>
                                <strong>Items to Pack:</strong> 2x Jamdani Saree
                            </div>
                            <div style={{ fontSize: '13px', color: '#4a5568' }}>
                                <strong>Delivery Address:</strong> Dhanmondi, Dhaka
                            </div>
                        </div>

                        <div style={{ border: '1px dashed #cbd5e0', borderRadius: '8px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
                            <FiBox style={{ fontSize: '32px', color: '#a0aec0', marginBottom: '8px' }} />
                            <div style={{ fontSize: '13px', color: '#718096', fontWeight: '600' }}>Scan barcode or drop items here for packing verification</div>
                        </div>

                        <button style={{ width: '100%', background: '#90273c', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                            Complete Packing & Print Label
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}