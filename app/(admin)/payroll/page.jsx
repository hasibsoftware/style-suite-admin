'use client';

import { useState } from 'react';
import styles from '../dashboard.module.css';
import { 
    FiDollarSign, 
    FiPackage, 
    FiRefreshCw, 
    FiUsers, 
    FiSearch, 
    FiDownload, 
    FiCheckCircle, 
    FiClock 
} from 'react-icons/fi';

export default function PayrollPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // স্কেচ অনুযায়ী মূল ডেমো ডাটা
    const payrollSummary = {
        totalPayroll: '৳১,৪৫,০০০',
        totalDeliveryParcels: 415,
        totalDeliverySarees: 555,
        totalReturnParcels: 25,
        totalReturnSarees: 30,
        totalStaff: 8
    };

    // স্টাফ এবং ডেলিভারি পে-রোল লিস্ট
    const [staffPayroll, setStaffPayroll] = useState([
        { id: 'EMP-101', name: 'Rahim Uddin', role: 'Delivery Executive', deliveredParcels: 150, deliveredSarees: 200, returnedParcels: 8, baseSalary: 15000, commission: 4500, totalPayable: 19500, status: 'Paid' },
        { id: 'EMP-102', name: 'Karim Mia', role: 'Delivery Executive', deliveredParcels: 140, deliveredSarees: 180, returnedParcels: 10, baseSalary: 15000, commission: 4200, totalPayable: 19200, status: 'Pending' },
        { id: 'EMP-103', name: 'Sumon Hasan', role: 'Delivery Executive', deliveredParcels: 125, deliveredSarees: 175, returnedParcels: 7, baseSalary: 15000, commission: 3750, totalPayable: 18750, status: 'Pending' },
        { id: 'EMP-104', name: 'Tanvir Ahmed', role: 'Packaging Specialist', deliveredParcels: 0, deliveredSarees: 0, returnedParcels: 0, baseSalary: 18000, commission: 1500, totalPayable: 19500, status: 'Paid' },
        { id: 'EMP-105', name: 'Nusrat Jahan', role: 'Inventory Manager', deliveredParcels: 0, deliveredSarees: 0, returnedParcels: 0, baseSalary: 25000, commission: 0, totalPayable: 25000, status: 'Paid' },
    ]);

    // ফিল্টারিং
    const filteredPayroll = staffPayroll.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // পেমেন্ট স্ট্যাটাস টগল
    const togglePaymentStatus = (id) => {
        setStaffPayroll(prev => prev.map(emp => {
            if (emp.id === id) {
                return { ...emp, status: emp.status === 'Paid' ? 'Pending' : 'Paid' };
            }
            return emp;
        }));
    };

    return (
        <div style={{ padding: '0 4px' }}>
            {/* ১. হেডার সেকশন */}
            <div className={styles.payrollHeader}>
                <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a202c', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FiDollarSign style={{ color: '#90273c' }} /> Payroll Management
                    </h2>
                    <p style={{ fontSize: '13px', color: '#718096', margin: '4px 0 0 0' }}>Manage employee salaries, delivery commissions, and payouts.</p>
                </div>
                <button style={{ background: '#90273c', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 4px rgba(144, 39, 60, 0.2)' }}>
                    <FiDownload /> Export Sheet
                </button>
            </div>

            {/* ২. স্কেচ অনুযায়ী টপ সামারি কার্ডস (Total Payroll, Total Delivery, Total Return) */}
            <div className={styles.payrollStatsGrid}>
                
                {/* Total Payroll */}
                <div className={styles.payrollStatCard}>
                    <div style={{ background: '#fdf2f4', padding: '14px', borderRadius: '10px', color: '#90273c', fontSize: '24px' }}>
                        <FiDollarSign />
                    </div>
                    <div>
                        <div style={{ fontSize: '12px', color: '#718096', fontWeight: '700', textTransform: 'uppercase' }}>Total Payroll</div>
                        <div style={{ fontSize: '22px', fontWeight: '800', color: '#1a202c', marginTop: '2px' }}>{payrollSummary.totalPayroll}</div>
                        <div style={{ fontSize: '11px', color: '#38a169', fontWeight: '600', marginTop: '2px' }}>{payrollSummary.totalStaff} Active Employees</div>
                    </div>
                </div>

                {/* Total Delivery (415 Parcels, 555 Sarees) */}
                <div className={styles.payrollStatCard}>
                    <div style={{ background: '#ebf8ff', padding: '14px', borderRadius: '10px', color: '#3182ce', fontSize: '24px' }}>
                        <FiPackage />
                    </div>
                    <div>
                        <div style={{ fontSize: '12px', color: '#718096', fontWeight: '700', textTransform: 'uppercase' }}>Total Delivery</div>
                        <div style={{ fontSize: '20px', fontWeight: '800', color: '#1a202c', marginTop: '2px' }}>{payrollSummary.totalDeliveryParcels} <span style={{ fontSize: '12px', fontWeight: '600', color: '#718096' }}>Parcels</span></div>
                        <div style={{ fontSize: '12px', color: '#3182ce', fontWeight: '700', marginTop: '2px' }}>{payrollSummary.totalDeliverySarees} <span style={{ fontSize: '11px', fontWeight: '500' }}>Sarees Delivered</span></div>
                    </div>
                </div>

                {/* Total Return Parcel & Sarees */}
                <div className={styles.payrollStatCard}>
                    <div style={{ background: '#fff5f5', padding: '14px', borderRadius: '10px', color: '#e53e3e', fontSize: '24px' }}>
                        <FiRefreshCw />
                    </div>
                    <div>
                        <div style={{ fontSize: '12px', color: '#718096', fontWeight: '700', textTransform: 'uppercase' }}>Total Return</div>
                        <div style={{ fontSize: '20px', fontWeight: '800', color: '#1a202c', marginTop: '2px' }}>{payrollSummary.totalReturnParcels} <span style={{ fontSize: '12px', fontWeight: '600', color: '#718096' }}>Parcels</span></div>
                        <div style={{ fontSize: '12px', color: '#e53e3e', fontWeight: '700', marginTop: '2px' }}>{payrollSummary.totalReturnSarees} <span style={{ fontSize: '11px', fontWeight: '500' }}>Sarees Returned</span></div>
                    </div>
                </div>

            </div>

            {/* ৩. সার্চ ও ফিল্টার টুলবার */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 14px', width: '260px' }}>
                    <FiSearch style={{ color: '#718096', marginRight: '8px' }} />
                    <input 
                        type="text" 
                        placeholder="Search employee or ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%', color: '#1a202c', backgroundColor: 'transparent' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#2d3748', outline: 'none', cursor: 'pointer' }}
                    >
                        <option value="All">All Status</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
            </div>

            {/* ৪. পে-রোল ডাটা টেবিল */}
            <div className={styles.payrollTableContainer}>
                <table className={styles.payrollTable}>
                    <thead>
                        <tr>
                            <th>Employee Details</th>
                            <th>Role</th>
                            <th>Delivered (Parcels / Sarees)</th>
                            <th>Returns</th>
                            <th>Base Salary</th>
                            <th>Commission</th>
                            <th>Total Payable</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayroll.map((emp) => (
                            <tr key={emp.id}>
                                <td>
                                    <div style={{ fontWeight: '700', color: '#1a202c' }}>{emp.name}</div>
                                    <div style={{ fontSize: '11px', color: '#718096' }}>{emp.id}</div>
                                </td>
                                <td style={{ fontWeight: '600', color: '#4a5568' }}>{emp.role}</td>
                                <td>
                                    {emp.deliveredParcels > 0 ? (
                                        <span><strong>{emp.deliveredParcels}</strong> Pcs / <strong>{emp.deliveredSarees}</strong> Sarees</span>
                                    ) : (
                                        <span style={{ color: '#a0aec0' }}>N/A</span>
                                    )}
                                </td>
                                <td>
                                    {emp.returnedParcels > 0 ? (
                                        <span style={{ color: '#e53e3e', fontWeight: '600' }}>{emp.returnedParcels} Pcs</span>
                                    ) : (
                                        <span style={{ color: '#a0aec0' }}>0</span>
                                    )}
                                </td>
                                <td style={{ fontWeight: '600' }}>৳{emp.baseSalary.toLocaleString()}</td>
                                <td style={{ fontWeight: '600', color: '#38a169' }}>+৳{emp.commission.toLocaleString()}</td>
                                <td style={{ fontWeight: '800', color: '#90273c', fontSize: '14px' }}>
                                    ৳{emp.totalPayable.toLocaleString()}
                                </td>
                                <td>
                                    <span className={emp.status === 'Paid' ? styles.statusPaid : styles.statusPending}>
                                        {emp.status === 'Paid' ? <><FiCheckCircle style={{ display: 'inline', marginRight: '4px' }} /> Paid</> : <><FiClock style={{ display: 'inline', marginRight: '4px' }} /> Pending</>}
                                    </span>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <button 
                                        onClick={() => togglePaymentStatus(emp.id)}
                                        style={{ 
                                            background: emp.status === 'Paid' ? '#edf2f7' : '#90273c', 
                                            color: emp.status === 'Paid' ? '#4a5568' : '#fff',
                                            border: 'none', 
                                            padding: '6px 12px', 
                                            borderRadius: '6px', 
                                            fontSize: '12px', 
                                            fontWeight: '700', 
                                            cursor: 'pointer' 
                                        }}
                                    >
                                        {emp.status === 'Paid' ? 'Mark Pending' : 'Mark as Paid'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredPayroll.length === 0 && (
                            <tr>
                                <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#718096', fontWeight: '600' }}>
                                    No payroll records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}