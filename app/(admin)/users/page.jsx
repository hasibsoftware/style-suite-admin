'use client';

import { useState } from 'react';
import styles from '../dashboard.module.css';
import { 
    FiUsers, 
    FiUserPlus, 
    FiUserCheck, 
    FiUserX, 
    FiSearch, 
    FiEdit2, 
    FiShield, 
    FiLock, 
    FiUnlock, 
    FiX 
} from 'react-icons/fi';

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);

    const [users, setUsers] = useState([
        { id: 1, name: 'Tanvir Hasan', email: 'tanvir@example.com', role: 'Super Admin', joinDate: '12 Jan 2024', status: 'Active' },
        { id: 2, name: 'Rahim Uddin', email: 'rahim@delivery.com', role: 'Delivery Executive', joinDate: '01 Feb 2024', status: 'Active' },
        { id: 3, name: 'Sultana Razia', email: 'sultana@example.com', role: 'Manager', joinDate: '15 Mar 2024', status: 'Active' },
        { id: 4, name: 'Karim Mia', email: 'karim@delivery.com', role: 'Delivery Executive', joinDate: '10 Apr 2024', status: 'Suspended' },
        { id: 5, name: 'Nusrat Jahan', email: 'nusrat@store.com', role: 'Customer Support', joinDate: '20 May 2024', status: 'Active' },
    ]);

    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'Delivery Executive',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active'
    });

    const toggleUserStatus = (id) => {
        setUsers(prev => prev.map(user => {
            if (user.id === id) {
                const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
                return { ...user, status: newStatus };
            }
            return user;
        }));
    };

    const handleAddUser = (e) => {
        e.preventDefault();
        if (!newUser.name || !newUser.email) return;

        const userToAdd = {
            id: users.length + 1,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            joinDate: newUser.joinDate,
            status: newUser.status
        };

        setUsers([userToAdd, ...users]);
        setNewUser({ name: '', email: '', role: 'Delivery Executive', joinDate: new Date().toISOString().split('T')[0], status: 'Active' });
        setShowAddModal(false);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'Active').length;
    const suspendedUsers = users.filter(u => u.status === 'Suspended').length;

    return (
        <div style={{ padding: '0 4px' }}>
            {/* ১. হেডার ও Add বাটন */}
            <div className={styles.usersHeader}>
                <div>
                    <h2 className="pageTitle" style={{ fontSize: '20px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FiUsers style={{ color: '#90273c' }} /> User Management
                    </h2>
                    <p style={{ fontSize: '13px', color: '#718096', margin: '4px 0 0 0' }}>Manage system users, assign roles, and control access permissions.</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    style={{ background: '#90273c', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 4px rgba(144, 39, 60, 0.2)' }}
                >
                    <FiUserPlus /> Add User
                </button>
            </div>

            {/* ২. টপ সামারি কার্ডস */}
            <div className={styles.usersStatsGrid}>
                <div className={styles.usersStatCard}>
                    <div style={{ padding: '12px', borderRadius: '10px', color: '#90273c', fontSize: '22px' }}><FiUsers /></div>
                    <div>
                        <div style={{ fontSize: '11px', color: '#718096', fontWeight: '700', textTransform: 'uppercase' }}>Total Users</div>
                        <div className="statValue" style={{ fontSize: '20px', fontWeight: '800' }}>{totalUsers}</div>
                    </div>
                </div>
                <div className={styles.usersStatCard}>
                    <div style={{ padding: '12px', borderRadius: '10px', color: '#38a169', fontSize: '22px' }}><FiUserCheck /></div>
                    <div>
                        <div style={{ fontSize: '11px', color: '#718096', fontWeight: '700', textTransform: 'uppercase' }}>Active</div>
                        <div className="statValue" style={{ fontSize: '20px', fontWeight: '800' }}>{activeUsers}</div>
                    </div>
                </div>
                <div className={styles.usersStatCard}>
                    <div style={{ padding: '12px', borderRadius: '10px', color: '#e53e3e', fontSize: '22px' }}><FiUserX /></div>
                    <div>
                        <div style={{ fontSize: '11px', color: '#718096', fontWeight: '700', textTransform: 'uppercase' }}>Suspended</div>
                        <div className="statValue" style={{ fontSize: '20px', fontWeight: '800' }}>{suspendedUsers}</div>
                    </div>
                </div>
            </div>

            {/* ৩. সার্চ ও ফিল্টার বার */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '16px' }}>
                <div className="searchBoxWrapper" style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 14px', width: '280px' }}>
                    <FiSearch style={{ color: '#718096', marginRight: '8px' }} />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%', backgroundColor: 'transparent' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <select 
                        value={roleFilter} 
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="filterDropdown"
                        style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', outline: 'none', cursor: 'pointer' }}
                    >
                        <option value="All">All Roles</option>
                        <option value="Super Admin">Super Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Delivery Executive">Delivery Executive</option>
                        <option value="Customer Support">Customer Support</option>
                    </select>

                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="filterDropdown"
                        style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', outline: 'none', cursor: 'pointer' }}
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                    </select>
                </div>
            </div>

            {/* ৪. ইউজার টেবিল */}
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
                        {filteredUsers.map((user) => (
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
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#718096', fontWeight: '600' }}>
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ৫. Add User Modal */}
            {showAddModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent} style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '400px', maxWidth: '90%', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1a202c' }}>Add New User</h3>
                            <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}>
                                <FiX size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: '700', color: '#4a5568', display: 'block', marginBottom: '4px' }}>Full Name</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="Enter user name"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '13px', outline: 'none', color: '#1a202c', backgroundColor: '#fff' }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '12px', fontWeight: '700', color: '#4a5568', display: 'block', marginBottom: '4px' }}>Email Address</label>
                                <input 
                                    type="email" 
                                    required
                                    placeholder="user@example.com"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '13px', outline: 'none', color: '#1a202c', backgroundColor: '#fff' }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '12px', fontWeight: '700', color: '#4a5568', display: 'block', marginBottom: '4px' }}>Role</label>
                                <select 
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '13px', outline: 'none', color: '#1a202c', background: '#fff' }}
                                >
                                    <option value="Super Admin">Super Admin</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Delivery Executive">Delivery Executive</option>
                                    <option value="Customer Support">Customer Support</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                <button 
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', color: '#4a5568', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', background: '#90273c', color: '#fff', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
                                >
                                    Save User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}