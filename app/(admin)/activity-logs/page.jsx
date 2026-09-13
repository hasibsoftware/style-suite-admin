'use client';

import { useState } from 'react';
import styles from '../dashboard.module.css';
import { 
    FiActivity, 
    FiUser, 
    FiServer, 
    FiSearch, 
    FiClock, 
    FiPlusCircle, 
    FiEdit, 
    FiTruck, 
    FiXCircle 
} from 'react-icons/fi';

export default function ActivityLogsPage() {
    // Sketch অনুযায়ী দুটি ট্যাব: 'Users' এবং 'System'
    const [activeTab, setActiveTab] = useState('Users');
    const [searchTerm, setSearchTerm] = useState('');

    // Sketch-এর ডেটা অনুযায়ী Users Logs
    const userLogs = [
        { id: 1, user: 'Mim', action: 'Created Order', orderId: '#427', time: '10 mins ago', type: 'create', icon: FiPlusCircle, styleClass: styles.iconCreate },
        { id: 2, user: 'Efty', action: 'Edited Order', orderId: '#425', time: '45 mins ago', type: 'edit', icon: FiEdit, styleClass: styles.iconEdit },
        { id: 3, user: 'Tanvir', action: 'Added a new product', orderId: 'Jamdani Silk', time: '2 hours ago', type: 'create', icon: FiPlusCircle, styleClass: styles.iconCreate },
        { id: 4, user: 'Mim', action: 'Updated customer details for Order', orderId: '#410', time: '3 hours ago', type: 'edit', icon: FiEdit, styleClass: styles.iconEdit },
    ];

    // Sketch-এর ডেটা অনুযায়ী System Logs
    const systemLogs = [
        { id: 1, system: 'Automated System', action: 'Order status changed to Delivery for', orderId: '#427', time: '5 mins ago', type: 'delivery', icon: FiTruck, styleClass: styles.iconDelivery },
        { id: 2, system: 'Automated System', action: 'Order was Cancelled due to timeout', orderId: '#425', time: '30 mins ago', type: 'cancel', icon: FiXCircle, styleClass: styles.iconCancel },
        { id: 3, system: 'Payment Gateway', action: 'Payment verified for Order', orderId: '#426', time: '1 hour ago', type: 'delivery', icon: FiServer, styleClass: styles.iconDelivery },
        { id: 4, system: 'System Scheduler', action: 'Daily database backup completed', orderId: '', time: '5 hours ago', type: 'edit', icon: FiServer, styleClass: styles.iconEdit },
    ];

    // বর্তমানে কোন ডেটা দেখাবো তা নির্ধারণ
    const currentData = activeTab === 'Users' ? userLogs : systemLogs;

    // সার্চ ফিল্টারিং
    const filteredLogs = currentData.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
        log.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.user && log.user.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div style={{ padding: '0 4px' }}>
            {/* ১. হেডার সেকশন */}
            <div className={styles.activityHeader}>
                <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a202c', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FiActivity style={{ color: '#90273c' }} /> Activity Logs
                    </h2>
                    <p style={{ fontSize: '13px', color: '#718096', margin: '4px 0 0 0' }}>Track all user actions and system automated processes in real-time.</p>
                </div>
                
                {/* সার্চ বার */}
                <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 14px', width: '250px' }}>
                    <FiSearch style={{ color: '#a0aec0', marginRight: '8px' }} />
                    <input 
                        type="text" 
                        placeholder="Search logs..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%', color: '#1a202c', backgroundColor: 'transparent' }}
                    />
                </div>
            </div>

            {/* ২. ট্যাব কন্ট্রোল (Users / System) */}
            <div className={styles.activityTabsContainer}>
                <button 
                    className={`${styles.activityTabBtn} ${activeTab === 'Users' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('Users')}
                >
                    <FiUser /> User Activity
                </button>
                <button 
                    className={`${styles.activityTabBtn} ${activeTab === 'System' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('System')}
                >
                    <FiServer /> System Logs
                </button>
            </div>

            {/* ৩. লগস টাইমলাইন লিস্ট */}
            <div className={styles.logsContainer}>
                {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => {
                        const IconComponent = log.icon;
                        return (
                            <div key={log.id} className={styles.logItem}>
                                {/* আইকন */}
                                <div className={`${styles.logIconWrapper} ${log.styleClass}`}>
                                    <IconComponent />
                                </div>
                                
                                {/* মূল কন্টেন্ট */}
                                <div className={styles.logContent}>
                                    <div className={styles.logMessage}>
                                        {activeTab === 'Users' ? (
                                            <><strong>{log.user}</strong> {log.action} <strong>{log.orderId}</strong></>
                                        ) : (
                                            <>{log.action} <strong>{log.orderId}</strong></>
                                        )}
                                    </div>
                                    <div className={styles.logMeta}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <FiClock size={12} /> {log.time}
                                        </span>
                                        {activeTab === 'System' && (
                                            <span style={{ color: '#718096', fontSize: '11px' }}>via {log.system}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#a0aec0', fontWeight: '600' }}>
                        No activity logs found for your search.
                    </div>
                )}
            </div>
        </div>
    );
}