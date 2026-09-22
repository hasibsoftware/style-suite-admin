'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiDownload, FiTrash2, FiActivity, FiUser, FiCpu, FiClock, FiPlusCircle, FiEdit, FiMinusCircle, FiShield, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';

export default function ActivityLogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('User Activity');
    const [dateFilter, setDateFilter] = useState('All Time');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "activity_logs"));
                let logsList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    
                    let inferredType = data.type;
                    if (!inferredType) {
                        const actionText = (data.action || '').toLowerCase();
                        inferredType = (actionText.includes('database') || actionText.includes('system') || actionText.includes('backup')) ? 'system' : 'user';
                    }

                    return { 
                        firebaseId: doc.id, 
                        ...data,
                        type: inferredType
                    };
                });
                
                if (logsList.length === 0) {
                    toast.loading("Initializing system logs...", { id: 'initL' });
                    const dummyData = [
                        { action: 'Created Order #427', timestamp: new Date().toISOString(), user: 'Mim', role: 'Staff', type: 'user' },
                        { action: 'Order status changed to Delivery for #427', timestamp: new Date(Date.now() - 300000).toISOString(), user: 'Automated System', type: 'system' }
                    ];
                    for (const record of dummyData) {
                        const docRef = await addDoc(collection(db, "activity_logs"), record);
                        logsList.push({ firebaseId: docRef.id, ...record });
                    }
                    toast.success("Logs loaded!", { id: 'initL' });
                }
                
                setLogs(logsList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
            } catch (error) {
                toast.error("Failed to load logs!");
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const getBadgeInfo = (actionText) => {
        const lower = (actionText || '').toLowerCase();
        if (lower.includes('create') || lower.includes('add') || lower.includes('new')) {
            return { label: 'CREATE', bg: '#dcfce7', color: '#16a34a', icon: <FiPlusCircle /> };
        }
        if (lower.includes('delete') || lower.includes('cancel') || lower.includes('remove')) {
            return { label: 'DELETE', bg: '#fee2e2', color: '#dc2626', icon: <FiMinusCircle /> };
        }
        if (lower.includes('edit') || lower.includes('update') || lower.includes('change')) {
            return { label: 'UPDATE', bg: '#e0f2fe', color: '#0284c7', icon: <FiEdit /> };
        }
        if (lower.includes('approve') || lower.includes('packed') || lower.includes('success')) {
            return { label: 'SUCCESS', bg: '#dcfce7', color: '#16a34a', icon: <FiCheckCircle /> };
        }
        if (lower.includes('damaged') || lower.includes('issue') || lower.includes('fail')) {
            return { label: 'WARNING', bg: '#fef9c3', color: '#ca8a04', icon: <FiAlertTriangle /> };
        }
        return { label: 'INFO', bg: '#f1f5f9', color: '#475569', icon: <FiActivity /> };
    };

    const timeAgo = (dateString) => {
        if (!dateString) return 'Unknown time';
        const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " mins ago";
        return Math.floor(seconds) + " seconds ago";
    };

    const filteredLogs = logs.filter(log => {
        const matchesTab = activeTab === 'User Activity' ? log.type !== 'system' : log.type === 'system';
        const matchesSearch = (log.action || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (log.user || '').toLowerCase().includes(searchTerm.toLowerCase());
                              
        let matchesDate = true;
        if (dateFilter !== 'All Time' && log.timestamp) {
            const diffDays = (new Date() - new Date(log.timestamp)) / (1000 * 60 * 60 * 24);
            if (dateFilter === 'Today') matchesDate = diffDays <= 1;
            if (dateFilter === 'Last 7 Days') matchesDate = diffDays <= 7;
            if (dateFilter === 'This Month') matchesDate = diffDays <= 30;
        }

        return matchesTab && matchesSearch && matchesDate;
    });

    const handleClearLogs = async () => {
        const pass = prompt("WARNING: This will permanently delete old logs. Enter 'CONFIRM' to proceed:");
        if (pass !== 'CONFIRM') {
            toast.error("Operation cancelled.");
            return;
        }

        toast.loading("Clearing old logs...", { id: 'clearL' });
        try {
            for (const log of filteredLogs) {
                await deleteDoc(doc(db, "activity_logs", log.firebaseId));
            }
            setLogs(logs.filter(l => !filteredLogs.includes(l)));
            toast.success("Old logs cleared successfully!", { id: 'clearL' });
        } catch (error) {
            toast.error("Failed to clear logs.", { id: 'clearL' });
        }
    };

    const exportToCSV = () => {
        if (filteredLogs.length === 0) {
            toast.error("No logs to export!");
            return;
        }
        
        const headers = ["Timestamp", "User/System", "Role", "Action Type", "Details"];
        const rows = filteredLogs.map(l => [
            l.timestamp ? new Date(l.timestamp).toLocaleString() : 'N/A',
            l.user || 'Admin System',
            l.role || 'N/A',
            getBadgeInfo(l.action).label,
            `"${(l.action || '').replace(/"/g, '""')}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `security_logs_${activeTab.replace(' ', '_').toLowerCase()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Logs exported successfully!");
    };

    return (
        <div style={{ padding: '0 20px 20px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
            <Toaster position="top-right" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div>
                    <h2 style={{ margin: '0 0 5px', fontSize: '20px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FiActivity style={{ color: '#90273c' }} /> Security & Activity Logs
                    </h2>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Track all user actions, system processes, and security events in real-time.</p>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <select 
                        value={dateFilter} 
                        onChange={(e) => setDateFilter(e.target.value)}
                        style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '14px', color: '#1e293b', outline: 'none', background: '#fff', cursor: 'pointer' }}
                    >
                        <option value="All Time">All Time</option>
                        <option value="Today">Today</option>
                        <option value="Last 7 Days">Last 7 Days</option>
                        <option value="This Month">This Month</option>
                    </select>

                    <button onClick={exportToCSV} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1e293b', border: 'none', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#fff', cursor: 'pointer', transition: '0.2s' }}>
                        <FiDownload /> Export CSV
                    </button>

                    <button onClick={handleClearLogs} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff0f2', border: '1px solid #fca5a5', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#ef4444', cursor: 'pointer', transition: '0.2s' }}>
                        <FiTrash2 /> Clear Logs
                    </button>
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                
                <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button 
                            onClick={() => setActiveTab('User Activity')}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', border: 'none', transition: '0.2s', background: activeTab === 'User Activity' ? '#1e293b' : '#e2e8f0', color: activeTab === 'User Activity' ? '#fff' : '#475569' }}
                        >
                            <FiUser /> User Activity
                        </button>
                        <button 
                            onClick={() => setActiveTab('System Logs')}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', border: 'none', transition: '0.2s', background: activeTab === 'System Logs' ? '#1e293b' : '#e2e8f0', color: activeTab === 'System Logs' ? '#fff' : '#475569' }}
                        >
                            <FiCpu /> System Logs
                        </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #cbd5e0', borderRadius: '8px', padding: '8px 12px', width: '300px' }}>
                        <FiSearch style={{ color: '#94a3b8', marginRight: '8px' }} />
                        <input type="text" placeholder="Search logs, actions, or users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px', color: '#1e293b' }} />
                    </div>
                </div>

                <div style={{ padding: '20px' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading logs...</div>
                    ) : filteredLogs.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {filteredLogs.map((log) => {
                                const badge = getBadgeInfo(log.action);
                                
                                return (
                                    <div key={log.firebaseId} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: badge.bg, color: badge.color, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, fontSize: '18px' }}>
                                            {badge.icon}
                                        </div>
                                        
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                                <span style={{ fontSize: '11px', fontWeight: 'bold', background: badge.bg, color: badge.color, padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.5px' }}>
                                                    {badge.label}
                                                </span>
                                                <h4 style={{ margin: 0, fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>
                                                    {log.action}
                                                </h4>
                                            </div>
                                            
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#64748b' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <FiClock /> {timeAgo(log.timestamp)}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    {activeTab === 'User Activity' ? <FiUser /> : <FiCpu />} 
                                                    {/* Directly checking here to force fallback on empty string/null */}
                                                    via {log.user ? log.user : 'Admin System'} 
                                                    {log.role && <span style={{ background: '#e2e8f0', padding: '1px 6px', borderRadius: '4px', fontSize: '10px', color: '#475569', marginLeft: '4px' }}>{log.role}</span>}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                            <FiShield size={40} style={{ opacity: 0.5, marginBottom: '12px' }} />
                            <p style={{ margin: 0, fontSize: '15px' }}>No logs found for the selected criteria.</p>
                            <p style={{ margin: '5px 0 0', fontSize: '13px' }}>Try adjusting your search or date filter.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}