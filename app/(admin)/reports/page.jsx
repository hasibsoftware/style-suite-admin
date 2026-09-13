'use client';

import { useState } from 'react';
import styles from '../dashboard.module.css'; // পাথটি আপনার ফাইলের লোকেশন অনুযায়ী ঠিক আছে কিনা খেয়াল রাখবেন
import { FiPieChart, FiTrendingUp, FiShoppingBag, FiDollarSign, FiAward } from 'react-icons/fi';

export default function AnalyticsPage() {
    const [timeFilter, setTimeFilter] = useState('7 Days');
    
    // আপডেট ১: Today এর পর Yesterday যুক্ত করা হয়েছে
    const filters = ['Today', 'Yesterday', '7 Days', '30 Days', 'All Time']; 

    // ডেমো চার্ট ডাটা
    const chartData = [
        { day: 'Mon', sales: 12000, height: '40%' },
        { day: 'Tue', sales: 18500, height: '65%' },
        { day: 'Wed', sales: 9000,  height: '30%' },
        { day: 'Thu', sales: 24000, height: '85%' },
        { day: 'Fri', sales: 15000, height: '55%' },
        { day: 'Sat', sales: 28000, height: '100%' },
        { day: 'Sun', sales: 21000, height: '75%' },
    ];

    // টপ সেলিং শাড়ির লিস্ট
    const topSarees = [
        { name: 'Red Jamdani Saree', sold: 42, revenue: '৳1,89,000' },
        { name: 'Blue Katan Silk', sold: 28, revenue: '৳1,34,400' },
        { name: 'Pure Cotton Print', sold: 25, revenue: '৳70,000' },
        { name: 'Golden Georgette', sold: 18, revenue: '৳54,000' },
        { name: 'Traditional Tassar', sold: 12, revenue: '৳48,000' },
    ];

    return (
        <div style={{ padding: '0 4px' }}>
            {/* ১. হেডার ও টাইম ফিল্টার */}
            <div className={styles.analyticsHeader}>
                <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a202c', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FiPieChart style={{ color: '#90273c' }} /> Reports & Analytics
                    </h2>
                    <p style={{ fontSize: '13px', color: '#718096', margin: '4px 0 0 0' }}>Track your sales performance, revenue trends, and top products.</p>
                </div>
                
                {/* টাইম ফিল্টার */}
                <div className={styles.timeFilterGroup}>
                    {filters.map((filter) => (
                        <button 
                            key={filter}
                            onClick={() => setTimeFilter(filter)}
                            className={`${styles.timeFilterBtn} ${timeFilter === filter ? styles.activeFilter : ''}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* ২. ওভারভিউ কার্ডসমূহ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: '#fdf2f4', padding: '15px', borderRadius: '10px', color: '#90273c', fontSize: '24px' }}><FiDollarSign /></div>
                    <div>
                        <div style={{ fontSize: '12px', color: '#718096', fontWeight: '700', textTransform: 'uppercase' }}>Total Sales</div>
                        <div style={{ fontSize: '22px', fontWeight: '800', color: '#1a202c' }}>৳5,42,000</div>
                    </div>
                </div>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: '#ebf8ff', padding: '15px', borderRadius: '10px', color: '#3182ce', fontSize: '24px' }}><FiShoppingBag /></div>
                    <div>
                        <div style={{ fontSize: '12px', color: '#718096', fontWeight: '700', textTransform: 'uppercase' }}>Orders Placed</div>
                        <div style={{ fontSize: '22px', fontWeight: '800', color: '#1a202c' }}>125</div>
                    </div>
                </div>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: '#f0fff4', padding: '15px', borderRadius: '10px', color: '#38a169', fontSize: '24px' }}><FiTrendingUp /></div>
                    <div>
                        <div style={{ fontSize: '12px', color: '#718096', fontWeight: '700', textTransform: 'uppercase' }}>Avg. Order Value</div>
                        <div style={{ fontSize: '22px', fontWeight: '800', color: '#1a202c' }}>৳4,336</div>
                    </div>
                </div>
            </div>

            {/* ৩. মূল চার্ট ও লিস্ট লেআউট */}
            <div className={styles.analyticsMainLayout}>
                
                {/* বাম পাশ: Daily Sales Trend Chart */}
                <div className={styles.analyticsCardBox}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', margin: 0 }}>Daily Sales Trend ({timeFilter})</h3>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#38a169', background: '#f0fff4', padding: '4px 10px', borderRadius: '6px' }}>+12% vs last week</span>
                    </div>

                    {/* কাস্টম CSS বার চার্ট */}
                    <div className={styles.chartWrapper}>
                        {chartData.map((data, index) => (
                            <div key={index} className={styles.chartBarContainer}>
                                <div className={styles.chartTooltip}>৳{data.sales.toLocaleString()}</div>
                                <div className={styles.chartBar} style={{ height: data.height }}></div>
                                <div className={styles.chartLabel}>{data.day}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ডান পাশ: Last 7 Days Selling Sarees */}
                <div className={styles.analyticsCardBox}>
                    {/* আপডেট ২: Top Selling Sarees এর সাথে (Last 7 Days) যুক্ত করা হয়েছে */}
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiAward style={{ color: '#d69e2e' }} /> Top Selling Sarees (Last 7 Days)
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {topSarees.map((saree, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: index !== topSarees.length - 1 ? '1px solid #edf2f7' : 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '32px', height: '32px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '700', color: '#718096', fontSize: '12px' }}>
                                        #{index + 1}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a202c' }}>{saree.name}</div>
                                        <div style={{ fontSize: '12px', color: '#718096', marginTop: '2px' }}>{saree.sold} pieces sold</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '14px', fontWeight: '800', color: '#90273c' }}>
                                    {saree.revenue}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}