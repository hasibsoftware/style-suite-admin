'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiRefreshCw, FiFileText, FiTruck, FiCheckCircle, FiAlertTriangle, FiMapPin, FiUser, FiPhone, FiDollarSign, FiClock, FiCornerUpLeft, FiBox } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';

export default function CourierPage() {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Pending Pickup');
    const [selectedShipment, setSelectedShipment] = useState(null);

    // Fetch Shipments directly from Firebase 'orders' collection
    useEffect(() => {
        const fetchShipments = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "orders"));
                let ordersList = querySnapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() }));
                
                const logisticsStatuses = ['Packed', 'Pending_Pickup', 'In_Transit', 'Out_for_Delivery', 'Delivered', 'Delivery_Issue', 'Return_Pending', 'Returned'];
                let shipmentsList = ordersList.filter(o => logisticsStatuses.includes(o.status));
                
                if (shipmentsList.length === 0) {
                    toast.loading("Initializing Standard Logistics Data...", { id: 'initC' });
                    const dummyShipments = [
                        { orderId: '#4227', customerName: 'Rahim Ahmed', itemsText: '1x Jamdani Saree (Red)', totalAmount: '৳ 4,500', status: 'In_Transit', courier: 'Steadfast', trackingId: 'STEAD-908123', phone: '01711000000', address: 'Dhanmondi 27, Dhaka', date: new Date().toISOString(), riderName: 'Sujon Mia', riderPhone: '01999112233', remittanceStatus: 'Pending' },
                        { orderId: '#4228', customerName: 'Sumaiya Akter', itemsText: '2x Katan Silk (Blue)', totalAmount: '৳ 9,200', status: 'Pending_Pickup', courier: 'Pathao', trackingId: 'PATH-882190', phone: '01811000000', address: 'Mirpur 10, Dhaka', date: new Date().toISOString(), riderName: 'Unassigned', riderPhone: 'N/A', remittanceStatus: 'Pending' },
                        { orderId: '#4229', customerName: 'Tanvir Hasan', itemsText: '2x Cotton Saree (White)', totalAmount: '৳ 3,800', status: 'Delivered', courier: 'RedX', trackingId: 'REDX-773210', phone: '01911000000', address: 'Uttara, Dhaka', date: new Date(Date.now() - 86400000).toISOString(), riderName: 'Kamrul Hasan', riderPhone: '01666778899', remittanceStatus: 'Collected' },
                    ];
                    
                    const newlyAdded = [];
                    for (const ship of dummyShipments) {
                        const docRef = await addDoc(collection(db, "orders"), ship);
                        newlyAdded.push({ firebaseId: docRef.id, ...ship });
                    }
                    shipmentsList = newlyAdded;
                    toast.success("Data Ready!", { id: 'initC' });
                }
                
                setShipments(shipmentsList.sort((a, b) => new Date(b.date) - new Date(a.date)));
            } catch (error) {
                toast.error("Failed to load shipments!");
            } finally {
                setLoading(false);
            }
        };
        fetchShipments();
    }, []);

    const parseCurrency = (str) => {
        if (!str) return 0;
        const num = parseInt(str.toString().replace(/[^0-9]/g, ''));
        return isNaN(num) ? 0 : num;
    };

    // KPIs Calculation
    const inTransitCount = shipments.filter(s => ['In_Transit', 'Out_for_Delivery'].includes(s.status)).length;
    const deliveredCount = shipments.filter(s => s.status === 'Delivered').length;
    const codPendingValue = shipments
        .filter(s => s.status === 'Delivered' && s.remittanceStatus !== 'Collected')
        .reduce((sum, s) => sum + parseCurrency(s.totalAmount), 0);

    const getCourierStyle = (courier) => {
        const c = courier ? courier.toLowerCase() : '';
        if (c === 'pathao') return { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' }; 
        if (c === 'steadfast') return { bg: '#dcfce7', text: '#16a34a', border: '#86efac' }; 
        if (c === 'redx') return { bg: '#ffedd5', text: '#ea580c', border: '#fdba74' }; 
        return { bg: '#f8fafc', text: '#94a3b8', border: '#e2e8f0' };
    };

    const getStatusText = (status) => {
        const map = {
            'Packed': 'Ready for Pickup',
            'Pending_Pickup': 'Pending Pickup',
            'In_Transit': 'In Transit',
            'Out_for_Delivery': 'Out for Delivery',
            'Delivered': 'Delivered',
            'Delivery_Issue': 'Delivery Issue',
            'Return_Pending': 'Return Initiated',
            'Returned': 'Returned'
        };
        return map[status] || status;
    };

    const getStatusColor = (status) => {
        if (['Delivered'].includes(status)) return '#10b981';
        if (['Delivery_Issue', 'Return_Pending', 'Returned'].includes(status)) return '#ef4444';
        if (['Pending_Pickup', 'Packed'].includes(status)) return '#f59e0b';
        return '#3b82f6';
    };

    // Filtering Logic
    const displayShipments = shipments.filter(s => {
        let matchesTab = true;
        if (activeTab === 'Active Shipments') matchesTab = ['In_Transit', 'Out_for_Delivery'].includes(s.status);
        if (activeTab === 'Pending Pickup') matchesTab = ['Packed', 'Pending_Pickup'].includes(s.status);
        if (activeTab === 'Delivered') matchesTab = s.status === 'Delivered';
        if (activeTab === 'Issues') matchesTab = s.status === 'Delivery_Issue';
        if (activeTab === 'Returned') matchesTab = ['Return_Pending', 'Returned'].includes(s.status);

        const safeTrackingId = s.trackingId || '';
        const safeOrderId = s.orderId || '';
        const safeCustomerName = s.customerName || '';

        const matchesSearch = safeTrackingId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              safeOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              safeCustomerName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const handleInitiateReturn = async (shipment) => {
        if (!confirm(`Are you sure you want to recall/return Order ${shipment.orderId}?`)) return;
        
        try {
            const orderRef = doc(db, "orders", shipment.firebaseId);
            await updateDoc(orderRef, { status: 'Return_Pending' });
            
            await addDoc(collection(db, "activity_logs"), {
                action: `Order ${shipment.orderId} marked for Return from Courier panel.`,
                timestamp: new Date().toISOString()
            });

            setShipments(shipments.map(s => s.firebaseId === shipment.firebaseId ? { ...s, status: 'Return_Pending' } : s));
            setSelectedShipment({ ...shipment, status: 'Return_Pending' });
            toast.success("Return initiated. Moved to Returns Queue.");
        } catch (error) {
            toast.error("Failed to initiate return.");
        }
    };

    const handlePrintManifest = () => {
        const pickups = shipments.filter(s => ['Packed', 'Pending_Pickup'].includes(s.status));
        if (pickups.length === 0) {
            toast.error("No pending pickups to generate manifest!");
            return;
        }
        setTimeout(() => {
            window.print();
        }, 500);
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; padding: 20px; font-family: Arial, sans-serif; }
                    body { background: white !important; }
                    @page { margin: 1cm; }
                }
                @media screen {
                    .print-only { display: none !important; }
                }
            `}} />

            <div className="no-print" style={{ padding: '0 20px 20px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
                <Toaster position="top-right" />

                {/* Header & Main Stats */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div>
                        <h2 style={{ margin: '0 0 5px', fontSize: '20px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FiTruck style={{ color: '#90273c' }} /> Courier & Logistics
                        </h2>
                        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Manage shipments, track parcels live, handle CODs and monitor success rates.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={() => window.location.reload()} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #cbd5e0', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#1e293b', cursor: 'pointer' }}>
                            <FiRefreshCw /> Sync Status
                        </button>
                        <button onClick={handlePrintManifest} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1e293b', border: 'none', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#fff', cursor: 'pointer' }}>
                            <FiFileText /> Generate Manifest
                        </button>
                    </div>
                </div>

                {/* KPIs / Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
                    <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Total In Transit</p>
                            <h3 style={{ margin: 0, fontSize: '28px', color: '#3b82f6' }}>{inTransitCount}</h3>
                        </div>
                        <div style={{ background: '#e0f2fe', padding: '12px', borderRadius: '50%' }}><FiTruck size={24} color="#0284c7" /></div>
                    </div>
                    <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Delivered Packages</p>
                            <h3 style={{ margin: 0, fontSize: '28px', color: '#10b981' }}>{deliveredCount}</h3>
                        </div>
                        <div style={{ background: '#dcfce7', padding: '12px', borderRadius: '50%' }}><FiCheckCircle size={24} color="#16a34a" /></div>
                    </div>
                    <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Pending COD Amount</p>
                            <h3 style={{ margin: 0, fontSize: '28px', color: '#ea580c' }}>৳ {codPendingValue.toLocaleString()}</h3>
                        </div>
                        <div style={{ background: '#ffedd5', padding: '12px', borderRadius: '50%' }}><FiDollarSign size={24} color="#ea580c" /></div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    
                    {/* LEFT: Shipment Directory */}
                    <div style={{ flex: '0 0 45%', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 280px)' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                {['Active Shipments', 'Pending Pickup', 'Delivered', 'Issues', 'Returned'].map(tab => (
                                    <button 
                                        key={tab} onClick={() => {setActiveTab(tab); setSelectedShipment(null);}} 
                                        style={{ padding: '8px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: 'none', background: activeTab === tab ? '#1e293b' : '#e2e8f0', color: activeTab === tab ? '#fff' : '#475569', transition: '0.2s' }}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #cbd5e0', borderRadius: '8px', padding: '8px 12px' }}>
                                <FiSearch style={{ color: '#94a3b8', marginRight: '8px' }} />
                                <input type="text" placeholder="Search Tracking ID, Order ID or Customer..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px', color: '#1e293b' }} />
                            </div>
                        </div>

                        <div style={{ overflowY: 'auto', padding: '16px' }}>
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Loading shipments...</div>
                            ) : displayShipments.length > 0 ? displayShipments.map(ship => {
                                const isSelected = selectedShipment?.firebaseId === ship.firebaseId;
                                const courierStyle = getCourierStyle(ship.courier);
                                const statusColor = getStatusColor(ship.status);
                                
                                return (
                                    <div 
                                        key={ship.firebaseId} onClick={() => setSelectedShipment(ship)}
                                        style={{ 
                                            padding: '16px', marginBottom: '12px', borderRadius: '8px', cursor: 'pointer', transition: '0.2s',
                                            background: isSelected ? '#f8fafc' : '#fff', border: `1px solid ${isSelected ? '#1e293b' : '#e2e8f0'}`,
                                            borderLeft: `4px solid ${courierStyle.border}`
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <h4 style={{ margin: 0, fontSize: '14px', color: '#1e293b', fontWeight: '700' }}>{ship.trackingId || 'Pending ID'}</h4>
                                            <span style={{ fontSize: '12px', fontWeight: '600', color: statusColor }}>{getStatusText(ship.status)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                                                {ship.courier ? (
                                                     <span style={{ background: courierStyle.bg, color: courierStyle.text, padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', marginRight: '6px' }}>{ship.courier}</span>
                                                ) : (
                                                    <span style={{ background: '#f8fafc', color: '#94a3b8', border: '1px solid #e2e8f0', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', marginRight: '6px' }}>Unassigned</span>
                                                )}
                                                Order: {ship.orderId}
                                            </p>
                                        </div>
                                    </div>
                                )
                            }) : (
                                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                                    <FiBox size={40} style={{ opacity: 0.5, marginBottom: '12px' }} />
                                    <p>No shipments found in this category.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Live Tracking Details */}
                    <div style={{ flex: '0 0 calc(55% - 24px)', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 280px)' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                Live Tracking Details
                            </h3>
                            {selectedShipment && selectedShipment.courier ? (
                                <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: '12px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none' }}>
                                    View at {selectedShipment.courier} ↗
                                </a>
                            ) : selectedShipment ? (
                                <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8' }}>No Courier Assigned</span>
                            ) : null}
                        </div>

                        {selectedShipment ? (
                            <div style={{ padding: '24px', overflowY: 'auto', flexGrow: 1 }}>
                                
                                {/* Visual Progress Bar */}
                                <div style={{ marginBottom: '32px', position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                                        {['Pickup', 'In Transit', 'Delivery', 'Completed'].map((step, idx) => {
                                            let isActive = false;
                                            const s = selectedShipment.status;
                                            if (idx === 0) isActive = true;
                                            if (idx === 1 && !['Packed', 'Pending_Pickup'].includes(s)) isActive = true;
                                            if (idx === 2 && ['Out_for_Delivery', 'Delivered', 'Returned'].includes(s)) isActive = true;
                                            if (idx === 3 && ['Delivered', 'Returned'].includes(s)) isActive = true;

                                            return (
                                                <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: isActive ? '#10b981' : '#e2e8f0', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '8px', zIndex: 2, border: '4px solid #fff' }}>
                                                        {isActive && <FiCheckCircle size={14} />}
                                                    </div>
                                                    <span style={{ fontSize: '11px', fontWeight: '600', color: isActive ? '#1e293b' : '#94a3b8' }}>{step}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div style={{ position: 'absolute', top: '12px', left: '12%', right: '12%', height: '2px', background: '#e2e8f0', zIndex: 0 }}>
                                        <div style={{ height: '100%', background: '#10b981', width: ['Delivered', 'Returned'].includes(selectedShipment.status) ? '100%' : ['Out_for_Delivery'].includes(selectedShipment.status) ? '66%' : ['In_Transit'].includes(selectedShipment.status) ? '33%' : '0%', transition: '1s' }}></div>
                                    </div>
                                </div>

                                {/* Order & Courier Info Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <div>
                                        <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Tracking ID</p>
                                        <p style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#1e293b' }}>{selectedShipment.trackingId || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Courier Partner</p>
                                        <p style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#1e293b' }}>{selectedShipment.courier || 'Unassigned'}</p>
                                    </div>
                                    <div>
                                        <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Customer</p>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#1e293b' }}>{selectedShipment.customerName || 'N/A'}</p>
                                        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}><FiPhone size={10}/> {selectedShipment.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Destination</p>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#1e293b' }}>{selectedShipment.address || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* COD & Rider Info */}
                                <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
                                    <div style={{ flex: 1, border: '1px solid #cbd5e0', padding: '16px', borderRadius: '8px' }}>
                                        <h4 style={{ margin: '0 0 12px', fontSize: '13px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}><FiDollarSign /> COD Finance</h4>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                            <span style={{ color: '#64748b' }}>Collect Amount:</span>
                                            <strong style={{ color: '#1e293b' }}>{selectedShipment.totalAmount || '৳ 0'}</strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                            <span style={{ color: '#64748b' }}>Remittance:</span>
                                            <strong style={{ color: selectedShipment.remittanceStatus === 'Collected' ? '#10b981' : '#ea580c' }}>{selectedShipment.remittanceStatus || 'Pending'}</strong>
                                        </div>
                                    </div>
                                    <div style={{ flex: 1, border: '1px solid #cbd5e0', padding: '16px', borderRadius: '8px' }}>
                                        <h4 style={{ margin: '0 0 12px', fontSize: '13px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}><FiUser /> Rider Details</h4>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                            <span style={{ color: '#64748b' }}>Name:</span>
                                            <strong style={{ color: '#1e293b' }}>{selectedShipment.riderName || 'Unassigned'}</strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                            <span style={{ color: '#64748b' }}>Phone:</span>
                                            <strong style={{ color: '#1e293b' }}>{selectedShipment.riderPhone || 'N/A'}</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Tracking History Timeline */}
                                <div style={{ marginBottom: '32px' }}>
                                    <h4 style={{ margin: '0 0 16px', fontSize: '15px', color: '#1e293b' }}>Tracking History</h4>
                                    
                                    <div style={{ borderLeft: '2px solid #e2e8f0', marginLeft: '10px', paddingLeft: '20px', position: 'relative' }}>
                                        {['Delivered', 'Returned'].includes(selectedShipment.status) && (
                                            <div style={{ marginBottom: '20px', position: 'relative' }}>
                                                <div style={{ position: 'absolute', left: '-27px', top: '2px', background: '#fff', borderRadius: '50%' }}>
                                                    <FiCheckCircle size={14} color="#10b981" />
                                                </div>
                                                <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Parcel {selectedShipment.status === 'Delivered' ? 'Delivered to Customer' : 'Returned to Hub'}</p>
                                                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Updated recently</p>
                                            </div>
                                        )}
                                        
                                        {['In_Transit', 'Out_for_Delivery', 'Delivered', 'Returned', 'Delivery_Issue'].includes(selectedShipment.status) && (
                                            <div style={{ marginBottom: '20px', position: 'relative' }}>
                                                <div style={{ position: 'absolute', left: '-27px', top: '2px', background: '#fff', borderRadius: '50%' }}>
                                                    <FiMapPin size={14} color="#3b82f6" />
                                                </div>
                                                <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Parcel in Transit to Destination</p>
                                                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Processed at Logistics Hub</p>
                                            </div>
                                        )}

                                        <div style={{ position: 'relative' }}>
                                            <div style={{ position: 'absolute', left: '-27px', top: '2px', background: '#fff', borderRadius: '50%' }}>
                                                <FiClock size={14} color="#94a3b8" />
                                            </div>
                                            <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Order Packed & Label Printed</p>
                                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{selectedShipment.date ? new Date(selectedShipment.date).toLocaleString() : 'Date N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                {!['Delivered', 'Returned', 'Return_Pending'].includes(selectedShipment.status) && (
                                    <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                                        <button style={{ flex: 1, background: '#fff', color: '#475569', border: '1px solid #cbd5e0', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                            <FiAlertTriangle /> Report Issue
                                        </button>
                                        <button onClick={() => handleInitiateReturn(selectedShipment)} style={{ flex: 1, background: '#fff0f2', color: '#ef4444', border: '1px solid #fca5a5', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                            <FiCornerUpLeft /> Initiate Return
                                        </button>
                                    </div>
                                )}
                                
                                {selectedShipment.status === 'Return_Pending' && (
                                    <div style={{ padding: '12px', background: '#fffbeb', border: '1px solid #fcd34d', color: '#b45309', borderRadius: '8px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
                                        Return Initiated. Check Returns Module.
                                    </div>
                                )}

                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                                <FiTruck size={60} style={{ opacity: 0.3, marginBottom: '16px' }} />
                                <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: '#475569' }}>No Shipment Selected</h3>
                                <p style={{ margin: 0, fontSize: '14px' }}>Select a parcel from the directory to view live tracking.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* PRINT ONLY SECTION - MANIFEST */}
            <div className="print-only">
                <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '20px' }}>
                    <h1 style={{ margin: '0 0 5px' }}>STYLE SUITE</h1>
                    <h2 style={{ margin: '0 0 5px' }}>Daily Courier Handoff Manifest</h2>
                    <p style={{ margin: 0 }}>Date: {new Date().toLocaleDateString()} | Time: {new Date().toLocaleTimeString()}</p>
                </div>
                
                <h3 style={{ marginBottom: '10px' }}>Parcels to Handover:</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Order ID</th>
                            <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Customer</th>
                            <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Courier</th>
                            <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Tracking ID</th>
                            <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>COD Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shipments.filter(s => ['Packed', 'Pending_Pickup'].includes(s.status)).map(s => (
                            <tr key={s.firebaseId}>
                                <td style={{ border: '1px solid #000', padding: '8px' }}>{s.orderId}</td>
                                <td style={{ border: '1px solid #000', padding: '8px' }}>{s.customerName || 'N/A'}<br/><small>{s.phone || ''}</small></td>
                                <td style={{ border: '1px solid #000', padding: '8px' }}>{s.courier || 'N/A'}</td>
                                <td style={{ border: '1px solid #000', padding: '8px' }}>{s.trackingId || 'N/A'}</td>
                                <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>{s.totalAmount || '৳ 0'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px' }}>
                    <div style={{ borderTop: '1px solid #000', width: '250px', textAlign: 'center', paddingTop: '5px' }}>
                        Authorized Signature (Style Suite)
                    </div>
                    <div style={{ borderTop: '1px solid #000', width: '250px', textAlign: 'center', paddingTop: '5px' }}>
                        Courier Agent Signature
                    </div>
                </div>
            </div>
        </>
    );
}