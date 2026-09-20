'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiPackage, FiCheckCircle, FiTruck, FiPrinter, FiMaximize, FiCheckSquare, FiSquare, FiAlertCircle } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import Barcode from 'react-barcode';

export default function PackingPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [timeFilter, setTimeFilter] = useState('Today');
    
    // Workbench States
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [barcodeInput, setBarcodeInput] = useState('');
    const [barcodeVerified, setBarcodeVerified] = useState(false);
    const [checklist, setChecklist] = useState({ polybag: false, thankYouCard: false, giftBox: false });
    const [isPacking, setIsPacking] = useState(false);
    
    // Print State
    const [printMode, setPrintMode] = useState(null);

    const timeFilters = ['Today', 'Yesterday', 'Last 7', 'Last 30', 'All Time'];

    const pendingToPack = orders.filter(o => o.status === 'Pending' || o.status === 'Review').length;
    const packedToday = orders.filter(o => o.status === 'Packed' && isToday(o.date)).length;
    const dispatched = orders.filter(o => o.status === 'Delivery').length;

    function isToday(dateStr) {
        const today = new Date();
        const date = new Date(dateStr);
        return date.setHours(0,0,0,0) === today.setHours(0,0,0,0);
    }

    const parseCurrency = (str) => {
        if (!str) return 0;
        const num = parseInt(str.replace(/[^0-9]/g, ''));
        return isNaN(num) ? 0 : num;
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "orders"));
                const ordersList = querySnapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() }));
                
                if (ordersList.length === 0) {
                    toast.loading("Uploading sample data to Firebase...", { id: 'initData' });
                    const dummyOrders = [
                        { orderId: '#4227', customerName: 'Rahim Ahmed', itemsText: '2x Jamdani Saree (Red)', totalAmount: '৳ 3,500', status: 'Pending', courier: 'Pathao', address: 'Mirpur, Dhaka', phone: '01711000000', date: new Date().toISOString() },
                        { orderId: '#4228', customerName: 'Sumaiya Akter', itemsText: '1x Katan Silk (Blue)', totalAmount: '৳ 7,200', status: 'Review', courier: 'Steadfast', address: 'Dhanmondi, Dhaka', phone: '01811000000', date: new Date().toISOString() },
                        { orderId: '#4229', customerName: 'Tanvir Hasan', itemsText: '1x Cotton Saree (White)', totalAmount: '৳ 1,800', status: 'Pending', courier: 'RedX', address: 'Uttara, Dhaka', phone: '01911000000', date: new Date(Date.now() - 86400000).toISOString() }, 
                        { orderId: '#4230', customerName: 'Sadia Islam', itemsText: '3x Georgette (Black)', totalAmount: '৳ 2,500', status: 'Packed', courier: 'Pathao', address: 'Gulshan, Dhaka', phone: '01611000000', date: new Date().toISOString() },
                    ];
                    
                    const newlyAddedOrders = [];
                    for (const order of dummyOrders) {
                        const docRef = await addDoc(collection(db, "orders"), order);
                        newlyAddedOrders.push({ firebaseId: docRef.id, ...order });
                    }
                    
                    toast.success("Database initialized!", { id: 'initData' });
                    setOrdersList(newlyAddedOrders);
                } else {
                    setOrdersList(ordersList);
                }
            } catch (error) {
                toast.error("Failed to load or save orders! Check Firebase rules.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const setOrdersList = (list) => {
        list.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(list);
    };

    const handleSelectOrder = (order) => {
        setSelectedOrder(order);
        setChecklist({ polybag: false, thankYouCard: false, giftBox: false });
        setBarcodeInput('');
        setBarcodeVerified(false);
    };

    const toggleChecklist = (item) => {
        setChecklist(prev => ({ ...prev, [item]: !prev[item] }));
    };

    const handleBarcodeScan = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (barcodeInput.trim().replace('#', '') === selectedOrder.orderId.replace('#', '')) {
                setBarcodeVerified(true);
                toast.success('Barcode Match! Order Verified.');
            } else {
                setBarcodeVerified(false);
                toast.error('Barcode Mismatch! Wrong Order.');
            }
        }
    };

    const handlePrint = (type) => {
        if (!selectedOrder) return;
        setPrintMode(type);
        toast.success(`Preparing ${type === 'invoice' ? 'Invoice' : 'Shipping Label'}...`);
        
        setTimeout(() => {
            window.print();
            setPrintMode(null);
        }, 500);
    };

    const handleCompletePacking = async () => {
        if (!selectedOrder) return;
        
        // 🔴 Update: Polybag OR Premium Box must be selected
        if (!checklist.polybag && !checklist.giftBox) {
            toast.error("Please confirm packaging (Polybag or Premium Box)!");
            return;
        }

        setIsPacking(true);
        try {
            const orderRef = doc(db, "orders", selectedOrder.firebaseId);
            await updateDoc(orderRef, { status: 'Packed' });

            await addDoc(collection(db, "activity_logs"), {
                action: `Order ${selectedOrder.orderId} packed and ready for dispatch.`,
                timestamp: new Date().toISOString()
            });

            setOrders(orders.map(o => o.firebaseId === selectedOrder.firebaseId ? { ...o, status: 'Packed' } : o));
            setSelectedOrder({ ...selectedOrder, status: 'Packed' });
            
            toast.success("Order Packed Successfully!");
            
            setTimeout(() => {
                setSelectedOrder(null);
            }, 2000);

        } catch (error) {
            console.error("Firebase Update Error:", error);
            toast.error("Failed to update packing status in database.");
        } finally {
            setIsPacking(false);
        }
    };

    const getCourierStyle = (courier) => {
        const c = courier?.toLowerCase();
        if (c === 'pathao') return { bg: '#fee2e2', text: '#dc2626' }; 
        if (c === 'steadfast') return { bg: '#dcfce7', text: '#16a34a' }; 
        if (c === 'redx') return { bg: '#ffedd5', text: '#ea580c' }; 
        return { bg: '#f1f5f9', text: '#475569' };
    };

    const activeQueue = orders.filter(o => {
        const matchesStatus = o.status === 'Pending' || o.status === 'Review';
        const matchesSearch = o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || o.itemsText.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesTime = true;
        if (timeFilter === 'Today') matchesTime = isToday(o.date);
        
        return matchesStatus && matchesSearch && matchesTime;
    });

    const totalAmountNum = selectedOrder ? parseCurrency(selectedOrder.totalAmount) : 0;
    const shippingFee = 100;
    const subtotal = totalAmountNum - shippingFee;

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    body { background: white !important; margin: 0; padding: 0; }
                    @page { margin: 1cm; }
                }
                @media screen {
                    .print-only { display: none !important; }
                }
            `}} />

            <div className="no-print" style={{ padding: '0 20px 20px', background: '#f8fafc', minHeight: '100vh' }}>
                <Toaster position="top-right" />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
                    <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ background: '#ffedd5', color: '#ea580c', padding: '12px', borderRadius: '50%' }}><FiPackage size={24} /></div>
                        <div>
                            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>PENDING TO PACK</p>
                            <h3 style={{ margin: 0, fontSize: '24px', color: '#1e293b' }}>{pendingToPack}</h3>
                        </div>
                    </div>
                    <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ background: '#dcfce7', color: '#16a34a', padding: '12px', borderRadius: '50%' }}><FiCheckCircle size={24} /></div>
                        <div>
                            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>PACKED TODAY</p>
                            <h3 style={{ margin: 0, fontSize: '24px', color: '#1e293b' }}>{packedToday}</h3>
                        </div>
                    </div>
                    <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '12px', borderRadius: '50%' }}><FiTruck size={24} /></div>
                        <div>
                            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>DISPATCHED</p>
                            <h3 style={{ margin: 0, fontSize: '24px', color: '#1e293b' }}>{dispatched}</h3>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    
                    {/* LEFT: Active Packing Queue */}
                    <div style={{ flex: '0 0 40%', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                            <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#1e293b' }}>Active Packing Queue</h3>
                            
                            <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #cbd5e0', borderRadius: '8px', padding: '8px 12px', marginBottom: '16px' }}>
                                <FiSearch style={{ color: '#94a3b8', marginRight: '8px' }} />
                                <input type="text" placeholder="Search order ID or item..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px', color: '#1e293b', fontWeight: '500', background: 'transparent' }} />
                            </div>

                            <div style={{ display: 'flex', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                                {timeFilters.map((tf) => (
                                    <button key={tf} onClick={() => setTimeFilter(tf)}
                                        style={{
                                            flex: 1, background: timeFilter === tf ? '#90273c' : 'transparent', color: timeFilter === tf ? '#fff' : '#475569',
                                            border: 'none', padding: '6px 0', fontSize: '12px', fontWeight: '600', cursor: 'pointer', borderRight: '1px solid #e2e8f0'
                                        }}
                                    >
                                        {tf}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ overflowY: 'auto', padding: '12px' }}>
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Loading queue...</div>
                            ) : activeQueue.length > 0 ? activeQueue.map(order => {
                                const isSelected = selectedOrder?.firebaseId === order.firebaseId;
                                const courierStyle = getCourierStyle(order.courier);
                                
                                return (
                                    <div 
                                        key={order.firebaseId} onClick={() => handleSelectOrder(order)}
                                        style={{ 
                                            padding: '16px', marginBottom: '12px', borderRadius: '8px', cursor: 'pointer', transition: '0.2s',
                                            background: isSelected ? '#fff0f2' : '#fff', border: `1px solid ${isSelected ? '#90273c' : '#e2e8f0'}`,
                                            boxShadow: isSelected ? '0 4px 12px rgba(144, 39, 60, 0.1)' : 'none'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <div>
                                                <h4 style={{ margin: '0 0 4px', fontSize: '14px', color: '#1e293b' }}>{order.itemsText}</h4>
                                                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Order: <span style={{ color: '#ef4444', fontWeight: '600' }}>{order.orderId}</span> • {order.customerName}</p>
                                            </div>
                                            <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', background: '#ffedd5', color: '#ea580c' }}>Pending</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: '700', background: courierStyle.bg, color: courierStyle.text, padding: '2px 8px', borderRadius: '4px' }}>{order.courier || 'Courier'}</span>
                                            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>Click to pack</span>
                                        </div>
                                    </div>
                                )
                            }) : (
                                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                                    <FiCheckCircle size={40} style={{ opacity: 0.5, marginBottom: '12px' }} />
                                    <p>No pending orders for {timeFilter}. All caught up!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Packing Workbench */}
                    <div style={{ flex: '0 0 calc(60% - 24px)', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiMaximize style={{ color: '#90273c' }} /> Packing Workbench
                            </h3>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#3b82f6', background: '#e0f2fe', padding: '4px 10px', borderRadius: '20px' }}>Express Mode</span>
                        </div>

                        {selectedOrder ? (
                            <div style={{ padding: '24px', overflowY: 'auto', flexGrow: 1 }}>
                                
                                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #cbd5e0', paddingBottom: '16px', marginBottom: '16px' }}>
                                        <div>
                                            <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>SELECTED ORDER</p>
                                            <h2 style={{ margin: 0, fontSize: '20px', color: '#ef4444' }}>{selectedOrder.orderId}</h2>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>COURIER PARTNER</p>
                                            <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{selectedOrder.courier || 'N/A'}</span>
                                        </div>
                                    </div>
                                    
                                    <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#1e293b' }}><strong>Customer:</strong> {selectedOrder.customerName} ({selectedOrder.phone})</p>
                                    <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#1e293b' }}><strong>Items to Pack:</strong> <span style={{ color: '#90273c', fontWeight: '600' }}>{selectedOrder.itemsText}</span></p>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#475569' }}><strong>Address:</strong> {selectedOrder.address}</p>
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', margin: '0 0 8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Scan Item Barcode for Verification</label>
                                    <div style={{ display: 'flex', alignItems: 'center', background: barcodeVerified ? '#ecfdf5' : '#fff', border: `2px solid ${barcodeVerified ? '#10b981' : '#3b82f6'}`, borderRadius: '8px', padding: '12px', transition: '0.3s' }}>
                                        <FiMaximize style={{ color: barcodeVerified ? '#10b981' : '#3b82f6', marginRight: '10px', fontSize: '20px' }} />
                                        <input 
                                            type="text" autoFocus placeholder="Scan barcode..." 
                                            value={barcodeInput} onChange={e => setBarcodeInput(e.target.value)} 
                                            onKeyDown={handleBarcodeScan}
                                            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', color: '#1e293b', fontWeight: '700', background: 'transparent' }} 
                                        />
                                        {barcodeVerified && <FiCheckCircle color="#10b981" size={20} />}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '32px' }}>
                                    <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>Packaging Materials Checklist</p>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <div onClick={() => toggleChecklist('polybag')} style={{ flex: 1, padding: '12px', border: `1px solid ${checklist.polybag ? '#10b981' : '#cbd5e0'}`, background: checklist.polybag ? '#ecfdf5' : '#fff', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {checklist.polybag ? <FiCheckSquare size={18} color="#10b981" /> : <FiSquare size={18} color="#94a3b8" />}
                                            <span style={{ fontSize: '13px', fontWeight: '600', color: checklist.polybag ? '#065f46' : '#475569' }}>Polybag / Flyer</span>
                                        </div>
                                        <div onClick={() => toggleChecklist('thankYouCard')} style={{ flex: 1, padding: '12px', border: `1px solid ${checklist.thankYouCard ? '#10b981' : '#cbd5e0'}`, background: checklist.thankYouCard ? '#ecfdf5' : '#fff', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {checklist.thankYouCard ? <FiCheckSquare size={18} color="#10b981" /> : <FiSquare size={18} color="#94a3b8" />}
                                            <span style={{ fontSize: '13px', fontWeight: '600', color: checklist.thankYouCard ? '#065f46' : '#475569' }}>Thank You Card</span>
                                        </div>
                                        <div onClick={() => toggleChecklist('giftBox')} style={{ flex: 1, padding: '12px', border: `1px solid ${checklist.giftBox ? '#10b981' : '#cbd5e0'}`, background: checklist.giftBox ? '#ecfdf5' : '#fff', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {checklist.giftBox ? <FiCheckSquare size={18} color="#10b981" /> : <FiSquare size={18} color="#94a3b8" />}
                                            <span style={{ fontSize: '13px', fontWeight: '600', color: checklist.giftBox ? '#065f46' : '#475569' }}>Premium Box</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                                    <button onClick={() => handlePrint('invoice')} style={{ flex: 1, background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e0', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                        <FiPrinter /> Print Invoice
                                    </button>
                                    <button onClick={() => handlePrint('label')} style={{ flex: 1, background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e0', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                        <FiPrinter /> Print Shipping Label
                                    </button>
                                </div>

                                {selectedOrder.status !== 'Packed' ? (
                                    <button 
                                        onClick={handleCompletePacking} disabled={isPacking}
                                        style={{ width: '100%', background: '#10b981', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: isPacking ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)' }}
                                    >
                                        <FiCheckCircle size={18} /> {isPacking ? 'Processing...' : 'Mark as Packed & Complete'}
                                    </button>
                                ) : (
                                    <div style={{ width: '100%', background: '#ecfdf5', color: '#16a34a', border: '1px solid #a7f3d0', padding: '14px', borderRadius: '8px', fontSize: '15px', fontWeight: '700', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                        <FiCheckCircle size={18} /> Order Packed Successfully
                                    </div>
                                )}

                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                                <FiPackage size={60} style={{ opacity: 0.3, marginBottom: '16px' }} />
                                <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: '#475569' }}>No Order Selected</h3>
                                <p style={{ margin: 0, fontSize: '14px' }}>Select an order from the active queue to start packing.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* PRINT ONLY SECTION */}
            {selectedOrder && printMode && (
                <div className="print-only" style={{ width: '100%', backgroundColor: 'white', color: 'black', fontFamily: 'Arial, sans-serif' }}>
                    
                    {/* --- INVOICE LAYOUT --- */}
                    {printMode === 'invoice' && (
                        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #90273c', paddingBottom: '20px', marginBottom: '20px' }}>
                                <div>
                                    <h2 style={{ margin: 0, color: '#90273c', fontSize: '26px', fontWeight: 'bold' }}>STYLE SUITE</h2>
                                    <p style={{ margin: '5px 0 0', fontSize: '13px', color: '#64748b' }}>Premium Saree & Fashion House</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <h3 style={{ margin: '0 0 5px', fontSize: '20px', color: '#1e293b' }}>INVOICE</h3>
                                    <p style={{ margin: '2px 0', fontSize: '14px' }}><strong>Order ID:</strong> {selectedOrder.orderId}</p>
                                    <p style={{ margin: '2px 0', fontSize: '14px' }}><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                                <div style={{ flex: 1, padding: '15px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                    <h4 style={{ margin: '0 0 10px', color: '#90273c', fontSize: '14px', textTransform: 'uppercase' }}>Billed To:</h4>
                                    <p style={{ margin: '0 0 5px', fontSize: '15px', fontWeight: 'bold' }}>{selectedOrder.customerName}</p>
                                    <p style={{ margin: '0 0 5px', fontSize: '14px' }}>Phone: {selectedOrder.phone || 'N/A'}</p>
                                    <p style={{ margin: 0, fontSize: '14px' }}>Address: {selectedOrder.address}</p>
                                </div>
                                <div style={{ flex: 1, padding: '15px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                    <h4 style={{ margin: '0 0 10px', color: '#90273c', fontSize: '14px', textTransform: 'uppercase' }}>Shipping Info:</h4>
                                    <p style={{ margin: '0 0 5px', fontSize: '14px' }}><strong>Courier:</strong> {selectedOrder.courier || 'Express Delivery'}</p>
                                    <p style={{ margin: '0 0 5px', fontSize: '14px' }}><strong>Status:</strong> Packed / Ready</p>
                                    <p style={{ margin: 0, fontSize: '14px' }}><strong>Payment:</strong> Cash on Delivery (COD)</p>
                                </div>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                                <thead>
                                    <tr style={{ background: '#f1f5f9' }}>
                                        <th style={{ padding: '12px', border: '1px solid #cbd5e0', textAlign: 'left', fontSize: '14px' }}>Item Description</th>
                                        <th style={{ padding: '12px', border: '1px solid #cbd5e0', textAlign: 'center', fontSize: '14px' }}>Qty</th>
                                        <th style={{ padding: '12px', border: '1px solid #cbd5e0', textAlign: 'right', fontSize: '14px' }}>Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '12px', border: '1px solid #cbd5e0', fontSize: '14px' }}>{selectedOrder.itemsText}</td>
                                        <td style={{ padding: '12px', border: '1px solid #cbd5e0', textAlign: 'center', fontSize: '14px' }}>1</td>
                                        <td style={{ padding: '12px', border: '1px solid #cbd5e0', textAlign: 'right', fontSize: '14px' }}>৳ {subtotal.toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1, paddingRight: '40px' }}>
                                    <Barcode value={selectedOrder.orderId.replace('#', '')} height={40} fontSize={14} background="transparent" />
                                </div>
                                <div style={{ width: '300px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: '14px' }}>
                                        <span>Subtotal:</span>
                                        <span>৳ {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: '14px' }}>
                                        <span>Shipping Fee:</span>
                                        <span>৳ {shippingFee}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '2px solid #90273c', fontSize: '18px', fontWeight: 'bold', color: '#90273c' }}>
                                        <span>Total Due:</span>
                                        <span>{selectedOrder.totalAmount}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div style={{ marginTop: '50px', textAlign: 'center', fontSize: '12px', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                                <p>Thank you for shopping with Style Suite! This is a computer-generated invoice.</p>
                            </div>
                        </div>
                    )}

                    {/* --- SHIPPING LABEL LAYOUT --- */}
                    {printMode === 'label' && (
                        <div style={{ width: '400px', margin: '0 auto', border: '3px dashed #1e293b', padding: '20px', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '3px solid #1e293b', paddingBottom: '10px', marginBottom: '15px', fontWeight: '900', fontSize: '16px' }}>
                                <span>STYLE SUITE EXPRESS</span>
                                <span>COD</span>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                <Barcode value={selectedOrder.orderId.replace('#', '')} height={60} width={2} fontSize={16} font="monospace" />
                            </div>

                            <div style={{ borderBottom: '1px dashed #cbd5e0', paddingBottom: '15px', marginBottom: '15px' }}>
                                <span style={{ display: 'block', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', marginBottom: '5px' }}>Deliver To:</span>
                                <span style={{ display: 'block', fontSize: '18px', fontWeight: 'bold', marginBottom: '3px' }}>{selectedOrder.customerName}</span>
                                <span style={{ display: 'block', fontSize: '15px', marginBottom: '3px' }}>Phone: <strong>{selectedOrder.phone || 'N/A'}</strong></span>
                                <span style={{ display: 'block', fontSize: '14px', lineHeight: '1.4' }}>Address: {selectedOrder.address}</span>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <span style={{ display: 'block', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', marginBottom: '5px' }}>Package Info:</span>
                                <span style={{ display: 'block', fontSize: '14px', fontWeight: 'bold' }}>{selectedOrder.itemsText}</span>
                            </div>

                            <div style={{ background: '#1e293b', color: '#fff', textAlign: 'center', padding: '12px', borderRadius: '6px', fontSize: '20px', fontWeight: 'bold' }}>
                                COLLECT: {selectedOrder.totalAmount}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}