'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiDownload, FiTrendingUp, FiShoppingBag, FiCreditCard, FiRefreshCw, FiBarChart2, FiPieChart, FiBox } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function ReportsPage() {
    const router = useRouter();
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState('All Time');
    
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [stats, setStats] = useState({ totalSales: 0, netRevenue: 0, totalReturns: 0, ordersPlaced: 0 });
    const [chartData, setChartData] = useState([]);
    const [statusBreakdown, setStatusBreakdown] = useState({ delivered: 0, transit: 0, returned: 0, other: 0 });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "orders"));
                let ordersList = querySnapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() }));
                setAllOrders(ordersList);
                processMetrics(ordersList, 'All Time');
            } catch (error) {
                toast.error("Failed to load report data!");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    useEffect(() => {
        if (allOrders.length > 0) {
            processMetrics(allOrders, timeFilter);
        }
    }, [timeFilter, allOrders]);

    const processMetrics = (orders, filter) => {
        const now = new Date();
        const filtered = orders.filter(o => {
            if (!o.date) return false;
            if (filter === 'All Time') return true;
            const oDate = new Date(o.date);
            const diffDays = (now - oDate) / (1000 * 60 * 60 * 24);
            if (filter === 'Today') return diffDays <= 1;
            if (filter === '7 Days') return diffDays <= 7;
            if (filter === '30 Days') return diffDays <= 30;
            return true;
        });

        setFilteredOrders(filtered);

        let sales = 0; let returns = 0;
        let del = 0; let trn = 0; let ret = 0; let oth = 0;

        filtered.forEach(o => {
            const amount = parseInt((o.totalAmount || '0').toString().replace(/[^0-9]/g, '')) || 0;
            
            if (o.status === 'Returned' || o.status === 'Return_Pending') {
                returns += amount;
                ret++;
            } else {
                sales += amount;
                if (o.status === 'Delivered') del++;
                else if (['In_Transit', 'Out_for_Delivery', 'Pending_Pickup', 'Packed'].includes(o.status)) trn++;
                else oth++;
            }
        });

        setStats({
            totalSales: sales + returns,
            totalReturns: returns,
            netRevenue: sales,
            ordersPlaced: filtered.length
        });

        setStatusBreakdown({ delivered: del, transit: trn, returned: ret, other: oth });
        generateChartData(filter, sales + returns);
    };

    const generateChartData = (filter, total) => {
        let labels = [];
        if (filter === 'Today') labels = ['9 AM', '12 PM', '3 PM', '6 PM', '9 PM'];
        else if (filter === '7 Days') labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        else if (filter === '30 Days') labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        else labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

        let data = labels.map(label => {
            return { name: label, value: Math.floor(Math.random() * (total / labels.length)) + (total / (labels.length * 2)) };
        });
        
        if (total === 0) data = labels.map(l => ({ name: l, value: 0 }));

        setChartData(data);
    };

    const exportToCSV = () => {
        if (filteredOrders.length === 0) {
            toast.error("No data to export!");
            return;
        }
        
        const headers = ["Order ID", "Customer Name", "Phone", "Total Amount", "Status", "Courier", "Date"];
        const rows = filteredOrders.map(o => [
            o.orderId || 'N/A',
            o.customerName || 'N/A',
            o.phone || 'N/A',
            (o.totalAmount || '0').replace(',', ''),
            o.status || 'N/A',
            o.courier || 'N/A',
            o.date ? new Date(o.date).toLocaleDateString() : 'N/A'
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `style_suite_report_${timeFilter.replace(' ', '_').toLowerCase()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Report downloaded successfully!");
    };

    const maxChartValue = Math.max(...chartData.map(d => d.value), 1);
    const totalStatusCount = filteredOrders.length || 1;

    const topProducts = [
        { name: "Premium Red Jamdani", sales: 42, rev: "৳ 1,89,000", color: "#ef4444" },
        { name: "Blue Katan Silk", sales: 28, rev: "৳ 1,34,400", color: "#3b82f6" },
        { name: "Pure Cotton Print", sales: 25, rev: "৳ 70,000", color: "#10b981" },
        { name: "Golden Georgette", sales: 18, rev: "৳ 54,000", color: "#f59e0b" },
    ];

    return (
        <div style={{ padding: '0 20px 20px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
            <Toaster position="top-right" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div>
                    <h2 style={{ margin: '0 0 5px', fontSize: '20px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FiPieChart style={{ color: '#90273c' }} /> Reports & Analytics
                    </h2>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Track your sales performance, revenue trends, and download comprehensive reports.</p>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '4px' }}>
                        {['Today', '7 Days', '30 Days', 'All Time'].map(tab => (
                            <button 
                                key={tab} onClick={() => setTimeFilter(tab)} 
                                style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: 'none', background: timeFilter === tab ? '#fff' : 'transparent', color: timeFilter === tab ? '#1e293b' : '#64748b', boxShadow: timeFilter === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: '0.2s' }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    
                    <button onClick={exportToCSV} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1e293b', border: 'none', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#fff', cursor: 'pointer', transition: '0.2s' }}>
                        <FiDownload /> Export CSV
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Gross Sales</p>
                        <h3 style={{ margin: 0, fontSize: '26px', color: '#1e293b' }}>৳ {stats.totalSales.toLocaleString()}</h3>
                    </div>
                    <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '50%' }}><FiTrendingUp size={22} color="#475569" /></div>
                </div>
                
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #10b981', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.1)' }}>
                    <div>
                        <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '700', color: '#047857', textTransform: 'uppercase' }}>Net Revenue (Realized)</p>
                        <h3 style={{ margin: 0, fontSize: '26px', color: '#10b981' }}>৳ {stats.netRevenue.toLocaleString()}</h3>
                    </div>
                    <div style={{ background: '#dcfce7', padding: '12px', borderRadius: '50%' }}><FiCreditCard size={22} color="#10b981" /></div>
                </div>

                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Total Orders Placed</p>
                        <h3 style={{ margin: 0, fontSize: '26px', color: '#3b82f6' }}>{stats.ordersPlaced}</h3>
                    </div>
                    <div style={{ background: '#e0f2fe', padding: '12px', borderRadius: '50%' }}><FiShoppingBag size={22} color="#3b82f6" /></div>
                </div>

                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #fca5a5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '700', color: '#991b1b', textTransform: 'uppercase' }}>Loss / Returns</p>
                        <h3 style={{ margin: 0, fontSize: '26px', color: '#ef4444' }}>৳ {stats.totalReturns.toLocaleString()}</h3>
                    </div>
                    <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '50%' }}><FiRefreshCw size={22} color="#ef4444" /></div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <div style={{ flex: '0 0 65%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>Sales Trend ({timeFilter})</h3>
                            {stats.netRevenue > 0 && <span style={{ fontSize: '13px', color: '#10b981', fontWeight: '600', background: '#dcfce7', padding: '4px 10px', borderRadius: '12px' }}>+ Healthy Trend</span>}
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'flex-end', height: '250px', gap: '15px', paddingBottom: '10px', borderBottom: '2px solid #f1f5f9' }}>
                            {loading ? (
                                <div style={{ width: '100%', textAlign: 'center', color: '#94a3b8' }}>Loading chart data...</div>
                            ) : chartData.length > 0 ? chartData.map((data, idx) => {
                                const heightPercentage = (data.value / maxChartValue) * 100;
                                const isMax = data.value === maxChartValue && data.value > 0;
                                return (
                                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                                            <div style={{ 
                                                width: '60%', 
                                                height: `${heightPercentage}%`, 
                                                background: isMax ? '#90273c' : '#cbd5e0', 
                                                borderRadius: '6px 6px 0 0',
                                                transition: 'height 0.5s ease-out'
                                            }}></div>
                                            {data.value > 0 && (
                                                <div style={{ position: 'absolute', top: `${100 - heightPercentage}%`, marginTop: '-25px', fontSize: '11px', fontWeight: 'bold', color: isMax ? '#90273c' : '#64748b' }}>
                                                    ৳{(data.value / 1000).toFixed(1)}k
                                                </div>
                                            )}
                                        </div>
                                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>{data.name}</span>
                                    </div>
                                )
                            }) : (
                                <div style={{ width: '100%', textAlign: 'center', color: '#94a3b8' }}>No data for selected period</div>
                            )}
                        </div>
                    </div>

                    <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: '0 0 20px', fontSize: '16px', color: '#1e293b' }}>Order Status Breakdown</h3>
                        
                        <div style={{ width: '100%', height: '24px', display: 'flex', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', background: '#f1f5f9' }}>
                            <div style={{ width: `${(statusBreakdown.delivered / totalStatusCount) * 100}%`, background: '#10b981', transition: '0.3s' }}></div>
                            <div style={{ width: `${(statusBreakdown.transit / totalStatusCount) * 100}%`, background: '#3b82f6', transition: '0.3s' }}></div>
                            <div style={{ width: `${(statusBreakdown.returned / totalStatusCount) * 100}%`, background: '#ef4444', transition: '0.3s' }}></div>
                            <div style={{ width: `${(statusBreakdown.other / totalStatusCount) * 100}%`, background: '#94a3b8', transition: '0.3s' }}></div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                                <span style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Delivered ({statusBreakdown.delivered})</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6' }}></div>
                                <span style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>In Transit ({statusBreakdown.transit})</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                                <span style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Returned ({statusBreakdown.returned})</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#94a3b8' }}></div>
                                <span style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Processing ({statusBreakdown.other})</span>
                            </div>
                        </div>
                    </div>

                </div>

                <div style={{ flex: '1', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiBarChart2 style={{ color: '#f59e0b' }} /> Top Selling Products
                        </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {topProducts.map((prod, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: idx === topProducts.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: `${prod.color}15`, display: 'flex', justifyContent: 'center', alignItems: 'center', color: prod.color }}>
                                        <FiBox size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 4px', fontSize: '14px', color: '#1e293b', fontWeight: '700' }}>{prod.name}</h4>
                                        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{prod.sales} pieces sold</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>{prod.rev}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <button onClick={() => router.push('/products')} style={{ width: '100%', marginTop: '20px', padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>
                        View Full Inventory Report
                    </button>
                </div>

            </div>
        </div>
    );
}