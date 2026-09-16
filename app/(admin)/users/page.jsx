'use client';

import { useState } from 'react';
import styles from '../dashboard.module.css';
import { FiUsers, FiUserPlus, FiUserCheck, FiUserX, FiSearch } from 'react-icons/fi';

import StatCard from '@/components/StatCard';
import UserTable from '@/components/UserTable';
import AddUserModal from '@/components/AddUserModal';

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

    const toggleUserStatus = (id) => {
        setUsers(prev => prev.map(user => {
            if (user.id === id) {
                return { ...user, status: user.status === 'Active' ? 'Suspended' : 'Active' };
            }
            return user;
        }));
    };

    // ফাংশনটি এখন সরাসরি মডাল থেকে ডেটা রিসিভ করবে
    const handleAddUser = (userData) => {
        const userToAdd = {
            id: users.length + 1,
            ...userData
        };
        setUsers([userToAdd, ...users]);
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
                <StatCard title="Total Users" value={totalUsers} icon={FiUsers} iconColor="#90273c" />
                <StatCard title="Active" value={activeUsers} icon={FiUserCheck} iconColor="#38a169" />
                <StatCard title="Suspended" value={suspendedUsers} icon={FiUserX} iconColor="#e53e3e" />
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
                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="filterDropdown" style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', outline: 'none', cursor: 'pointer' }}>
                        <option value="All">All Roles</option>
                        <option value="Super Admin">Super Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Delivery Executive">Delivery Executive</option>
                        <option value="Customer Support">Customer Support</option>
                    </select>

                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filterDropdown" style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', outline: 'none', cursor: 'pointer' }}>
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                    </select>
                </div>
            </div>

            {/* ৪. ইউজার টেবিল */}
            <UserTable 
                users={filteredUsers} 
                toggleUserStatus={toggleUserStatus} 
                styles={styles} 
            />
            
            {/* ৫. Add User Modal */}
            {showAddModal && (
                <AddUserModal 
                    onClose={() => setShowAddModal(false)} 
                    onAddUser={handleAddUser} 
                    styles={styles} 
                />
            )}
        </div>
    );
}