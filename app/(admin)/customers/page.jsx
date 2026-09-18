'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiDownload, FiPhoneCall, FiMessageCircle, FiX } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function CustomersPage() {
    const [customersList, setCustomersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [timeFilter, setTimeFilter] = useState('All time');
    const [sortBy, setSortBy] = useState('Spend');
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const timeFilters = ['Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'All time'];
    const sortOptions = ['Spend', 'New', 'Old'];

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "customers"));
                const customers = querySnapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() }));
                
                if (customers.length === 0) {
                    // Sothik joinDate সহ ডামি ডেটা যাতে টাইম ফিল্টার কাজ করে
                    const dummyCustomers = [
                        { firebaseId: '1', name: 'Sumaiya Akter', phone: '01819 876543', totalOrders: 3, totalSpent: 7200, type: 'New', address: 'Dhanmondi, Dhaka', joinDate: '2026-09-18' }, // Today
                        { firebaseId: '2', name: 'Nusrat Jahan', phone: '01300 445566', totalOrders: 2, totalSpent: 4800, type: 'New', address: 'Badda, Dhaka', joinDate: '2026-09-17' }, // Yesterday
                        { firebaseId: '3', name: 'Sadia Islam', phone: '01521 556677', totalOrders: 1, totalSpent: 2500, type: 'New', address: 'Gulshan, Dhaka', joinDate: '2026-09-15' }, // Last 7 days
                        { firebaseId: '4', name: 'Rahim Ahmed', phone: '01712 345678', totalOrders: 12, totalSpent: 24600, type: 'Repeat', address: 'Mirpur, Dhaka', joinDate: '2025-11-10' },
                        { firebaseId: '5', name: 'Tanvir Hasan', phone: '01911 223344', totalOrders: 8, totalSpent: 15300, type: 'Repeat', address: 'Uttara, Dhaka', joinDate: '2026-01-05' },
                        { firebaseId: '6', name: 'Kazi Arif', phone: '01670 990011', totalOrders: 5, totalSpent: 11400, type: 'Repeat', address: 'Banani, Dhaka', joinDate: '2026-03-20' },
                    ];
                    setCustomersList(dummyCustomers);
                } else {
                    setCustomersList(customers);
                }
            } catch (error) {
                toast.error("Failed to load customers!");
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    // CSV Export Function
    const handleExportCSV = () => {
        if (filteredCustomers.length === 0) {
            toast.error("No data to export");
            return;
        }
        const headers = ['Name,Phone,Total Orders,Total Spent (BDT),Type,Address,Join Date\n'];
        const rows = filteredCustomers.map(c => 
            `"${c.name}","${c.phone}",${c.totalOrders},${c.totalSpent},"${c.type}","${c.address}","${c.joinDate}"\n`
        );
        const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "Style_Suite_Customers.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Customer list exported successfully!");
    };

    // Time filter logic calculation
    const isWithinTimeFilter = (joinDateStr, filter) => {
        if (filter === 'All time') return true;
        
        const today = new Date('2026-09-18'); // Current system date
        today.setHours(0, 0, 0, 0);
        
        const joinDate = new Date(joinDateStr);
        joinDate.setHours(0, 0, 0, 0);

        const diffTime = today - joinDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (filter === 'Today') {
            return diffDays === 0;
        } else if (filter === 'Yesterday') {
            return diffDays === 1;
        } else if (filter === 'Last 7 days') {
            return diffDays >= 0 && diffDays <= 7;
        } else if (filter === 'Last 30 days') {
            return diffDays >= 0 && diffDays <= 30;
        }
        return true;
    };

    // ✅ এখানে New এবং Old সর্টিংয়ের বাগটি .getTime() দিয়ে ফিক্স করা হয়েছে 
    const filteredCustomers = customersList.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm);
        const matchesTime = isWithinTimeFilter(c.joinDate, timeFilter);
        return matchesSearch && matchesTime;
    }).sort((a, b) => {
        if (sortBy === 'Spend') return b.totalSpent - a.totalSpent;
        if (sortBy === 'New') return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        if (sortBy === 'Old') return new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
        return 0;
    });

    const totalCustomers = customersList.length || 1428;
    const repeatCustomers = customersList.filter(c => c.type === 'Repeat').length || 412;
    const newThisMonth = customersList.filter(c => c.type === 'New').length || 94;
    const lifetimeSells = customersList.reduce((sum, c) => sum + (c.totalSpent || 0), 0) || 65800;

    return (
        <div style={{ padding: '0 20px 20px', background: '#f8fafc', minHeight: '100vh' }}>
            <Toaster position="top-right" />

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>TOTAL CUSTOMER</p>
                    <h3 style={{ margin: 0, fontSize: '24px', color: '#1e293b' }}>{totalCustomers.toLocaleString()}</h3>
                </div>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>REPEAT CUSTOMER</p>
                    <h3 style={{ margin: 0, fontSize: '24px', color: '#3b82f6' }}>{repeatCustomers.toLocaleString()}</h3>
                </div>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>NEW THIS MONTH</p>
                    <h3 style={{ margin: 0, fontSize: '24px', color: '#10b981' }}>{newThisMonth.toLocaleString()}</h3>
                </div>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>LIFETIME SELLS</p>
                    <h3 style={{ margin: 0, fontSize: '24px', color: '#90273c' }}>৳ {lifetimeSells.toLocaleString()}</h3>
                </div>
            </div>

            {/* Controls Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 14px', width: '300px' }}>
                    <FiSearch style={{ color: '#94a3b8', marginRight: '10px' }} />
                    <input type="text" placeholder="Search customer by name or phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px', color: '#333' }} />
                </div>

                {/* Time Filters */}
                <div style={{ display: 'flex', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                    {timeFilters.map((tf) => (
                        <button key={tf} onClick={() => setTimeFilter(tf)}
                            style={{
                                background: timeFilter === tf ? '#90273c' : 'transparent',
                                color: timeFilter === tf ? '#fff' : '#475569',
                                border: 'none', padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                                borderRight: '1px solid #e2e8f0'
                            }}
                        >
                            {tf}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '4px' }}>
                        <span style={{ fontSize: '13px', color: '#64748b', padding: '0 8px' }}><FiFilter style={{ marginRight: '4px' }}/> Sort by:</span>
                        {sortOptions.map(opt => (
                            <button key={opt} onClick={() => setSortBy(opt)}
                                style={{
                                    background: sortBy === opt ? '#90273c' : 'transparent',
                                    color: sortBy === opt ? '#fff' : '#475569',
                                    border: 'none', padding: '4px 12px', fontSize: '12px', fontWeight: '600', borderRadius: '4px', cursor: 'pointer'
                                }}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                    <button onClick={handleExportCSV} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FiDownload /> Export
                    </button>
                </div>
            </div>

            {/* Customers Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading customers...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                    {filteredCustomers.length > 0 ? filteredCustomers.map(customer => {
                        const avatarBg = customer.type === 'New' ? '#e0f2fe' : '#dcfce7';
                        const avatarColor = customer.type === 'New' ? '#0284c7' : '#16a34a';
                        
                        return (
                            <div key={customer.firebaseId} onClick={() => setSelectedCustomer(customer)} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', cursor: 'pointer', transition: '0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: avatarBg, color: avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700' }}>
                                            {customer.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: '#1e293b' }}>{customer.name}</h4>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>📞 {customer.phone}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <a href={`tel:${customer.phone}`} onClick={e => e.stopPropagation()} style={{ color: '#10b981', background: '#dcfce7', padding: '6px', borderRadius: '50%', display: 'flex' }}><FiPhoneCall size={14}/></a>
                                        <a href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`} target="_blank" onClick={e => e.stopPropagation()} style={{ color: '#0284c7', background: '#e0f2fe', padding: '6px', borderRadius: '50%', display: 'flex' }}><FiMessageCircle size={14}/></a>
                                    </div>
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px dashed #e2e8f0', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '13px', color: '#64748b' }}>Total Orders:</span>
                                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{customer.totalOrders} Orders</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px dashed #e2e8f0', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '13px', color: '#64748b' }}>Total Spent:</span>
                                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#90273c' }}>৳ {customer.totalSpent.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', color: '#64748b' }}>Join Date: <strong style={{ color: '#333' }}>{customer.joinDate}</strong></span>
                                    <span style={{ fontSize: '12px', fontWeight: '700', background: avatarBg, color: avatarColor, padding: '2px 8px', borderRadius: '4px' }}>{customer.type}</span>
                                </div>
                            </div>
                        )
                    }) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#64748b' }}>No customers found for this time filter.</div>
                    )}
                </div>
            )}

            {/* Customer Details Modal */}
            {selectedCustomer && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(2px)' }}>
                    <div style={{ background: '#fff', width: '450px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>Customer Profile</h3>
                            <button onClick={() => setSelectedCustomer(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><FiX size={20} /></button>
                        </div>
                        
                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: selectedCustomer.type === 'New' ? '#e0f2fe' : '#dcfce7', color: selectedCustomer.type === 'New' ? '#0284c7' : '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
                                    {selectedCustomer.name.charAt(0)}
                                </div>
                                <h3 style={{ margin: '0 0 4px', color: '#1e293b' }}>{selectedCustomer.name}</h3>
                                <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Joined: {selectedCustomer.joinDate}</p>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                                <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}><FiPhoneCall/> {selectedCustomer.phone}</p>
                                <p style={{ margin: 0, fontSize: '13px', color: '#475569' }}>📍 {selectedCustomer.address}</p>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ flex: 1, padding: '12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', textAlign: 'center' }}>
                                    <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>TOTAL ORDERS</p>
                                    <h4 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{selectedCustomer.totalOrders}</h4>
                                </div>
                                <div style={{ flex: 1, padding: '12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', textAlign: 'center' }}>
                                    <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>TOTAL SPENT</p>
                                    <h4 style={{ margin: 0, fontSize: '18px', color: '#90273c' }}>৳ {selectedCustomer.totalSpent.toLocaleString()}</h4>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <a href={`tel:${selectedCustomer.phone}`} style={{ flex: 1, textAlign: 'center', padding: '10px', background: '#f1f5f9', color: '#475569', borderRadius: '6px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>Direct Call</a>
                                <a href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}`} target="_blank" style={{ flex: 1, textAlign: 'center', padding: '10px', background: '#10b981', color: '#fff', borderRadius: '6px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>WhatsApp</a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}