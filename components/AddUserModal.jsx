import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

export default function AddUserModal({ onClose, onAddUser, styles }) {
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'Delivery Executive',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newUser.name || !newUser.email) return;
        onAddUser(newUser); 
    };

    // ইনপুট ফিল্ডগুলো দৃশ্যমান করার জন্য কমন স্টাইল
    const inputStyle = {
        width: '100%',
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #cbd5e0', // স্পষ্ট বর্ডার
        fontSize: '13px',
        outline: 'none',
        color: '#1a202c', // ডার্ক গ্রে টেক্সট কালার
        backgroundColor: '#fff', // সাদা ব্যাকগ্রাউন্ড
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent} style={{ padding: '24px', borderRadius: '12px', width: '400px', maxWidth: '90%', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1a202c' }}>Add New User</h3>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}>
                        <FiX size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#4a5568', display: 'block', marginBottom: '4px' }}>Full Name</label>
                        <input 
                            type="text" 
                            required
                            placeholder="Enter user name"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            style={inputStyle}
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
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#4a5568', display: 'block', marginBottom: '4px' }}>Role</label>
                        <select 
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            style={inputStyle}
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
                            onClick={onClose}
                            style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e0', background: '#f7fafc', color: '#4a5568', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
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
    );
}