'use client';

import { useState, useEffect } from 'react';
import { FiTrendingUp, FiShoppingBag, FiAlertTriangle, FiTruck, FiPackage, FiRotateCcw, FiActivity } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        sellsToday: 21680,
        ordersToday: 16,
        lowStock: 21,
        pendingCourier: 0,
        pendingPacking: 0,
        todayReturn: 0
    });

    const [bestSellers, setBestSellers] = useState([]);
    const [teamPerformance, setTeamPerformance] = useState([]);
    const [topDistricts, setTopDistricts] = useState([]);
    
    // নতুন স্টেট: লাইভ অ্যাক্টিভিটির জন্য
    const [activities, setActivities] = useState([]); 

    // টাইম ক্যালকুলেট করার ফাংশন (যেমন: Just now, 5 mins ago)
    const timeAgo = (dateString) => {
        if (!dateString) return 'Just now';
        const now = new Date();
        const past = new Date(dateString);
        const diffInSeconds = Math.floor((now - past) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Products Data Fetching
                const productsSnapshot = await getDocs(collection(db, "products"));
                const products = productsSnapshot.docs.map(doc => doc.data());
                
                const lowStockCount = products.filter(p => (parseInt(p.stock) || 0) <= 5).length;
                if (lowStockCount > 0) {
                    setStats(prev => ({ ...prev, lowStock: lowStockCount }));
                }

                if (products.length > 0) {
                    const mappedProducts = products.slice(0, 5).map(p => ({
                        name: p.name || 'Jamdani Saree',
                        sold: Math.floor(Math.random() * 50) + 10,
                        image: p.images?.[0] || p.imageUrl || ''
                    }));
                    setBestSellers(mappedProducts);
                } else {
                    setBestSellers([
                        { name: 'Jamdani Saree', sold: 45, image: '' },
                        { name: 'Jamdani Saree', sold: 45, image: '' },
                        { name: 'Jamdani Saree', sold: 45, image: '' },
                        { name: 'Jamdani Saree', sold: 45, image: '' },
                        { name: 'Jamdani Saree', sold: 45, image: '' },
                    ]);
                }

                // 🔴 Live Activity Fetching (Firebase Theke)
                const activitySnapshot = await getDocs(collection(db, "activity_logs"));
                let fetchedActivities = activitySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                if (fetchedActivities.length > 0) {
                    // সবচেয়ে নতুনগুলো আগে দেখানোর জন্য সর্ট করা
                    fetchedActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    setActivities(fetchedActivities.slice(0, 5)); // সেরা ৫টি অ্যাক্টিভিটি দেখাবে
                } else {
                    // যদি ফায়ারবেসে কোনো ডেটা না থাকে, তবে টেস্টিংয়ের জন্য ডামি ডেটা
                    const now = Date.now();
                    setActivities([
                        { id: 1, action: 'Order status updated to Packed', timestamp: new Date(now - 2 * 60000).toISOString() }, // 2 mins ago
                        { id: 2, action: 'New customer account created', timestamp: new Date(now - 45 * 60000).toISOString() }, // 45 mins ago
                        { id: 3, action: 'Payment verified manually', timestamp: new Date(now - 120 * 60000).toISOString() } // 2 hours ago
                    ]);
                }

                setTeamPerformance([
                    { name: 'Sadia Sultana', role: 'Manager', orders: 42 },
                    { name: 'Ullash Ahmed', role: 'Admin', orders: 38 },
                ]);

                setTopDistricts([
                    { district: 'Dhaka', orders: 85, sales: 145000 },
                    { district: 'Chattogram', orders: 34, sales: 68500 },
                ]);

            } catch (error) {
                console.error("Error loading dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div style={{ padding: '0 4px 30px', background: '#f8fafc', minHeight: '100vh' }}>
            <Toaster position="top-right" />

            {/* Top 6 Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>SELLS TODAY</span>
                        <FiTrendingUp style={{ color: '#10b981' }} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '20px', color: '#1e293b' }}>৳ {stats.sellsToday.toLocaleString()}</h3>
                </div>

                <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>ORDERS TODAY</span>
                        <FiShoppingBag style={{ color: '#3b82f6' }} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '20px', color: '#1e293b' }}>{stats.ordersToday}</h3>
                </div>

                <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>LOW STOCK ITEMS</span>
                        <FiAlertTriangle style={{ color: '#f59e0b' }} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '20px', color: '#f59e0b' }}>{stats.lowStock}</h3>
                </div>

                <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>PENDING COURIER</span>
                        <FiTruck style={{ color: '#64748b' }} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '20px', color: '#1e293b' }}>{stats.pendingCourier}</h3>
                </div>

                <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>PENDING PACKING</span>
                        <FiPackage style={{ color: '#64748b' }} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '20px', color: '#1e293b' }}>{stats.pendingPacking}</h3>
                </div>

                <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>TODAY RETURN</span>
                        <FiRotateCcw style={{ color: '#ef4444' }} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '20px', color: '#1e293b' }}>{stats.todayReturn}</h3>
                </div>
            </div>

            {/* Middle Section: Best Selling & Live Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
                
                {/* Best Selling Sarees */}
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>Best Selling Sarees</h4>
                        <a href="/products" style={{ fontSize: '12px', color: '#90273c', textDecoration: 'none', fontWeight: '600' }}>View All</a>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                        {bestSellers.map((item, idx) => (
                            <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                                <div style={{ height: '90px', background: '#e2e8f0', borderRadius: '6px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>Img</span>
                                    )}
                                </div>
                                <h5 style={{ margin: '0 0 2px', fontSize: '12px', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h5>
                                <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Sold: {item.sold}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 🔴 ডায়নামিক Live Activity Section */}
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FiActivity style={{ color: '#3b82f6' }} /> Live Activity
                        </h4>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Real-time</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {activities.length > 0 ? activities.map((activity, idx) => (
                            <div key={activity.id || idx} style={{ fontSize: '13px', paddingBottom: '8px', borderBottom: idx !== activities.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                <p style={{ margin: '0 0 2px', color: '#1e293b', fontWeight: '500' }}>{activity.action}</p>
                                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{timeAgo(activity.timestamp)}</span>
                            </div>
                        )) : (
                            <div style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', padding: '10px 0' }}>No recent activity</div>
                        )}
                    </div>
                </div>

            </div>

            {/* Lower Section: Products Status Chart & Immediate Attention */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
                
                {/* Products Status Bar Chart */}
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>Products Status (Weekly Sales Trend)</h4>
                        <a href="/products" style={{ fontSize: '12px', color: '#90273c', textDecoration: 'none', fontWeight: '600' }}>Details</a>
                    </div>
                    <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: '10px', borderBottom: '2px solid #e2e8f0' }}>
                        {[
                            { day: 'Sat', height: '40%' },
                            { day: 'Sun', height: '65%' },
                            { day: 'Mon', height: '30%' },
                            { day: 'Tue', height: '80%' },
                            { day: 'Wed', height: '60%' },
                            { day: 'Thu', height: '45%' },
                            { day: 'Fri', height: '75%' },
                        ].map((bar, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', width: '35px' }}>
                                <div style={{ width: '100%', height: bar.height, background: '#90273c', borderRadius: '4px 4px 0 0', transition: 'height 0.3s' }} title={bar.day}></div>
                                <span style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', fontWeight: '600' }}>{bar.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Immediate Attention */}
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>Immediate Attention</h4>
                        <span style={{ fontSize: '11px', background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>2 Urgent</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <div>
                                <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>Low stock alert</p>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>Inventory</span>
                            </div>
                            <a href="/products" style={{ fontSize: '12px', color: '#dc2626', fontWeight: '700', textDecoration: 'none' }}>Restock</a>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <div>
                                <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>Unassigned order</p>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>Shipping</span>
                            </div>
                            <a href="/orders" style={{ fontSize: '12px', color: '#3b82f6', fontWeight: '700', textDecoration: 'none' }}>Assign</a>
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Row: Team Performance & Top District Sales */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                
                {/* Team Performance */}
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>Team Performance</h4>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Active</span>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                                <th style={{ padding: '8px 0' }}>Staff Name</th>
                                <th style={{ padding: '8px 0' }}>Role</th>
                                <th style={{ padding: '8px 0', textAlign: 'right' }}>Orders Handled</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teamPerformance.map((staff, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '10px 0', fontWeight: '600', color: '#1e293b' }}>{staff.name}</td>
                                    <td style={{ padding: '10px 0', color: '#64748b' }}>{staff.role}</td>
                                    <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: '700', color: '#90273c' }}>{staff.orders}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Top District Sales */}
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>Top District Sales</h4>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Overview</span>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                                <th style={{ padding: '8px 0' }}>District Name</th>
                                <th style={{ padding: '8px 0' }}>Orders</th>
                                <th style={{ padding: '8px 0', textAlign: 'right' }}>Sales (৳)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topDistricts.map((d, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '10px 0', fontWeight: '600', color: '#1e293b' }}>{d.district}</td>
                                    <td style={{ padding: '10px 0', color: '#64748b' }}>{d.orders}</td>
                                    <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: '700', color: '#10b981' }}>৳ {d.sales.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}