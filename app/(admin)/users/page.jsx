'use client';

import { useState, useEffect } from 'react';
import styles from '../dashboard.module.css';
import { FiUsers, FiUserPlus, FiUserCheck, FiUserX, FiSearch } from 'react-icons/fi';

import StatCard from '@/components/StatCard';
import UserTable from '@/components/UserTable';
import AddUserModal from '@/components/AddUserModal';

import { db } from '@/lib/firebase';
// এখানে deleteDoc ইম্পোর্ট করা হয়েছে
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                const usersList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUsers(usersList);
            } catch (error) {
                console.error("Error fetching users: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const toggleUserStatus = async (id) => {
        const userToUpdate = users.find(u => u.id === id);
        if (!userToUpdate) return;
        
        const newStatus = userToUpdate.status === 'Active' ? 'Suspended' : 'Active';

        try {
            const userRef = doc(db, "users", id);
            await updateDoc(userRef, { status: newStatus });

            setUsers(prev => prev.map(user => {
                if (user.id === id) {
                    return { ...user, status: newStatus };
                }
                return user;
            }));
        } catch (error) {
            console.error("Error updating status: ", error);
        }
    };

    // ফায়ারবেস থেকে ইউজার ডিলিট করার নতুন ফাংশন
    const handleDeleteUser = async (id) => {
        // ডিলিট করার আগে একবার ওয়ার্নিং দেখাবে
        const confirmDelete = window.confirm("Are you sure you want to delete this user permanently?");
        if (!confirmDelete) return;

        try {
            // ফায়ারবেস থেকে ডিলিট
            await deleteDoc(doc(db, "users", id));
            // স্ক্রিন থেকে সাথে সাথে সরিয়ে ফেলা
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error("Error deleting user: ", error);
        }
    };

    const handleAddUser = async (userData) => {
        try {
            const docRef = await addDoc(collection(db, "users"), userData);
            const userToAdd = {
                id: docRef.id,
                ...userData
            };
            setUsers([userToAdd, ...users]);
            setShowAddModal(false);
        } catch (error) {
            console.error("Error adding user: ", error);
        }
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

            <div className={styles.usersStatsGrid}>
                <StatCard title="Total Users" value={totalUsers} icon={FiUsers} iconColor="#90273c" />
                <StatCard title="Active" value={activeUsers} icon={FiUserCheck} iconColor="#38a169" />
                <StatCard title="Suspended" value={suspendedUsers} icon={FiUserX} iconColor="#e53e3e" />
            </div>

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

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>Loading users from database...</div>
            ) : (
                <UserTable 
                    users={filteredUsers} 
                    toggleUserStatus={toggleUserStatus} 
                    onDeleteUser={handleDeleteUser} // ডিলিট ফাংশনটি টেবিলে পাঠানো হলো
                    styles={styles} 
                />
            )}
            
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