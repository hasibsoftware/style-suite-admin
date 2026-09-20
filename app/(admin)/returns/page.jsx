'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiRefreshCw, FiCheckCircle, FiXCircle, FiAlertTriangle, FiBox, FiDollarSign, FiMaximize } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';

export default function ReturnsPage() {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Pending');
    
    // Workbench States
    const [selectedReturn, setSelectedReturn] = useState(null);
    const [barcodeInput, setBarcodeInput] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [qualityGrade, setQualityGrade] = useState(''); // 'mint', 'damaged', 'wrong'
    const [refundAction, setRefundAction] = useState(''); // 'refund_bkash', 'store_credit', etc.
    const [isProcessing, setIsProcessing] = useState(false);

    // 🔴 Fetch Returns directly from Firebase 'orders' collection (Status: Return_Pending or Returned)
    useEffect(() => {
        const fetchReturns = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "orders"));
                let ordersList = querySnapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() }));
                
                // Filter orders that have return status
                let returnsList = ordersList.filter(o => o.status === 'Return_Pending' || o.status === 'Returned');
                
                // If no return orders exist in Firebase, initialize sample return orders
                if (returnsList.length === 0) {
                    toast.loading("Initializing Return Orders in Firebase...", { id: 'initRet' });
                    const dummyReturns = [
                        { orderId: '#4227', customerName: 'Rahim Ahmed', itemsText: '1x Jamdani Saree (Red)', returnReason: 'Size mismatch', totalAmount: '৳ 4,500', status: 'Return_Pending', condition: '', refundStatus: 'Pending', date: new Date().toISOString(), phone: '01711000000', address: 'Mirpur, Dhaka' },
                        { orderId: '#4228', customerName: 'Sumaiya Akter', itemsText: '2x Katan Silk (Blue)', returnReason: 'Changed mind', totalAmount: '৳ 9,200', status: 'Return_Pending', condition: '', refundStatus: 'Pending', date: new Date(Date.now() - 86400000).toISOString(), phone: '01811000000', address: 'Dhanmondi, Dhaka' },
                        { orderId: '#4229', customerName: 'Tanvir Hasan', itemsText: '2x Cotton Saree (White)', returnReason: 'Defective product', totalAmount: '৳ 3,800', status: 'Return_Pending', condition: '', refundStatus: 'Pending', date: new Date(Date.now() - 172800000).toISOString(), phone: '01911000000', address: 'Uttara, Dhaka' },
                    ];
                    
                    const newlyAdded = [];
                    for (const order of dummyReturns) {
                        const docRef = await addDoc(collection(db, "orders"), order);
                        newlyAdded.push({ firebaseId: docRef.id, ...order });
                    }
                    returnsList = newlyAdded;
                    toast.success("Return orders initialized!", { id: 'initRet' });
                }
                
                setReturns(returnsList.sort((a, b) => new Date(b.date) - new Date(a.date)));
            } catch (error) {
                toast.error("Failed to load returns data from database!");
            } finally {
                setLoading(false);
            }
        };
        fetchReturns();
    }, []);

    // Stats
    const pendingReturns = returns.filter(r => r.status === 'Return_Pending');
    const totalParcels = pendingReturns.length;
    const totalItems = pendingReturns.length * 1.5;

    const handleSelectReturn = (ret) => {
        setSelectedReturn(ret);
        setBarcodeInput('');
        setIsVerified(false);
        setQualityGrade('');
        setRefundAction('');
    };

    const handleBarcodeScan = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Match with orderId (e.g. #4227 or 4227)
            if (barcodeInput.trim().replace('#', '') === selectedReturn.orderId.replace('#', '')) {
                setIsVerified(true);
                toast.success('Parcel Verified! Proceed to Inspection.');
            } else {
                setIsVerified(false);
                toast.error('Invalid Order ID! Check the parcel barcode.');
            }
        }
    };

    const processReturn = async (actionType) => {
        if (!selectedReturn) return;
        if (actionType === 'Approve' && !qualityGrade) {
            toast.error("Please select a Quality Grade before approving!");
            return;
        }

        setIsProcessing(true);
        try {
            const finalStatus = actionType === 'Approve' ? 'Returned' : 'Return_Rejected';
            const orderRef = doc(db, "orders", selectedReturn.firebaseId);
            
            // 🔴 Update Status directly in Firebase 'orders' collection
            await updateDoc(orderRef, { 
                status: finalStatus,
                condition: qualityGrade,
                refundStatus: refundAction || 'N/A'
            });

            // Log activity
            await addDoc(collection(db, "activity_logs"), {
                action: `Order ${selectedReturn.orderId} Return ${actionType.toLowerCase()} (Condition: ${qualityGrade}).`,
                timestamp: new Date().toISOString()
            });

            setReturns(returns.map(r => r.firebaseId === selectedReturn.firebaseId ? { ...r, status: finalStatus, condition: qualityGrade } : r));
            setSelectedReturn(null);
            toast.success(`Return ${actionType} Successfully!`);

        } catch (error) {
            toast.error("Failed to update return status in database.");
        } finally {
            setIsProcessing(false);
        }
    };

    const displayReturns = returns.filter(r => {
        const matchesTab = activeTab === 'Pending' ? r.status === 'Return_Pending' : r.status !== 'Return_Pending';
        const matchesSearch = r.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || r.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div style={{ padding: '0 20px 20px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
            <Toaster position="top-right" />

            {/* Header & Main Stats */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div>
                    <h2 style={{ margin: '0 0 5px', fontSize: '20px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FiRefreshCw style={{ color: '#90273c' }} /> Returns & Restock Management
                    </h2>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Handle customer returns, inspect product quality, and seamlessly restock items.</p>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #cbd5e0', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#1e293b', cursor: 'pointer' }}>
                    <FiRefreshCw /> Sync Returns
                </button>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Total Pending Parcels</p>
                    <h3 style={{ margin: 0, fontSize: '28px', color: '#90273c' }}>{totalParcels}</h3>
                </div>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Est. Items to Inspect</p>
                    <h3 style={{ margin: 0, fontSize: '28px', color: '#1e293b' }}>~{Math.ceil(totalItems)}</h3>
                </div>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Today's Restock Value</p>
                    <h3 style={{ margin: 0, fontSize: '28px', color: '#16a34a' }}>৳ 0</h3>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                
                {/* LEFT: Returns Queue */}
                <div style={{ flex: '0 0 45%', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 280px)' }}>
                    
                    <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                            <button onClick={() => setActiveTab('Pending')} style={{ flex: 1, padding: '10px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', border: 'none', background: activeTab === 'Pending' ? '#90273c' : '#e2e8f0', color: activeTab === 'Pending' ? '#fff' : '#475569' }}>
                                Pending Returns ({pendingReturns.length})
                            </button>
                            <button onClick={() => setActiveTab('History')} style={{ flex: 1, padding: '10px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', border: 'none', background: activeTab === 'History' ? '#90273c' : '#e2e8f0', color: activeTab === 'History' ? '#fff' : '#475569' }}>
                                Returns History
                            </button>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #cbd5e0', borderRadius: '8px', padding: '8px 12px' }}>
                            <FiSearch style={{ color: '#94a3b8', marginRight: '8px' }} />
                            <input type="text" placeholder="Search Order ID or Customer..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px', color: '#1e293b' }} />
                        </div>
                    </div>

                    <div style={{ overflowY: 'auto', padding: '16px' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Loading returns...</div>
                        ) : displayReturns.length > 0 ? displayReturns.map(ret => {
                            const isSelected = selectedReturn?.firebaseId === ret.firebaseId;
                            
                            return (
                                <div 
                                    key={ret.firebaseId} onClick={() => activeTab === 'Pending' && handleSelectReturn(ret)}
                                    style={{ 
                                        padding: '16px', marginBottom: '12px', borderRadius: '8px', cursor: activeTab === 'Pending' ? 'pointer' : 'default', transition: '0.2s',
                                        background: isSelected ? '#fff0f2' : '#fff', border: `1px solid ${isSelected ? '#90273c' : '#e2e8f0'}`,
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <h4 style={{ margin: 0, fontSize: '14px', color: '#1e293b', fontWeight: '700' }}>Order: <span style={{ color: '#ef4444' }}>{ret.orderId}</span> <span style={{ color: '#64748b', fontWeight: '400' }}>— {ret.customerName}</span></h4>
                                        <span style={{ fontSize: '11px', fontWeight: '700', color: ret.status === 'Return_Pending' ? '#ea580c' : '#16a34a' }}>{ret.status === 'Return_Pending' ? 'Pending' : 'Processed'}</span>
                                    </div>
                                    <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#475569' }}>{ret.itemsText}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: '600' }}>Reason: {ret.returnReason}</span>
                                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{ret.totalAmount}</span>
                                    </div>
                                </div>
                            )
                        }) : (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                                <FiBox size={40} style={{ opacity: 0.5, marginBottom: '12px' }} />
                                <p>No returns found in this queue.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Verification & Quality Check Workbench */}
                <div style={{ flex: '0 0 calc(55% - 24px)', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 280px)' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Return Verification & Quality Check
                        </h3>
                        {selectedReturn && <span style={{ fontSize: '12px', fontWeight: '600', color: '#ef4444', background: '#fee2e2', padding: '4px 10px', borderRadius: '20px' }}>Inspection Required</span>}
                    </div>

                    {selectedReturn ? (
                        <div style={{ padding: '24px', overflowY: 'auto', flexGrow: 1 }}>
                            
                            {/* Basic Details */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', fontSize: '14px', color: '#475569' }}>
                                <div><strong style={{ display: 'block', marginBottom: '4px', color: '#1e293b' }}>Order ID:</strong> <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{selectedReturn.orderId}</span></div>
                                <div><strong style={{ display: 'block', marginBottom: '4px', color: '#1e293b' }}>Customer:</strong> {selectedReturn.customerName}</div>
                                <div><strong style={{ display: 'block', marginBottom: '4px', color: '#1e293b' }}>Phone:</strong> {selectedReturn.phone || 'N/A'}</div>
                                <div><strong style={{ display: 'block', marginBottom: '4px', color: '#1e293b' }}>Product Item:</strong> <span style={{ color: '#90273c', fontWeight: '600' }}>{selectedReturn.itemsText}</span></div>
                            </div>
                            
                            <div style={{ background: '#fff0f2', borderLeft: '4px solid #ef4444', padding: '12px 16px', borderRadius: '4px', marginBottom: '24px', fontSize: '14px', color: '#7f1d1d' }}>
                                <strong>Customer Reason:</strong> {selectedReturn.returnReason}
                            </div>

                            {/* STEP 1: Barcode Verification */}
                            <div style={{ marginBottom: '24px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                                <p style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>1. Verify Parcel (Scan Order Barcode)</p>
                                <div style={{ display: 'flex', alignItems: 'center', background: isVerified ? '#ecfdf5' : '#f8fafc', border: `2px solid ${isVerified ? '#10b981' : '#cbd5e0'}`, borderRadius: '6px', padding: '10px' }}>
                                    <FiMaximize style={{ color: isVerified ? '#10b981' : '#64748b', marginRight: '10px', fontSize: '18px' }} />
                                    <input 
                                        type="text" placeholder="Scan or Type Order ID (e.g. #4227)..." 
                                        value={barcodeInput} onChange={e => setBarcodeInput(e.target.value)} 
                                        onKeyDown={handleBarcodeScan} disabled={isVerified}
                                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', background: 'transparent', color: '#1e293b', fontWeight: '600' }} 
                                    />
                                    {isVerified && <FiCheckCircle color="#10b981" size={20} />}
                                </div>
                            </div>

                            {/* STEP 2: Quality Grading */}
                            <div style={{ marginBottom: '24px', opacity: isVerified ? 1 : 0.4, pointerEvents: isVerified ? 'auto' : 'none' }}>
                                <p style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>2. Product Quality Grading</p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                    <div onClick={() => setQualityGrade('mint')} style={{ padding: '12px', border: `2px solid ${qualityGrade === 'mint' ? '#10b981' : '#e2e8f0'}`, background: qualityGrade === 'mint' ? '#ecfdf5' : '#fff', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }}>
                                        <FiCheckCircle size={24} color={qualityGrade === 'mint' ? '#10b981' : '#94a3b8'} style={{ marginBottom: '8px' }} />
                                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>Mint Condition</div>
                                        <div style={{ fontSize: '11px', color: '#64748b' }}>Ready to restock</div>
                                    </div>
                                    <div onClick={() => setQualityGrade('damaged')} style={{ padding: '12px', border: `2px solid ${qualityGrade === 'damaged' ? '#ef4444' : '#e2e8f0'}`, background: qualityGrade === 'damaged' ? '#fef2f2' : '#fff', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }}>
                                        <FiAlertTriangle size={24} color={qualityGrade === 'damaged' ? '#ef4444' : '#94a3b8'} style={{ marginBottom: '8px' }} />
                                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>Damaged</div>
                                        <div style={{ fontSize: '11px', color: '#64748b' }}>Move to dead stock</div>
                                    </div>
                                    <div onClick={() => setQualityGrade('wrong')} style={{ padding: '12px', border: `2px solid ${qualityGrade === 'wrong' ? '#f59e0b' : '#e2e8f0'}`, background: qualityGrade === 'wrong' ? '#fffbeb' : '#fff', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }}>
                                        <FiXCircle size={24} color={qualityGrade === 'wrong' ? '#f59e0b' : '#94a3b8'} style={{ marginBottom: '8px' }} />
                                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>Wrong Item</div>
                                        <div style={{ fontSize: '11px', color: '#64748b' }}>Customer sent wrong</div>
                                    </div>
                                </div>
                            </div>

                            {/* STEP 3: Refund Action */}
                            {qualityGrade && (
                                <div style={{ marginBottom: '32px' }}>
                                    <p style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>3. Customer Resolution (Amount: {selectedReturn.totalAmount})</p>
                                    <select 
                                        value={refundAction} onChange={(e) => setRefundAction(e.target.value)}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none', color: '#1e293b', fontWeight: '500' }}
                                    >
                                        <option value="">Select an action...</option>
                                        {qualityGrade === 'mint' && <option value="refund_bkash">Initiate Refund (bKash/Bank)</option>}
                                        {qualityGrade === 'mint' && <option value="store_credit">Issue Store Credit</option>}
                                        {qualityGrade === 'damaged' && <option value="partial_refund">Partial Refund (Charge for damage)</option>}
                                        <option value="exchange">Process Exchange Request</option>
                                        {(qualityGrade === 'wrong' || qualityGrade === 'damaged') && <option value="reject">Reject Return (No Refund)</option>}
                                    </select>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '16px', opacity: isVerified && qualityGrade ? 1 : 0.4, pointerEvents: isVerified && qualityGrade ? 'auto' : 'none' }}>
                                <button 
                                    onClick={() => processReturn('Reject')} disabled={isProcessing}
                                    style={{ flex: 1, background: '#fff', color: '#ef4444', border: '1px solid #ef4444', padding: '14px', borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}
                                >
                                    Reject Return
                                </button>
                                <button 
                                    onClick={() => processReturn('Approve')} disabled={isProcessing || !refundAction}
                                    style={{ flex: 2, background: qualityGrade === 'mint' ? '#10b981' : '#f59e0b', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: refundAction ? 'pointer' : 'not-allowed', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                                >
                                    {isProcessing ? 'Processing...' : (qualityGrade === 'mint' ? <><FiCheckCircle size={18} /> Approve & Restock Item</> : <><FiAlertTriangle size={18} /> Process with Warning</>)}
                                </button>
                            </div>

                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                            <FiRefreshCw size={60} style={{ opacity: 0.3, marginBottom: '16px' }} />
                            <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: '#475569' }}>No Return Selected</h3>
                            <p style={{ margin: 0, fontSize: '14px' }}>Select a return request from the queue to start inspection.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}