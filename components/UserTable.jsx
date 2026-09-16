import React from 'react';
import { FiShield, FiLock, FiUnlock, FiEdit2 } from 'react-icons/fi';

export default function UserTable({ users, toggleUserStatus, styles }) {
    return (
        <div className={styles.usersTableContainer}>
            <table className={styles.usersTable}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Join Date</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#90273c', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '700', fontSize: '14px' }}>
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="userNameText" style={{ fontWeight: '700' }}>{user.name}</div>
                                        <div style={{ fontSize: '11px', color: '#718096' }}>{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span className={styles.roleBadge}>
                                    <FiShield style={{ display: 'inline', marginRight: '4px' }} /> {user.role}
                                </span>
                            </td>
                            <td className="tableText" style={{ fontWeight: '600' }}>{user.joinDate}</td>
                            <td>
                                <span className={user.status === 'Active' ? styles.badgeActive : styles.badgeSuspended}>
                                    {user.status}
                                </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                    <button 
                                        title="Edit User"
                                        style={{ background: '#edf2f7', border: 'none', width: '32px', height: '32px', borderRadius: '6px', color: '#4a5568', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <FiEdit2 size={14} />
                                    </button>

                                    <button 
                                        onClick={() => toggleUserStatus(user.id)}
                                        style={{ 
                                            background: user.status === 'Active' ? '#fff5f5' : '#f0fff4', 
                                            color: user.status === 'Active' ? '#c53030' : '#22543d',
                                            border: user.status === 'Active' ? '1px solid #feb2b2' : '1px solid #9ae6b4', 
                                            padding: '6px 12px', 
                                            borderRadius: '6px', 
                                            fontSize: '12px', 
                                            fontWeight: '700', 
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}
                                    >
                                        {user.status === 'Active' ? <><FiLock size={12} /> Suspend</> : <><FiUnlock size={12} /> Activate</>}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#718096', fontWeight: '600' }}>
                                No users found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}