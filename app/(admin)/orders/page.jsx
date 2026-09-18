'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiGrid, FiList, FiMoreVertical, FiX, FiEye } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';

export default function OrdersPage() {
    const [activeTab, setActiveTab] = useState('All orders');
    const [timeFilter, setTimeFilter] = useState('All Time');
    const [searchTerm, setSearchTerm] = useState('');
    const [ordersList, setOrdersList] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // View Mode State
    const [viewMode, setViewMode] = useState('grid');
    
    // Modal State
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const orderTabs = ['All orders', 'New orders', 'Review', 'Packed', 'Pending', 'Delivery', 'Cancel', 'Trash'];
    const timeFilters = ['Today', 'Yesterday', 'Last 7', 'Last 30', 'All Time'];

    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        if (s === 'pending') return { bg: '#ffedd5', text: '#ea580c' };
        if (s === 'packed') return { bg: '#dcfce7', text: '#16a34a' };
        if (s === 'new') return { bg: '#e0f2fe', text: '#0284c7' };
        if (s === 'review') return { bg: '#f3e8ff', text: '#9333ea' };
        if (s === 'delivery') return { bg: '#dcfce7', text: '#16a34a' };
        if (s === 'cancel') return { bg: '#fee2e2', text: '#dc2626' };
        return { bg: '#f1f5f9', text: '#475569' };
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "orders"));
                const orders = querySnapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() }));
                
                if (orders.length === 0) {
                    const dummyOrders = [
                        { firebaseId: '1', orderId: '#4227', customerName: 'Rahim Ahmed', itemsText: '2 Items (Jamdani)', totalAmount: '৳ 3,500', status: 'Pending', phone: '01711000000', address: 'Mirpur, Dhaka', date: '2026-09-18' },
                        { firebaseId: '2', orderId: '#4228', customerName: 'Sumaiya Akter', itemsText: '1 Item (Silk)', totalAmount: '৳ 7,200', status: 'Packed', phone: '01811000000', address: 'Dhanmondi, Dhaka', date: '2026-09-18' },
                        { firebaseId: '3', orderId: '#4229', customerName: 'Tanvir Hasan', itemsText: '3 Items (Cotton)', totalAmount: '৳ 1,800', status: 'New', phone: '01911000000', address: 'Uttara, Dhaka', date: '2026-09-17' },
                        { firebaseId: '4', orderId: '#4230', customerName: 'Sadia Islam', itemsText: '1 Item (Georgette)', totalAmount: '৳ 2,500', status: 'Review', phone: '01611000000', address: 'Gulshan, Dhaka', date: '2026-09-14' },
                        { firebaseId: '5', orderId: '#4231', customerName: 'Kazi Arif', itemsText: '2 Items (Panjabi)', totalAmount: '৳ 4,100', status: 'Delivery', phone: '01511000000', address: 'Banani, Dhaka', date: '2026-08-25' },
                        { firebaseId: '6', orderId: '#4232', customerName: 'Nusrat Jahan', itemsText: '1 Item (Jamdani)', totalAmount: '৳ 12,000', status: 'Pending', phone: '01722000000', address: 'Badda, Dhaka', date: '2026-08-10' },
                    ];
                    setOrdersList(dummyOrders);
                } else {
                    setOrdersList(orders);
                }
            } catch (error) {
                toast.error("Failed to load orders!");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (firebaseId, newStatus) => {
        setUpdatingStatus(true);
        try {
            // order er information ber kora jate log e orderId dekhano jay
            const orderToUpdate = ordersList.find(o => o.firebaseId === firebaseId);
            const orderIdText = orderToUpdate ? orderToUpdate.orderId : 'An order';

            if (firebaseId.length > 5) { 
                // 1. Order status update kora Firebase e
                const orderRef = doc(db, "orders", firebaseId);
                await updateDoc(orderRef, { status: newStatus });

                // 2. 🔴 Dashboard er jonno Live Activity Log toiri kora 
                await addDoc(collection(db, "activity_logs"), {
                    action: `Order ${orderIdText} status updated to ${newStatus}`,
                    timestamp: new Date().toISOString()
                });
            } else {
                // Jodi dummy data hoy taholeo live log create hobe testing er jonno
                await addDoc(collection(db, "activity_logs"), {
                    action: `Order ${orderIdText} status updated to ${newStatus}`,
                    timestamp: new Date().toISOString()
                });
            }
            
            setOrdersList(ordersList.map(o => o.firebaseId === firebaseId ? { ...o, status: newStatus } : o));
            setSelectedOrder({ ...selectedOrder, status: newStatus });
            toast.success(`Order status updated to ${newStatus}!`);
        } catch (error) {
            toast.error('Failed to update status.');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const isWithinTimeFilter = (orderDateStr, filter) => {
        if (filter === 'All Time') return true;
        
        const today = new Date('2026-09-18');
        today.setHours(0, 0, 0, 0);
        
        const orderDate = new Date(orderDateStr);
        orderDate.setHours(0, 0, 0, 0);

        const diffTime = today - orderDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (filter === 'Today') return diffDays === 0;
        if (filter === 'Yesterday') return diffDays === 1;
        if (filter === 'Last 7') return diffDays >= 0 && diffDays <= 7;
        if (filter === 'Last 30') return diffDays >= 0 && diffDays <= 30;
        return true;
    };

    const filteredOrders = ordersList.filter(order => {
        let matchesTab = true;
        if (activeTab !== 'All orders') {
            const tabKey = activeTab.split(' ')[0].toLowerCase();
            matchesTab = order.status?.toLowerCase() === tabKey;
        }
        
        const matchesTime = isWithinTimeFilter(order.date, timeFilter);
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = order.orderId?.toLowerCase().includes(searchLower) || order.customerName?.toLowerCase().includes(searchLower);
        
        return matchesTab && matchesTime && matchesSearch;
    });

    return (
        <div style={{ padding: '0 20px 20px', background: '#f8fafc', minHeight: '100vh' }}>
            <Toaster position="top-right" />

            <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px', overflowX: 'auto' }}>
                {orderTabs.map((tab) => (
                    <button 
                        key={tab} onClick={() => setActiveTab(tab)}
                        style={{ 
                            background: 'transparent', border: 'none', padding: '12px 0', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                            color: activeTab === tab ? '#90273c' : '#64748b', borderBottom: activeTab === tab ? '2px solid #90273c' : '2px solid transparent',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 14px', width: '300px' }}>
                    <FiSearch style={{ color: '#94a3b8', marginRight: '10px' }} />
                    <input type="text" placeholder="Search order id, customer..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px', color: '#333' }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                        {timeFilters.map((tf) => (
                            <button key={tf} onClick={() => setTimeFilter(tf)}
                                style={{
                                    background: timeFilter === tf ? '#90273c' : 'transparent', color: timeFilter === tf ? '#fff' : '#475569',
                                    border: 'none', padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', borderRight: '1px solid #e2e8f0'
                                }}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                        <button onClick={() => setViewMode('grid')} style={{ background: viewMode === 'grid' ? '#90273c' : 'transparent', color: viewMode === 'grid' ? '#fff' : '#475569', border: 'none', padding: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <FiGrid size={16} />
                        </button>
                        <button onClick={() => setViewMode('list')} style={{ background: viewMode === 'list' ? '#90273c' : 'transparent', color: viewMode === 'list' ? '#fff' : '#475569', border: 'none', padding: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <FiList size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading orders...</div>
            ) : viewMode === 'grid' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {filteredOrders.length > 0 ? filteredOrders.map((order) => {
                        const sStyle = getStatusStyle(order.status);
                        return (
                            <div key={order.firebaseId} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', cursor: 'pointer', transition: '0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }} onClick={() => setSelectedOrder(order)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <span style={{ fontSize: '15px', fontWeight: '700', color: '#ef4444' }}>{order.orderId}</span>
                                    <span style={{ background: sStyle.bg, color: sStyle.text, padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: '700' }}>{order.status}</span>
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#1e293b' }}>{order.customerName}</h4>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>{order.itemsText} • <span style={{ fontSize: '11px', color: '#64748b' }}>{order.date}</span></p>
                                </div>
                                <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{order.totalAmount}</span>
                                    <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}><FiMoreVertical size={18} /></button>
                                </div>
                            </div>
                        );
                    }) : <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#64748b' }}>No orders found for this time filter.</div>}
                </div>
            ) : (
                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '700', color: '#64748b' }}>ORDER ID</th>
                                <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '700', color: '#64748b' }}>CUSTOMER</th>
                                <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '700', color: '#64748b' }}>DATE</th>
                                <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '700', color: '#64748b' }}>TOTAL</th>
                                <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '700', color: '#64748b' }}>STATUS</th>
                                <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '700', color: '#64748b', textAlign: 'right' }}>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? filteredOrders.map((order) => {
                                const sStyle = getStatusStyle(order.status);
                                return (
                                    <tr key={order.firebaseId} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} onClick={() => setSelectedOrder(order)}>
                                        <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '700', color: '#ef4444' }}>{order.orderId}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{order.customerName}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>{order.date}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{order.totalAmount}</td>
                                        <td style={{ padding: '14px 16px' }}><span style={{ background: sStyle.bg, color: sStyle.text, padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '700' }}>{order.status}</span></td>
                                        <td style={{ padding: '14px 16px', textAlign: 'right' }}><button style={{ background: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', color: '#475569', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}><FiEye /> View</button></td>
                                    </tr>
                                );
                            }) : <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No orders found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedOrder && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(2px)' }}>
                    <div style={{ background: '#fff', width: '500px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>Order <span style={{ color: '#ef4444' }}>{selectedOrder.orderId}</span></h3>
                            <button onClick={() => setSelectedOrder(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><FiX size={20} /></button>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                                <h4 style={{ margin: '0 0 8px', color: '#1e293b' }}>{selectedOrder.customerName}</h4>
                                <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#475569' }}>📞 {selectedOrder.phone}</p>
                                <p style={{ margin: 0, fontSize: '13px', color: '#475569' }}>📍 {selectedOrder.address}</p>
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>UPDATE STATUS</p>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {['New', 'Pending', 'Review', 'Packed', 'Delivery', 'Cancel'].map(status => {
                                        const btnStyle = getStatusStyle(status);
                                        const isCurrent = selectedOrder.status === status;
                                        return (
                                            <button 
                                                key={status} onClick={() => handleUpdateStatus(selectedOrder.firebaseId, status)} disabled={updatingStatus || isCurrent}
                                                style={{ 
                                                    padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: isCurrent ? 'default' : 'pointer',
                                                    background: isCurrent ? btnStyle.bg : '#fff', color: isCurrent ? btnStyle.text : '#475569',
                                                    border: `1px solid ${isCurrent ? btnStyle.text : '#cbd5e0'}`, opacity: updatingStatus ? 0.7 : 1
                                                }}
                                            >
                                                {status}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}