import React from 'react';
import { FiEdit2, FiShield, FiLock, FiUnlock, FiTrash2 } from 'react-icons/fi';

export default function UserTable({ users, toggleUserStatus, onDeleteUser, styles }) {
    return (
        <div className={styles.tableContainer} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <tr>
                        <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase' }}>User Info</th>
                        <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase' }}>Role</th>
                        <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase' }}>Joined Date</th>
                        <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase' }}>Status</th>
                        <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#718096' }}>No users found.</td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' }}>
                                <td style={{ padding: '16px 20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#edf2f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#2d3748', fontSize: '14px' }}>
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: '600', color: '#1a202c', fontSize: '14px' }}>{user.name}</p>
                                            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#718096' }}>{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '16px 20px' }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#edf2f7', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: '#4a5568' }}>
                                        <FiShield style={{ color: '#718096' }} /> {user.role}
                                    </div>
                                </td>
                                <td style={{ padding: '16px 20px', fontSize: '13px', color: '#4a5568', fontWeight: '500' }}>
                                    {user.joinDate}
                                </td>
                                <td style={{ padding: '16px 20px' }}>
                                    <span style={{ 
                                        display: 'inline-block', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                                        background: user.status === 'Active' ? '#c6f6d5' : '#fed7d7',
                                        color: user.status === 'Active' ? '#22543d' : '#822727'
                                    }}>
                                        {user.status}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                        {/* স্ট্যাটাস আপডেট বাটন */}
                                        <button 
                                            onClick={() => toggleUserStatus(user.id)}
                                            title={user.status === 'Active' ? 'Suspend User' : 'Activate User'}
                                            style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: user.status === 'Active' ? '#e53e3e' : '#38a169', transition: 'all 0.2s' }}
                                        >
                                            {user.status === 'Active' ? <FiLock size={14} /> : <FiUnlock size={14} />}
                                        </button>
                                        
                                        {/* নতুন ডিলিট বাটন */}
                                        <button 
                                            onClick={() => onDeleteUser(user.id)}
                                            title="Delete User"
                                            style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #fed7d7', background: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#e53e3e', transition: 'all 0.2s' }}
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}