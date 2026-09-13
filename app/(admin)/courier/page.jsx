'use client';

import { useState } from 'react';
import styles from '../dashboard.module.css';
import { FiTruck, FiSearch, FiMapPin, FiExternalLink, FiPackage, FiCheckCircle } from 'react-icons/fi';

export default function CourierPage() {
    const [activeTab, setActiveTab] = useState('Active Shipments');
    const [searchTerm, setSearchTerm] = useState('');
    const [providerFilter, setProviderFilter] = useState('All');

    const [selectedShipment, setSelectedShipment] = useState({
        trackingId: 'STEAD-908123',
        order: '#4227',
        customer: 'Rahim Ahmed',
        provider: 'Steadfast',
        phone: '01712-XXXXXX',
        address: 'Dhanmondi 27, Dhaka',
        status: 'In Transit'
    });

    const tabs = ['Active Shipments', 'Pending Pickup', 'Delivered', 'Issues'];
    const providers = ['All', 'Steadfast', 'Pathao', 'RedX', 'Paperfly'];

    const shipments = [
        { trackingId: 'STEAD-908123', order: '#4227', customer: 'Rahim Ahmed', provider: 'Steadfast', status: 'In Transit' },
        { trackingId: 'PATH-882190', order: '#4228', customer: 'Sumaiya Akter', provider: 'Pathao', status: 'Pending Pickup' },
        { trackingId: 'REDX-773210', order: '#4229', customer: 'Tanvir Hasan', provider: 'RedX', status: 'In Transit' },
        { trackingId: 'STEAD-908124', order: '#4230', customer: 'Sadia Islam', provider: 'Steadfast', status: 'Delivered' },
        { trackingId: 'PATH-882191', order: '#4231', customer: 'Karim Ullah', provider: 'Pathao', status: 'Returned' },
    ];

    const filteredShipments = shipments.filter(item => {
        const matchTab = 
            activeTab === 'Active Shipments' ? (item.status === 'In Transit' || item.status === 'Pending Pickup') :
            activeTab === 'Pending Pickup' ? item.status === 'Pending Pickup' :
            activeTab === 'Delivered' ? item.status === 'Delivered' :
            activeTab === 'Issues' ? item.status === 'Returned' : true;
        
        const matchProvider = providerFilter === 'All' || item.provider === providerFilter;
        const matchSearch = item.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) || item.order.includes(searchTerm);

        return matchTab && matchProvider && matchSearch;
    });

    return (
        <div style={{ padding: '0 4px' }}>
            {/* ১. প্রিমিয়াম হেডার */}
            <div className={styles.courierHeaderBar}>
                <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a202c', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FiTruck style={{ color: '#90273c' }} /> Courier & Logistics
                    </h2>
                    <p style={{ fontSize: '13px', color: '#718096', margin: '4px 0 0 0' }}>Manage shipments, track parcels live, and monitor delivery success rates.</p>
                </div>
                <button style={{ background: '#f8fafc', color: '#2d3748', border: '1px solid #cbd5e0', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <FiMapPin /> Track Order
                </button>
            </div>

            {/* ২. ট্যাব ও ফিল্টার কন্ট্রোল */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {tabs.map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{ 
                                background: activeTab === tab ? '#90273c' : '#fff', 
                                color: activeTab === tab ? '#fff' : '#4a5568',
                                border: activeTab === tab ? '1px solid #90273c' : '1px solid #e2e8f0',
                                padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 14px' }}>
                        <FiSearch style={{ color: '#718096', marginRight: '8px' }} />
                        <input 
                            type="text" 
                            placeholder="Search tracking ID..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ 
                                border: 'none', 
                                outline: 'none', 
                                fontSize: '13px', 
                                width: '180px', 
                                color: '#1a202c', /* টেক্সট কালার কালো করা হয়েছে */
                                backgroundColor: 'transparent'
                            }}
                        />
                    </div>
                    <select 
                        value={providerFilter} 
                        onChange={(e) => setProviderFilter(e.target.value)}
                        style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#2d3748', outline: 'none', cursor: 'pointer' }}
                    >
                        {providers.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
            </div>

            {/* ৩. মূল গ্রিড লেআউট */}
            <div className={styles.courierMainLayout}>
                {/* বাম পাশ: শিপমেন্ট লিস্ট */}
                <div className={styles.courierCardBox}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a202c', marginBottom: '16px' }}>
                        📦 Shipment Directory ({filteredShipments.length})
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {filteredShipments.map((shipment, index) => (
                            <div 
                                key={index} 
                                onClick={() => setSelectedShipment({...selectedShipment, ...shipment})}
                                style={{ 
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                                    padding: '14px 16px', background: selectedShipment.trackingId === shipment.trackingId ? '#fffaf0' : '#f8fafc', 
                                    border: selectedShipment.trackingId === shipment.trackingId ? '1px solid #feebc8' : '1px solid #e2e8f0', 
                                    borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a202c' }}>{shipment.trackingId}</div>
                                    <div style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>{shipment.provider} • Order: {shipment.order}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ 
                                        background: shipment.status === 'In Transit' ? '#ebf8ff' : shipment.status === 'Pending Pickup' ? '#fffaf0' : shipment.status === 'Delivered' ? '#f0fff4' : '#fff5f5', 
                                        color: shipment.status === 'In Transit' ? '#2b6cb0' : shipment.status === 'Pending Pickup' ? '#c05621' : shipment.status === 'Delivered' ? '#22543d' : '#e53e3e',
                                        padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', display: 'inline-block'
                                    }}>
                                        {shipment.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {filteredShipments.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '30px', color: '#718096', fontSize: '13px', fontWeight: '600' }}>
                                No shipments found.
                            </div>
                        )}
                    </div>
                </div>

                {/* ডান পাশ: লাইভ ট্র্যাকিং ও ডিটেইলস */}
                <div className={styles.courierCardBox} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #edf2f7', paddingBottom: '12px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c' }}>Live Tracking Details</h3>
                        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#3182ce', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}>
                            View at {selectedShipment.provider} <FiExternalLink />
                        </a>
                    </div>

                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div>
                                <div style={{ fontSize: '11px', color: '#718096', fontWeight: '600', textTransform: 'uppercase' }}>Tracking ID</div>
                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a202c' }}>{selectedShipment.trackingId}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', color: '#718096', fontWeight: '600', textTransform: 'uppercase' }}>Courier Partner</div>
                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#90273c' }}>{selectedShipment.provider}</div>
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <div style={{ fontSize: '11px', color: '#718096', fontWeight: '600', textTransform: 'uppercase' }}>Customer</div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: '#4a5568' }}>{selectedShipment.customer}</div>
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <div style={{ fontSize: '11px', color: '#718096', fontWeight: '600', textTransform: 'uppercase' }}>Destination</div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: '#4a5568' }}>{selectedShipment.address}</div>
                            </div>
                        </div>
                    </div>

                    {/* ট্র্যাকিং টাইমলাইন */}
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1a202c', marginBottom: '10px' }}>Tracking History</h4>
                    <div className={styles.timelineContainer}>
                        <div className={styles.timelineItem}>
                            <div className={styles.timelineDot} style={{ background: '#22543d', boxShadow: '0 0 0 2px #22543d' }}></div>
                            <div className={styles.timelineContent}>
                                <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a202c' }}>Parcel in Transit to Destination Hub</div>
                                <div style={{ fontSize: '11px', color: '#718096' }}>Today, 10:30 AM</div>
                            </div>
                        </div>
                        <div className={styles.timelineItem}>
                            <div className={styles.timelineDot} style={{ background: '#718096', boxShadow: '0 0 0 2px #718096' }}></div>
                            <div className={styles.timelineContent}>
                                <div style={{ fontSize: '13px', fontWeight: '700', color: '#4a5568' }}>Picked up by Courier</div>
                                <div style={{ fontSize: '11px', color: '#718096' }}>Yesterday, 04:15 PM</div>
                            </div>
                        </div>
                        <div className={styles.timelineItem}>
                            <div className={styles.timelineDot} style={{ background: '#718096', boxShadow: '0 0 0 2px #718096' }}></div>
                            <div className={styles.timelineContent}>
                                <div style={{ fontSize: '13px', fontWeight: '700', color: '#4a5568' }}>Parcel Label Printed & Ready</div>
                                <div style={{ fontSize: '11px', color: '#718096' }}>Yesterday, 02:00 PM</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}