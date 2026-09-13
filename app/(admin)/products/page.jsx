'use client';

import { useState } from 'react';
import styles from '../dashboard.module.css';
import { FiSearch, FiBox, FiPlus, FiFilter } from 'react-icons/fi';

export default function ProductsPage() {
    const [activeTab, setActiveTab] = useState('All products');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    // স্কেচ অনুযায়ী 'Out stock' ট্যাব যুক্ত করা হলো
    const productTabs = ['All products', 'In stock', 'Low stock', 'Out stock', 'Archived'];
    const categories = ['All', 'Cotton', 'Jamdani', 'Katan', 'Silk', 'Georgette'];

    // ডেমো প্রোডাক্ট লিস্ট (যেখানে Out stock স্ট্যাটাস রয়েছে)
    const productsList = [
        { id: '#PRD-101', name: 'Royal Red Jamdani Saree', category: 'Jamdani', stock: 14, price: '৳4,500', status: 'In stock' },
        { id: '#PRD-102', name: 'Traditional Blue Katan Silk', category: 'Katan', stock: 3, price: '৳8,200', status: 'Low stock' },
        { id: '#PRD-103', name: 'Soft White Cotton Saree', category: 'Cotton', stock: 25, price: '৳2,800', status: 'In stock' },
        { id: '#PRD-104', name: 'Party Wear Black Georgette', category: 'Georgette', stock: 0, price: '৳3,500', status: 'Out stock' },
        { id: '#PRD-105', name: 'Golden Banarasi Katan', category: 'Katan', stock: 8, price: '৳9,500', status: 'In stock' },
        { id: '#PRD-106', name: 'Handloom Yellow Cotton', category: 'Cotton', stock: 0, price: '৳2,400', status: 'Out stock' },
        { id: '#PRD-107', name: 'Classic Silk Saree', category: 'Silk', stock: 0, price: '৳6,000', status: 'Archived' },
    ];

    // ট্যাব ও ক্যাটাগরি অনুযায়ী ফিল্টার করা
    const filteredProducts = productsList.filter(item => {
        const matchesTab = 
            activeTab === 'All products' ? true :
            activeTab === 'In stock' ? item.status === 'In stock' :
            activeTab === 'Low stock' ? item.status === 'Low stock' :
            activeTab === 'Out stock' ? item.status === 'Out stock' :
            activeTab === 'Archived' ? item.status === 'Archived' : true;

        const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesTab && matchesCat && matchesSearch;
    });

    return (
        <div style={{ padding: '0 4px' }}>
            {/* ১. ওপরের প্রিমিয়াম হেডার বার */}
            <div className={styles.productHeaderBar}>
                <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a202c', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FiBox style={{ color: '#90273c' }} /> Product Inventory Management
                    </h2>
                    <p style={{ fontSize: '13px', color: '#718096', margin: '4px 0 0 0' }}>Monitor stock levels, organize product categories, and manage catalogue.</p>
                </div>
                <button style={{ background: '#90273c', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(144, 39, 60, 0.2)' }}>
                    <FiPlus style={{ fontSize: '16px' }} /> Add New Product
                </button>
            </div>

            {/* ২. ট্যাব মেনু (All products | In stock | Low stock | Out stock | Archived) */}
            <div className={styles.productTabs}>
                {productTabs.map((tab) => (
                    <button 
                        key={tab}
                        className={`${styles.productTabBtn} ${activeTab === tab ? styles.activeProductTab : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* ৩. সার্চ ও ক্যাটাগরি ফিল্টার কন্ট্রোল বার */}
            <div className={styles.productControlBar}>
                {/* সার্চ বক্স */}
                <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #cbd5e0', borderRadius: '8px', padding: '8px 14px', flexGrow: 1, maxWidth: '350px' }}>
                    <FiSearch style={{ color: '#718096', marginRight: '10px', fontSize: '16px' }} />
                    <input 
                        type="text" 
                        placeholder="Search product name or ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px' }}
                    />
                </div>

                {/* ক্যাটাগরি ড্রপডাউন / ফিল্টার বাটন */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#4a5568' }}>
                        <FiFilter style={{ color: '#718096' }} /> Category:
                    </div>
                    <select 
                        value={categoryFilter} 
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        style={{ background: '#f8fafc', border: '1px solid #cbd5e0', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#2d3748', outline: 'none', cursor: 'pointer' }}
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ৪. প্রোডাক্ট গ্রিড কার্ড লেআউট */}
            <div className={styles.productGridContainer}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                        <div key={index} className={styles.productCard}>
                            {/* প্রোডাক্ট ইমেজ প্লেসহোল্ডার */}
                            <div className={styles.productImgPlaceholder}>
                                <span>📦 Saree Image</span>
                            </div>

                            {/* প্রোডাক্ট ডিটেইলস বডি */}
                            <div className={styles.productCardBody}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#90273c', background: '#fdf2f4', padding: '2px 8px', borderRadius: '4px' }}>
                                        {product.category}
                                    </span>
                                    <span style={{ 
                                        fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px',
                                        background: product.status === 'In stock' ? '#c6f6d5' : product.status === 'Low stock' ? '#feebc8' : product.status === 'Out stock' ? '#fed7d7' : '#edf2f7',
                                        color: product.status === 'In stock' ? '#22543d' : product.status === 'Low stock' ? '#c05621' : product.status === 'Out stock' ? '#9b2c2c' : '#4a5568'
                                    }}>
                                        {product.status}
                                    </span>
                                </div>

                                <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1a202c', margin: '6px 0 8px 0' }}>{product.name}</h4>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px solid #edf2f7', paddingTop: '10px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#718096' }}>Stock: <strong>{product.stock} pcs</strong></span>
                                    <span style={{ fontSize: '15px', fontWeight: '800', color: '#90273c' }}>{product.price}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#718096', fontWeight: '600' }}>
                        No products found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
}