'use client';

import { useState } from 'react';
import styles from '../dashboard.module.css';
import { FiRefreshCw, FiBox, FiCheckCircle, FiShield, FiPackage } from 'react-icons/fi';

export default function ReturnsPage() {
    const [activeTab, setActiveTab] = useState('Pending'); 
    const [selectedItem, setSelectedItem] = useState({
        id: '#RET-901',
        order: '#4227',
        customer: 'Rahim Ahmed',
        item: 'Jamdani Saree (Red)',
        reason: 'Size mismatch / Customer returned',
        status: 'Pending Restock'
    });

    const pendingReturns = [
        { id: '#RET-901', order: '#4227', customer: 'Rahim Ahmed', item: 'Jamdani Saree', parcel: '1 Parcel', saree: '1 Saree', price: '৳4,500' },
        { id: '#RET-902', order: '#4228', customer: 'Sumaiya Akter', item: 'Katan Silk', parcel: '1 Parcel', saree: '2 Sarees', price: '৳9,200' },
        { id: '#RET-903', order: '#4229', customer: 'Tanvir Hasan', item: 'Cotton Saree', parcel: '2 Parcels', saree: '2 Sarees', price: '৳3,800' },
    ];

    const historyReturns = [
        { id: '#RET-801', order: '#4210', customer: 'Karim Ullah', item: 'Georgette Saree', parcel: '1 Parcel', saree: '1 Saree', price: '৳3,200', status: 'Restocked' },
        { id: '#RET-802', order: '#4212', customer: 'Nusrat Jahan', item: 'Silk Saree', parcel: '1 Parcel', saree: '1 Saree', price: '৳5,000', status: 'Restocked' },
    ];

    return (
        <div style={{ padding: '0 4px' }}>
            {/* প্রিমিয়াম হেডার সেকশন */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: '#fff', padding: '20px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a202c', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FiPackage style={{ color: '#90273c' }} /> Returns & Restock Management
                    </h2>
                    <p style={{ fontSize: '13px', color: '#718096', margin: '4px 0 0 0' }}>Handle customer returns, inspect product quality, and seamlessly restock items.</p>
                </div>
                <button style={{ background: '#f8fafc', border: '1px solid #cbd5e0', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#2d3748', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
                    <FiRefreshCw /> Sync Returns
                </button>
            </div>

            {/* ট্যাব মেনু (Pending & History) */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <button 
                    onClick={() => setActiveTab('Pending')}
                    style={{ 
                        background: activeTab === 'Pending' ? '#90273c' : '#fff', 
                        color: activeTab === 'Pending' ? '#fff' : '#4a5568',
                        border: activeTab === 'Pending' ? '1px solid #90273c' : '1px solid #e2e8f0',
                        padding: '10px 22px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                >
                    Pending Returns ({pendingReturns.length})
                </button>
                <button 
                    onClick={() => setActiveTab('History')}
                    style={{ 
                        background: activeTab === 'History' ? '#90273c' : '#fff', 
                        color: activeTab === 'History' ? '#fff' : '#4a5568',
                        border: activeTab === 'History' ? '1px solid #90273c' : '1px solid #e2e8f0',
                        padding: '10px 22px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                >
                    Returns History
                </button>
            </div>

            {/* মূল দুই কলাম বিশিষ্ট গ্রিড লেআউট */}
            <div className={styles.returnsMainLayout}>
                {/* বাম পাশের বক্স: স্ট্যাট কার্ড ও লিস্ট */}
                <div className={styles.returnsCardBox}>
                    {/* স্ট্যাট কার্ড (Total parcel & Total saree) */}
                    <div className={styles.returnsStatsGrid}>
                        <div className={styles.returnsStatCard} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                            <div style={{ fontSize: '11px', color: '#718096', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Parcels</div>
                            <div style={{ fontSize: '24px', fontWeight: '800', color: '#90273c', marginTop: '6px' }}>
                                {activeTab === 'Pending' ? '3' : '18'}
                            </div>
                        </div>
                        <div className={styles.returnsStatCard} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                            <div style={{ fontSize: '11px', color: '#718096', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Sarees</div>
                            <div style={{ fontSize: '24px', fontWeight: '800', color: '#90273c', marginTop: '6px' }}>
                                {activeTab === 'Pending' ? '5' : '22'}
                            </div>
                        </div>
                    </div>

                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a202c', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {activeTab === 'Pending' ? '📥 Actionable Return Queue' : '📜 Completed Restock Logs'}
                    </h3>

                    {/* লিস্ট আইটেম কার্ড */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {(activeTab === 'Pending' ? pendingReturns : historyReturns).map((item, index) => (
                            <div 
                                key={index} 
                                onClick={() => setSelectedItem(item)}
                                style={{ 
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                                    padding: '14px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', 
                                    borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.01)'
                                }}
                            >
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a202c' }}>{item.id} — {item.customer}</div>
                                    <div style={{ fontSize: '12px', color: '#718096', marginTop: '3px' }}>Order: {item.order} • {item.parcel} • {item.saree}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ 
                                        background: activeTab === 'Pending' ? '#fffaf0' : '#f0fff4', 
                                        color: activeTab === 'Pending' ? '#c05621' : '#22543d',
                                        border: activeTab === 'Pending' ? '1px solid #feebc8' : '1px solid #c6f6d5',
                                        padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', display: 'inline-block'
                                    }}>
                                        {activeTab === 'Pending' ? 'Pending' : 'Restocked'}
                                    </span>
                                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#4a5568', marginTop: '4px' }}>{item.price}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ডান পাশের বক্স: সিলেক্টেড রিটার্ন ভেরিফিকেশন ও রেস্টক বাটন */}
                <div className={styles.returnsCardBox} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #edf2f7', paddingBottom: '12px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c' }}>Return Verification & Quality Check</h3>
                            <span style={{ background: '#fff5f5', color: '#e53e3e', border: '1px solid #fed7d7', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>
                                Inspection Required
                            </span>
                        </div>

                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                            <div style={{ fontSize: '13px', color: '#4a5568', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                <span><strong>Return ID:</strong></span>
                                <span style={{ color: '#1a202c', fontWeight: '600' }}>{selectedItem.id}</span>
                            </div>
                            <div style={{ fontSize: '13px', color: '#4a5568', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                <span><strong>Customer Name:</strong></span>
                                <span style={{ color: '#1a202c', fontWeight: '600' }}>{selectedItem.customer}</span>
                            </div>
                            <div style={{ fontSize: '13px', color: '#4a5568', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                <span><strong>Original Order:</strong></span>
                                <span style={{ color: '#1a202c', fontWeight: '600' }}>{selectedItem.order}</span>
                            </div>
                            <div style={{ fontSize: '13px', color: '#4a5568', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                <span><strong>Product Item:</strong></span>
                                <span style={{ color: '#90273c', fontWeight: '700' }}>{selectedItem.item}</span>
                            </div>
                            <div style={{ fontSize: '13px', color: '#4a5568', display: 'flex', justifyContent: 'space-between' }}>
                                <span><strong>Return Reason:</strong></span>
                                <span style={{ color: '#c53030', fontWeight: '600' }}>Size mismatch</span>
                            </div>
                        </div>

                        {/* চেকবক্স ভেরিফিকেশন বক্স */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '20px', padding: '14px', background: '#fffaf0', border: '1px solid #feebc8', borderRadius: '10px' }}>
                            <input type="checkbox" style={{ width: '18px', height: '18px', cursor: 'pointer', marginTop: '2px' }} />
                            <div>
                                <span style={{ fontSize: '13px', color: '#744210', fontWeight: '700', display: 'block' }}>Quality Check Approved</span>
                                <span style={{ fontSize: '12px', color: '#975a16' }}>I confirm the product is unwashed, undamaged, and ready to be added back to inventory stock.</span>
                            </div>
                        </div>
                    </div>

                    {/* রেস্টক বাটন */}
                    <button style={{ width: '100%', background: '#90273c', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(144, 39, 60, 0.2)', transition: 'background 0.2s' }}>
                        <FiCheckCircle style={{ fontSize: '16px' }} /> Confirm & Restock Item
                    </button>
                </div>
            </div>
        </div>
    );
}