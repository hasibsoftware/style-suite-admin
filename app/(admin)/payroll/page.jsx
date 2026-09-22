'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiRefreshCw, FiCreditCard, FiBox, FiCheckCircle, FiClock, FiPrinter, FiUser, FiBriefcase, FiCheckSquare, FiDownload } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';

export default function PayrollPage() {
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('All Time'); // Default to All Time for old data
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [selectedPayslip, setSelectedPayslip] = useState(null);

    // Fetch Payroll Data
    useEffect(() => {
        const fetchPayroll = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "payroll"));
                let payrollList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        firebaseId: doc.id,
                        // 🔴 Fallback for old data that doesn't have month or deduction
                        month: data.month || 'September 2026',
                        deduction: data.deduction || 0,
                        ...data
                    };
                });
                
                if (payrollList.length === 0) {
                    toast.loading("Initializing HR & Payroll data...", { id: 'initP' });
                    const dummyData = [
                        { empId: 'EMP-101', name: 'Rahim Uddin', role: 'Delivery Executive', month: 'September 2026', delivered: 150, returns: 8, baseSalary: 15000, commission: 4500, deduction: 0, status: 'Paid', paymentDate: new Date().toISOString() },
                        { empId: 'EMP-102', name: 'Karim Mia', role: 'Delivery Executive', month: 'September 2026', delivered: 140, returns: 10, baseSalary: 15000, commission: 4200, deduction: 500, status: 'Pending', paymentDate: null },
                        { empId: 'EMP-103', name: 'Sumon Hasan', role: 'Delivery Executive', month: 'September 2026', delivered: 125, returns: 7, baseSalary: 15000, commission: 3750, deduction: 0, status: 'Pending', paymentDate: null },
                        { empId: 'EMP-104', name: 'Tanvir Ahmed', role: 'Packaging Specialist', month: 'September 2026', delivered: 0, returns: 0, baseSalary: 18000, commission: 1500, deduction: 0, status: 'Paid', paymentDate: new Date().toISOString() },
                        { empId: 'EMP-105', name: 'Nusrat Jahan', role: 'Inventory Manager', month: 'September 2026', delivered: 0, returns: 0, baseSalary: 25000, commission: 0, deduction: 0, status: 'Paid', paymentDate: new Date().toISOString() },
                    ];
                    
                    const newlyAdded = [];
                    for (const record of dummyData) {
                        const docRef = await addDoc(collection(db, "payroll"), record);
                        newlyAdded.push({ firebaseId: docRef.id, ...record });
                    }
                    payrollList = newlyAdded;
                    toast.success("Payroll data loaded!", { id: 'initP' });
                }
                
                setPayrolls(payrollList);
            } catch (error) {
                toast.error("Failed to load payroll data!");
            } finally {
                setLoading(false);
            }
        };
        fetchPayroll();
    }, []);

    // Calculate Net Payable
    const calculateNet = (record) => {
        return (record.baseSalary || 0) + (record.commission || 0) - (record.deduction || 0);
    };

    // Filters
    const filteredPayrolls = payrolls.filter(p => {
        const matchesMonth = selectedMonth === 'All Time' || p.month === selectedMonth;
        const matchesStatus = statusFilter === 'All Status' || p.status === statusFilter;
        const matchesSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (p.empId || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesMonth && matchesStatus && matchesSearch;
    });

    // KPIs
    const totalPayrollAmount = filteredPayrolls.reduce((sum, p) => sum + calculateNet(p), 0);
    const totalDelivered = filteredPayrolls.reduce((sum, p) => sum + (p.delivered || 0), 0);
    const totalReturns = filteredPayrolls.reduce((sum, p) => sum + (p.returns || 0), 0);

    // Actions
    const handleMarkAsPaid = async (record) => {
        if (!confirm(`Confirm salary payment of ৳${calculateNet(record).toLocaleString()} to ${record.name}?`)) return;
        
        try {
            const docRef = doc(db, "payroll", record.firebaseId);
            await updateDoc(docRef, { status: 'Paid', paymentDate: new Date().toISOString() });
            
            setPayrolls(payrolls.map(p => p.firebaseId === record.firebaseId ? { ...p, status: 'Paid', paymentDate: new Date().toISOString() } : p));
            toast.success(`Payment marked for ${record.name}`);
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    const handleProcessAllPending = async () => {
        const pendingRecords = filteredPayrolls.filter(p => p.status === 'Pending');
        if (pendingRecords.length === 0) {
            toast.error("No pending payments for selected filter.");
            return;
        }

        if (!confirm(`Are you sure you want to process all ${pendingRecords.length} pending payments?`)) return;

        toast.loading("Processing bulk payments...", { id: 'bulkP' });
        try {
            const updatedPayrolls = [...payrolls];
            for (const record of pendingRecords) {
                const docRef = doc(db, "payroll", record.firebaseId);
                await updateDoc(docRef, { status: 'Paid', paymentDate: new Date().toISOString() });
                
                const index = updatedPayrolls.findIndex(p => p.firebaseId === record.firebaseId);
                if (index !== -1) {
                    updatedPayrolls[index].status = 'Paid';
                    updatedPayrolls[index].paymentDate = new Date().toISOString();
                }
            }
            setPayrolls(updatedPayrolls);
            toast.success(`Processed ${pendingRecords.length} payments successfully!`, { id: 'bulkP' });
        } catch (error) {
            toast.error("Bulk process failed.", { id: 'bulkP' });
        }
    };

    const handlePrintPayslip = (record) => {
        setSelectedPayslip(record);
        setTimeout(() => {
            window.print();
        }, 500);
    };

    const exportToCSV = () => {
        if (filteredPayrolls.length === 0) {
            toast.error("No data to export!");
            return;
        }
        
        const headers = ["Employee ID", "Name", "Role", "Month", "Base Salary", "Commission", "Deductions", "Net Payable", "Status"];
        const rows = filteredPayrolls.map(p => [
            p.empId || 'N/A',
            p.name || 'N/A',
            p.role || 'N/A',
            p.month || 'N/A',
            p.baseSalary || 0,
            p.commission || 0,
            p.deduction || 0,
            calculateNet(p),
            p.status || 'N/A'
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `payroll_sheet_${selectedMonth.replace(' ', '_').toLowerCase()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Payroll sheet exported successfully!");
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; padding: 40px; font-family: Arial, sans-serif; background: #fff; }
                    body { background: white !important; }
                    @page { margin: 1cm; }
                }
                @media screen {
                    .print-only { display: none !important; }
                }
            `}} />

            <div className="no-print" style={{ padding: '0 20px 20px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
                <Toaster position="top-right" />

                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div>
                        <h2 style={{ margin: '0 0 5px', fontSize: '20px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FiCreditCard style={{ color: '#90273c' }} /> Payroll Management
                        </h2>
                        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Manage employee salaries, delivery commissions, deductions, and payslips.</p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {/* Monthly Filter */}
                        <select 
                            value={selectedMonth} 
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '14px', color: '#1e293b', outline: 'none', background: '#fff', cursor: 'pointer' }}
                        >
                            <option value="All Time">All Months</option>
                            <option value="September 2026">September 2026</option>
                            <option value="August 2026">August 2026</option>
                            <option value="July 2026">July 2026</option>
                        </select>

                        {/* Export Sheet Button */}
                        <button onClick={exportToCSV} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#90273c', border: 'none', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#fff', cursor: 'pointer', transition: '0.2s' }}>
                            <FiDownload /> Export Sheet
                        </button>

                        {/* Bulk Process Button */}
                        <button onClick={handleProcessAllPending} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#10b981', border: 'none', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#fff', cursor: 'pointer', transition: '0.2s', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}>
                            <FiCheckSquare /> Process All Pending
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Total Payroll {selectedMonth !== 'All Time' && `(${selectedMonth})`}</p>
                            <h3 style={{ margin: 0, fontSize: '28px', color: '#1e293b' }}>৳ {totalPayrollAmount.toLocaleString()}</h3>
                            <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#10b981', fontWeight: '600' }}>{filteredPayrolls.length} Active Employees</p>
                        </div>
                        <div style={{ background: '#f1f5f9', padding: '16px', borderRadius: '50%' }}><FiBriefcase size={28} color="#475569" /></div>
                    </div>
                    
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Total Deliveries</p>
                            <h3 style={{ margin: 0, fontSize: '28px', color: '#3b82f6' }}>{totalDelivered}</h3>
                            <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#64748b' }}>Successful Parcels</p>
                        </div>
                        <div style={{ background: '#e0f2fe', padding: '16px', borderRadius: '50%' }}><FiBox size={28} color="#3b82f6" /></div>
                    </div>

                    <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Total Returns</p>
                            <h3 style={{ margin: 0, fontSize: '28px', color: '#ef4444' }}>{totalReturns}</h3>
                            <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#64748b' }}>Returned Parcels</p>
                        </div>
                        <div style={{ background: '#fee2e2', padding: '16px', borderRadius: '50%' }}><FiRefreshCw size={28} color="#ef4444" /></div>
                    </div>
                </div>

                {/* Main Table Area */}
                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    
                    {/* Toolbar */}
                    <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #cbd5e0', borderRadius: '8px', padding: '8px 12px', width: '300px' }}>
                            <FiSearch style={{ color: '#94a3b8', marginRight: '8px' }} />
                            <input type="text" placeholder="Search employee or ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px', color: '#1e293b' }} />
                        </div>
                        
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '13px', color: '#1e293b', outline: 'none', background: '#fff', cursor: 'pointer' }}
                        >
                            <option value="All Status">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1050px' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ padding: '16px 20px' }}>Employee Details</th>
                                    <th style={{ padding: '16px 20px' }}>Performance (D/R)</th>
                                    <th style={{ padding: '16px 20px' }}>Base Salary</th>
                                    <th style={{ padding: '16px 20px' }}>Commission</th>
                                    <th style={{ padding: '16px 20px' }}>Deductions</th>
                                    <th style={{ padding: '16px 20px' }}>Net Payable</th>
                                    <th style={{ padding: '16px 20px' }}>Status</th>
                                    <th style={{ padding: '16px 20px', textAlign: 'center' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading payroll data...</td></tr>
                                ) : filteredPayrolls.length > 0 ? (
                                    filteredPayrolls.map((record) => {
                                        const netPayable = calculateNet(record);
                                        const isPaid = record.status === 'Paid';

                                        return (
                                            <tr key={record.firebaseId} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = '#fff'}>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748b' }}>
                                                            <FiUser size={18} />
                                                        </div>
                                                        <div>
                                                            <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>{record.name}</p>
                                                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{record.empId} • {record.role}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px 20px', fontSize: '13px', color: '#475569' }}>
                                                    {record.role.includes('Delivery') ? (
                                                        <span><strong style={{ color: '#10b981' }}>{record.delivered || 0}</strong> Delivered / <strong style={{ color: '#ef4444' }}>{record.returns || 0}</strong> Returned</span>
                                                    ) : <span style={{ color: '#94a3b8' }}>N/A</span>}
                                                </td>
                                                <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>৳ {(record.baseSalary || 0).toLocaleString()}</td>
                                                <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '600', color: '#10b981' }}>+৳ {(record.commission || 0).toLocaleString()}</td>
                                                <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '600', color: '#ef4444' }}>-৳ {(record.deduction || 0).toLocaleString()}</td>
                                                <td style={{ padding: '16px 20px', fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>৳ {netPayable.toLocaleString()}</td>
                                                
                                                <td style={{ padding: '16px 20px' }}>
                                                    <span style={{ 
                                                        display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                                                        background: isPaid ? '#dcfce7' : '#ffedd5', color: isPaid ? '#16a34a' : '#ea580c'
                                                    }}>
                                                        {isPaid ? <FiCheckCircle /> : <FiClock />} {record.status || 'Pending'}
                                                    </span>
                                                </td>
                                                
                                                <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                                                    {isPaid ? (
                                                        <button onClick={() => handlePrintPayslip(record)} style={{ padding: '8px 12px', borderRadius: '6px', background: '#fff', border: '1px solid #cbd5e0', color: '#475569', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={e => e.currentTarget.style.background = '#fff'}>
                                                            <FiPrinter /> Payslip
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => handleMarkAsPaid(record)} style={{ padding: '8px 16px', borderRadius: '6px', background: '#3b82f6', border: 'none', color: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: '0.2s', boxShadow: '0 2px 4px rgba(59,130,246,0.3)' }} onMouseOver={e => e.currentTarget.style.background = '#2563eb'} onMouseOut={e => e.currentTarget.style.background = '#3b82f6'}>
                                                            Mark as Paid
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                                            <FiBriefcase size={40} style={{ opacity: 0.5, marginBottom: '12px' }} />
                                            <p style={{ margin: 0 }}>No payroll records found for this filter.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* PRINT ONLY SECTION - PAYSLIP */}
            {selectedPayslip && (
                <div className="print-only">
                    <div style={{ border: '1px solid #000', padding: '40px', borderRadius: '8px', maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #1e293b', paddingBottom: '20px', marginBottom: '30px' }}>
                            <div>
                                <h1 style={{ margin: '0 0 8px', color: '#90273c', fontSize: '28px', letterSpacing: '1px' }}>STYLE SUITE</h1>
                                <p style={{ margin: 0, color: '#475569', fontSize: '14px' }}>Official Salary Statement / Payslip</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <h2 style={{ margin: '0 0 5px', fontSize: '20px' }}>{selectedPayslip.month || 'N/A'}</h2>
                                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Date Paid: {selectedPayslip.paymentDate ? new Date(selectedPayslip.paymentDate).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', background: '#f8fafc', padding: '20px', borderRadius: '8px' }}>
                            <div>
                                <p style={{ margin: '0 0 5px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Employee Name</p>
                                <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{selectedPayslip.name}</p>
                            </div>
                            <div>
                                <p style={{ margin: '0 0 5px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Employee ID</p>
                                <p style={{ margin: 0, fontSize: '16px' }}>{selectedPayslip.empId}</p>
                            </div>
                            <div>
                                <p style={{ margin: '0 0 5px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Designation</p>
                                <p style={{ margin: 0, fontSize: '16px' }}>{selectedPayslip.role}</p>
                            </div>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
                            <thead>
                                <tr style={{ background: '#1e293b', color: '#fff' }}>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Earnings / Deductions</th>
                                    <th style={{ padding: '12px', textAlign: 'right' }}>Amount (BDT)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Base Salary</td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>৳ {(selectedPayslip.baseSalary || 0).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Delivery Commission / Allowances</td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', textAlign: 'right', color: '#10b981' }}>+ ৳ {(selectedPayslip.commission || 0).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Penalties / Deductions</td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', textAlign: 'right', color: '#ef4444' }}>- ৳ {(selectedPayslip.deduction || 0).toLocaleString()}</td>
                                </tr>
                                <tr style={{ background: '#f8fafc', fontWeight: 'bold', fontSize: '18px' }}>
                                    <td style={{ padding: '16px', borderTop: '2px solid #1e293b' }}>Net Payable Amount</td>
                                    <td style={{ padding: '16px', borderTop: '2px solid #1e293b', textAlign: 'right' }}>৳ {calculateNet(selectedPayslip).toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '80px' }}>
                            <div style={{ borderTop: '1px solid #000', width: '250px', textAlign: 'center', paddingTop: '8px', fontSize: '14px' }}>
                                Employer Signature
                            </div>
                            <div style={{ borderTop: '1px solid #000', width: '250px', textAlign: 'center', paddingTop: '8px', fontSize: '14px' }}>
                                Employee Signature
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}