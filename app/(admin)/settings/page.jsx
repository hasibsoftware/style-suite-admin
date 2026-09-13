'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import styles from '../dashboard.module.css';
import {
    FiSettings,
    FiBriefcase,
    FiTruck,
    FiBell,
    FiBox,
    FiDollarSign,
    FiDatabase,
    FiShield,
    FiCreditCard,
    FiLayout,
    FiFileText,
    FiUploadCloud,
    FiLock,
    FiKey,
    FiUserCheck,
    FiEye,
    FiEyeOff,
    FiX,
    FiSmartphone,
    FiCalendar,
    FiClock,
    FiPieChart,
    FiCheckCircle,
    FiPercent,
    FiPrinter,
    FiMail,
    FiMessageSquare
} from 'react-icons/fi';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('notifications'); // 'notifications' ট্যাব ডিফল্ট করা হলো

    // ================= Business Profile States =================
    const [logoPreview, setLogoPreview] = useState(null);
    const [companyName, setCompanyName] = useState('Smart Mess');
    const [tagline, setTagline] = useState('digital mess in your pocket');
    const [supportEmail, setSupportEmail] = useState('support@smartmess.com');
    const [phone, setPhone] = useState('+880 1700 000000');
    const [currency, setCurrency] = useState('BDT');
    const [address, setAddress] = useState('Dhaka, Bangladesh');
    const [businessErrors, setBusinessErrors] = useState({});
    const [isSavingBusiness, setIsSavingBusiness] = useState(false);

    // ================= Delivery & Courier States =================
    const [insideDhaka, setInsideDhaka] = useState('60');
    const [outsideDhaka, setOutsideDhaka] = useState('120');
    const [courierPartner, setCourierPartner] = useState('Pathao Courier');
    const [deliveryErrors, setDeliveryErrors] = useState({});
    const [isSavingDelivery, setIsSavingDelivery] = useState(false);

    // ================= Security & Roles States =================
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [securityErrors, setSecurityErrors] = useState({});
    const [isSavingSecurity, setIsSavingSecurity] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // 2FA States
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [isVerifying2FA, setIsVerifying2FA] = useState(false);

    // ================= Product Settings States =================
    const [skuPrefix, setSkuPrefix] = useState('SM-');
    const [lowStockAlert, setLowStockAlert] = useState('10');
    const [enableVariations, setEnableVariations] = useState(true);
    const [allowBackorders, setAllowBackorders] = useState(false);
    const [isSavingProducts, setIsSavingProducts] = useState(false);
    const [productErrors, setProductErrors] = useState({});

    // ================= Salary & Payroll States =================
    const [payrollCycle, setPayrollCycle] = useState('Monthly');
    const [payday, setPayday] = useState('5');
    const [defaultPaymentMethod, setDefaultPaymentMethod] = useState('Bank Transfer');
    const [enableOvertime, setEnableOvertime] = useState(false);
    const [overtimeRate, setOvertimeRate] = useState('150'); 
    const [latePenalty, setLatePenalty] = useState('50'); 
    const [isSavingPayroll, setIsSavingPayroll] = useState(false);
    const [payrollErrors, setPayrollErrors] = useState({});

    // ================= Payment Gateways States =================
    const [enableCOD, setEnableCOD] = useState(true);
    const [enableBkash, setEnableBkash] = useState(true);
    const [bkashAppKey, setBkashAppKey] = useState('');
    const [bkashAppSecret, setBkashAppSecret] = useState('');
    const [bkashUsername, setBkashUsername] = useState('');
    const [bkashPassword, setBkashPassword] = useState('');
    const [bkashSandbox, setBkashSandbox] = useState(true);
    const [showBkashSecret, setShowBkashSecret] = useState(false);
    const [showBkashPassword, setShowBkashPassword] = useState(false);

    const [enableSslCommerz, setEnableSslCommerz] = useState(true);
    const [sslStoreId, setSslStoreId] = useState('');
    const [sslStorePassword, setSslStorePassword] = useState('');
    const [sslSandbox, setSslSandbox] = useState(true);
    const [showSslPassword, setShowSslPassword] = useState(false);

    const [isSavingPayment, setIsSavingPayment] = useState(false);
    const [paymentErrors, setPaymentErrors] = useState({});

    // ================= TAXES & INVOICING STATES =================
    const [enableTax, setEnableTax] = useState(true);
    const [taxName, setTaxName] = useState('VAT');
    const [taxRate, setTaxRate] = useState('15');
    const [taxIncluded, setTaxIncluded] = useState(false);

    const [invoicePrefix, setInvoicePrefix] = useState('INV-SM-');
    const [nextInvoiceNumber, setNextInvoiceNumber] = useState('1042');
    const [invoiceFooterNote, setInvoiceFooterNote] = useState('Thank you for shopping with Smart Mess! Goods once sold cannot be refunded.');
    const [enableDigitalStamp, setEnableDigitalStamp] = useState(true);
    
    const [isSavingInvoice, setIsSavingInvoice] = useState(false);
    const [invoiceErrors, setInvoiceErrors] = useState({});

    // ================= NOTIFICATIONS STATES =================
    const [emailNewOrder, setEmailNewOrder] = useState(true);
    const [emailLowStock, setEmailLowStock] = useState(true);
    const [emailCustomerSignup, setEmailCustomerSignup] = useState(false);
    
    const [smsOrderConfirmation, setSmsOrderConfirmation] = useState(true);
    const [smsShippingUpdate, setSmsShippingUpdate] = useState(true);
    const [smsSenderId, setSmsSenderId] = useState('SmartMess');
    
    const [pushDesktop, setPushDesktop] = useState(true);
    const [adminNotificationEmail, setAdminNotificationEmail] = useState('admin@smartmess.com');
    const [isSavingNotifications, setIsSavingNotifications] = useState(false);
    const [notificationErrors, setNotificationErrors] = useState({});

    // --- Logo Upload Handler ---
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size must be less than 2MB!');
                return;
            }
            const imageUrl = URL.createObjectURL(file);
            setLogoPreview(imageUrl);
        }
    };

    // --- Business Profile Save Handler ---
    const handleSaveBusiness = (e) => {
        e.preventDefault();
        let newErrors = {};
        if (!companyName.trim()) newErrors.companyName = 'Company name is required!';
        if (!supportEmail.trim()) newErrors.supportEmail = 'Support email is required!';

        if (Object.keys(newErrors).length > 0) {
            setBusinessErrors(newErrors);
            toast.error('Please fill up all required business profile fields!');
            return;
        }

        setBusinessErrors({});
        setIsSavingBusiness(true);
        setTimeout(() => {
            setIsSavingBusiness(false);
            toast.success(`${companyName} profile updated successfully!`);
        }, 1500);
    };

    // --- Delivery & Courier Save Handler ---
    const handleSaveDelivery = (e) => {
        e.preventDefault();
        let newErrors = {};
        if (insideDhaka === '' || Number(insideDhaka) < 0) newErrors.insideDhaka = 'Valid delivery charge required!';
        if (outsideDhaka === '' || Number(outsideDhaka) < 0) newErrors.outsideDhaka = 'Valid delivery charge required!';

        if (Object.keys(newErrors).length > 0) {
            setDeliveryErrors(newErrors);
            toast.error('Please enter valid delivery charges!');
            return;
        }

        setDeliveryErrors({});
        setIsSavingDelivery(true);
        setTimeout(() => {
            setIsSavingDelivery(false);
            toast.success('Delivery & Courier settings saved successfully!');
        }, 1500);
    };

    // --- Security Save Handler ---
    const handleSaveSecurity = (e) => {
        e.preventDefault();
        let newErrors = {};

        if (!currentPassword) newErrors.currentPassword = 'Current password is required!';
        if (!newPassword) {
            newErrors.newPassword = 'New password is required!';
        } else if (newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters long!';
        }
        if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match!';

        if (Object.keys(newErrors).length > 0) {
            setSecurityErrors(newErrors);
            toast.error('Please fix password validation errors!');
            return;
        }

        setSecurityErrors({});
        setIsSavingSecurity(true);

        setTimeout(() => {
            setIsSavingSecurity(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
            toast.success('Password changed successfully!');
        }, 1500);
    };

    // --- 2FA Handlers ---
    const handle2FAToggle = (e) => {
        if (e.target.checked) {
            setShow2FAModal(true);
        } else {
            setTwoFactorAuth(false);
            toast.success('2FA Disabled!');
        }
    };

    const handleVerify2FA = () => {
        if (otpCode.length !== 6) {
            toast.error('Please enter a 6-digit code!');
            return;
        }
        setIsVerifying2FA(true);
        
        setTimeout(() => {
            setIsVerifying2FA(false);
            setTwoFactorAuth(true);
            setShow2FAModal(false);
            setOtpCode('');
            toast.success('2FA Enabled Successfully!');
        }, 1500);
    };

    // --- Product Settings Save Handler ---
    const handleSaveProducts = (e) => {
        e.preventDefault();
        let newErrors = {};
        
        if (!skuPrefix.trim()) newErrors.skuPrefix = 'SKU Prefix is required!';
        if (lowStockAlert === '' || Number(lowStockAlert) < 0) newErrors.lowStockAlert = 'Valid threshold required!';

        if (Object.keys(newErrors).length > 0) {
            setProductErrors(newErrors);
            toast.error('Please fix product setting errors!');
            return;
        }

        setProductErrors({});
        setIsSavingProducts(true);
        
        setTimeout(() => {
            setIsSavingProducts(false);
            toast.success('Product settings updated successfully!');
        }, 1500);
    };

    // --- Salary & Payroll Save Handler ---
    const handleSavePayroll = (e) => {
        e.preventDefault();
        let newErrors = {};
        
        if (enableOvertime && (overtimeRate === '' || Number(overtimeRate) < 0)) {
            newErrors.overtimeRate = 'Valid overtime rate required!';
        }
        if (latePenalty === '' || Number(latePenalty) < 0) {
            newErrors.latePenalty = 'Valid penalty amount required!';
        }

        if (Object.keys(newErrors).length > 0) {
            setPayrollErrors(newErrors);
            toast.error('Please fix payroll setting errors!');
            return;
        }

        setPayrollErrors({});
        setIsSavingPayroll(true);
        
        setTimeout(() => {
            setIsSavingPayroll(false);
            toast.success('Salary & Payroll settings updated successfully!');
        }, 1500);
    };

    // --- Payment Gateways Save Handler ---
    const handleSavePayment = (e) => {
        e.preventDefault();
        let newErrors = {};

        if (enableBkash) {
            if (!bkashAppKey.trim()) newErrors.bkashAppKey = 'bKash App Key is required!';
            if (!bkashAppSecret.trim()) newErrors.bkashAppSecret = 'bKash App Secret is required!';
            if (!bkashUsername.trim()) newErrors.bkashUsername = 'bKash Username is required!';
            if (!bkashPassword.trim()) newErrors.bkashPassword = 'bKash Password is required!';
        }

        if (enableSslCommerz) {
            if (!sslStoreId.trim()) newErrors.sslStoreId = 'Store ID is required!';
            if (!sslStorePassword.trim()) newErrors.sslStorePassword = 'Store Password is required!';
        }

        if (Object.keys(newErrors).length > 0) {
            setPaymentErrors(newErrors);
            toast.error('Please fill up required payment gateway fields!');
            return;
        }

        setPaymentErrors({});
        setIsSavingPayment(true);

        setTimeout(() => {
            setIsSavingPayment(false);
            toast.success('Payment Gateway settings updated successfully!');
        }, 1500);
    };

    // --- Taxes & Invoicing Save Handler ---
    const handleSaveInvoice = (e) => {
        e.preventDefault();
        let newErrors = {};

        if (enableTax) {
            if (!taxName.trim()) newErrors.taxName = 'Tax name is required!';
            if (taxRate === '' || Number(taxRate) < 0) newErrors.taxRate = 'Valid tax rate required!';
        }
        if (!invoicePrefix.trim()) newErrors.invoicePrefix = 'Invoice prefix is required!';
        if (nextInvoiceNumber === '' || Number(nextInvoiceNumber) < 1) newErrors.nextInvoiceNumber = 'Valid starting number required!';

        if (Object.keys(newErrors).length > 0) {
            setInvoiceErrors(newErrors);
            toast.error('Please fix tax & invoicing validation errors!');
            return;
        }

        setInvoiceErrors({});
        setIsSavingInvoice(true);

        setTimeout(() => {
            setIsSavingInvoice(false);
            toast.success('Taxes & Invoicing settings updated successfully!');
        }, 1500);
    };

    // --- Notifications Save Handler ---
    const handleSaveNotifications = (e) => {
        e.preventDefault();
        let newErrors = {};

        if (!adminNotificationEmail.trim()) {
            newErrors.adminEmail = 'Admin notification email is required!';
        }

        if (Object.keys(newErrors).length > 0) {
            setNotificationErrors(newErrors);
            toast.error('Please fix notification validation errors!');
            return;
        }

        setNotificationErrors({});
        setIsSavingNotifications(true);

        setTimeout(() => {
            setIsSavingNotifications(false);
            toast.success('Notification settings saved successfully!');
        }, 1500);
    };

    // সাইডবার মেনু লিস্ট
    const menuGroups = [
        {
            title: 'General',
            items: [
                { id: 'business', label: 'Business Profile', icon: FiBriefcase },
                { id: 'appearance', label: 'Appearance & Theme', icon: FiLayout },
            ]
        },
        {
            title: 'Operations',
            items: [
                { id: 'delivery', label: 'Delivery & Courier', icon: FiTruck },
                { id: 'products', label: 'Product Settings', icon: FiBox },
                { id: 'salary', label: 'Salary & Payroll', icon: FiDollarSign },
            ]
        },
        {
            title: 'Finance & Comms',
            items: [
                { id: 'payment', label: 'Payment Gateways', icon: FiCreditCard },
                { id: 'invoice', label: 'Taxes & Invoicing', icon: FiFileText },
                { id: 'notifications', label: 'Notifications', icon: FiBell },
            ]
        },
        {
            title: 'System & Security',
            items: [
                { id: 'security', label: 'Security & Roles', icon: FiShield },
                { id: 'system', label: 'System, Backup & Maint.', icon: FiDatabase },
            ]
        }
    ];

    const eyeButtonStyle = {
        position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
        background: 'none', border: 'none', cursor: 'pointer', color: '#718096',
        display: 'flex', alignItems: 'center', padding: '0'
    };

    return (
        <div style={{ padding: '0 4px', position: 'relative' }}>
            
            {/* ================= 2FA Modal (Popup) ================= */}
            {show2FAModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{
                        backgroundColor: '#fff', padding: '32px', borderRadius: '12px', width: '400px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)', position: 'relative'
                    }}>
                        <button
                            onClick={() => { setShow2FAModal(false); setOtpCode(''); }}
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#a0aec0' }}
                        >
                            <FiX size={24} />
                        </button>
                        
                        <div style={{ textAlign: 'center' }}>
                            <FiSmartphone size={40} color="#90273c" style={{ marginBottom: '16px' }} />
                            <h3 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>Set up 2FA</h3>
                            <p style={{ fontSize: '13px', color: '#718096', margin: '0 0 24px 0' }}>
                                Scan this QR code with your Google Authenticator app and enter the 6-digit code below.
                            </p>
                            
                            <div style={{
                                width: '150px', height: '150px', backgroundColor: '#edf2f7', margin: '0 auto 16px auto',
                                display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '8px', border: '1px dashed #cbd5e0'
                            }}>
                                <span style={{ color: '#a0aec0', fontSize: '12px' }}>[ QR Code ]</span>
                            </div>
                            
                            <p style={{ fontSize: '12px', color: '#4a5568', fontWeight: 'bold', marginBottom: '24px', letterSpacing: '2px' }}>
                                ABCD EFGH 1234 5678
                            </p>
                            
                            <input
                                type="text"
                                placeholder="Enter 6-digit code"
                                maxLength={6}
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                style={{
                                    width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e0',
                                    textAlign: 'center', fontSize: '18px', letterSpacing: '4px', marginBottom: '16px'
                                }}
                            />
                            
                            <button
                                onClick={handleVerify2FA}
                                disabled={isVerifying2FA}
                                style={{
                                    width: '100%', padding: '12px', backgroundColor: '#90273c', color: 'white',
                                    border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: isVerifying2FA ? 'not-allowed' : 'pointer',
                                    opacity: isVerifying2FA ? 0.7 : 1
                                }}
                            >
                                {isVerifying2FA ? 'Verifying...' : 'Verify & Enable 2FA'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* ================= End Modal ================= */}

            <div className={styles.settingsHeader}>
                <h2><FiSettings style={{ color: '#90273c' }} /> Settings & Configuration</h2>
                <p>Manage your store preferences, system operations, and administrative tools.</p>
            </div>

            <div className={styles.settingsContainer}>
                
                {/* ১. বামপাশের সাইডবার মেনু */}
                <div className={styles.settingsSidebar}>
                    {menuGroups.map((group, idx) => (
                        <div key={idx}>
                            <div className={styles.settingsMenuTitle}>{group.title}</div>
                            {group.items.map(item => {
                                const IconComponent = item.icon;
                                return (
                                    <div
                                        key={item.id}
                                        className={`${styles.settingsMenuItem} ${activeTab === item.id ? styles.active : ''}`}
                                        onClick={() => setActiveTab(item.id)}
                                    >
                                        <IconComponent size={16} />
                                        {item.label}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* ২. ডানপাশের কন্টেন্ট এরিয়া */}
                <div className={styles.settingsContentArea}>
                    
                    {/* Business Profile Tab */}
                    {activeTab === 'business' && (
                        <div>
                            <h3 className={styles.settingsCardTitle}>Business Profile</h3>
                            <div className={styles.settingsFormGroup} style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '20px', padding: '16px', backgroundColor: '#f7fafc', borderRadius: '8px', border: '1px dashed #cbd5e0' }}>
                                <div style={{
                                    width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#edf2f7',
                                    display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
                                    border: '2px solid #e2e8f0'
                                }}>
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Company Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <FiBriefcase size={32} color="#a0aec0" />
                                    )}
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2d3748' }}>Company Logo</label>
                                    <input type="file" accept="image/*" onChange={handleLogoChange} style={{ fontSize: '14px', border: 'none', padding: '0', background: 'transparent' }} />
                                    <p style={{ fontSize: '12px', color: '#718096', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <FiUploadCloud /> Recommended size: 256x256px. Max 2MB.
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className={styles.settingsFormGroup}>
                                    <label>Company Name <span style={{color: 'red'}}>*</span></label>
                                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} style={{ borderColor: businessErrors.companyName ? 'red' : '' }} />
                                    {businessErrors.companyName && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{businessErrors.companyName}</span>}
                                </div>
                                <div className={styles.settingsFormGroup}>
                                    <label>Company Tagline / Slogan</label>
                                    <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} />
                                </div>
                                <div className={styles.settingsFormGroup}>
                                    <label>Support Email <span style={{color: 'red'}}>*</span></label>
                                    <input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} style={{ borderColor: businessErrors.supportEmail ? 'red' : '' }} />
                                    {businessErrors.supportEmail && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{businessErrors.supportEmail}</span>}
                                </div>
                                <div className={styles.settingsFormGroup}>
                                    <label>Phone Number</label>
                                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginTop: '16px' }}>
                                <div className={styles.settingsFormGroup}>
                                    <label>Business Address</label>
                                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                                </div>
                                <div className={styles.settingsFormGroup}>
                                    <label>Currency</label>
                                    <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                                        <option value="BDT">BDT (৳)</option>
                                        <option value="USD">USD ($)</option>
                                    </select>
                                </div>
                            </div>
                            <button onClick={handleSaveBusiness} className={styles.settingsSaveBtn} disabled={isSavingBusiness} style={{ opacity: isSavingBusiness ? 0.7 : 1, cursor: isSavingBusiness ? 'not-allowed' : 'pointer', marginTop: '20px' }}>
                                {isSavingBusiness ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}

                    {/* Delivery & Courier Tab */}
                    {activeTab === 'delivery' && (
                        <div>
                            <h3 className={styles.settingsCardTitle}>Delivery & Courier Settings</h3>
                            <div className={styles.settingsFormGroup}>
                                <label>Inside Dhaka Delivery Charge (৳) <span style={{color: 'red'}}>*</span></label>
                                <input type="number" value={insideDhaka} onChange={(e) => setInsideDhaka(e.target.value)} style={{ borderColor: deliveryErrors.insideDhaka ? 'red' : '' }} />
                                {deliveryErrors.insideDhaka && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{deliveryErrors.insideDhaka}</span>}
                            </div>
                            <div className={styles.settingsFormGroup}>
                                <label>Outside Dhaka Delivery Charge (৳) <span style={{color: 'red'}}>*</span></label>
                                <input type="number" value={outsideDhaka} onChange={(e) => setOutsideDhaka(e.target.value)} style={{ borderColor: deliveryErrors.outsideDhaka ? 'red' : '' }} />
                                {deliveryErrors.outsideDhaka && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{deliveryErrors.outsideDhaka}</span>}
                            </div>
                            <div className={styles.settingsFormGroup}>
                                <label>Default Courier Partner</label>
                                <select value={courierPartner} onChange={(e) => setCourierPartner(e.target.value)}>
                                    <option value="Pathao Courier">Pathao Courier</option>
                                    <option value="Steadfast">Steadfast</option>
                                    <option value="RedX">RedX</option>
                                    <option value="Sundarban">Sundarban</option>
                                </select>
                            </div>
                            <button onClick={handleSaveDelivery} className={styles.settingsSaveBtn} disabled={isSavingDelivery} style={{ opacity: isSavingDelivery ? 0.7 : 1, cursor: isSavingDelivery ? 'not-allowed' : 'pointer' }}>
                                {isSavingDelivery ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}

                    {/* Product Settings Tab */}
                    {activeTab === 'products' && (
                        <div>
                            <h3 className={styles.settingsCardTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiBox /> Product & Inventory Settings
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                <div className={styles.settingsFormGroup}>
                                    <label>Default SKU Prefix <span style={{color: 'red'}}>*</span></label>
                                    <input
                                        type="text"
                                        value={skuPrefix}
                                        onChange={(e) => setSkuPrefix(e.target.value)}
                                        style={{ borderColor: productErrors.skuPrefix ? 'red' : '' }}
                                    />
                                    {productErrors.skuPrefix && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{productErrors.skuPrefix}</span>}
                                </div>
                                <div className={styles.settingsFormGroup}>
                                    <label>Low Stock Alert Threshold <span style={{color: 'red'}}>*</span></label>
                                    <input
                                        type="number"
                                        value={lowStockAlert}
                                        onChange={(e) => setLowStockAlert(e.target.value)}
                                        style={{ borderColor: productErrors.lowStockAlert ? 'red' : '' }}
                                    />
                                    {productErrors.lowStockAlert && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{productErrors.lowStockAlert}</span>}
                                </div>
                            </div>

                            <div style={{ padding: '16px', backgroundColor: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong style={{ display: 'block', color: '#2d3748', fontSize: '15px' }}>Product Variations</strong>
                                    <p style={{ fontSize: '13px', color: '#718096', margin: '4px 0 0 0' }}>Enable size, color, and other attributes for your products.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={enableVariations}
                                    onChange={(e) => setEnableVariations(e.target.checked)}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                            </div>

                            <div style={{ padding: '16px', backgroundColor: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong style={{ display: 'block', color: '#2d3748', fontSize: '15px' }}>Allow Backorders</strong>
                                    <p style={{ fontSize: '13px', color: '#718096', margin: '4px 0 0 0' }}>Allow customers to purchase items even when they are out of stock.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={allowBackorders}
                                    onChange={(e) => setAllowBackorders(e.target.checked)}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                            </div>

                            <button onClick={handleSaveProducts} className={styles.settingsSaveBtn} disabled={isSavingProducts} style={{ opacity: isSavingProducts ? 0.7 : 1, cursor: isSavingProducts ? 'not-allowed' : 'pointer', marginTop: '8px' }}>
                                {isSavingProducts ? 'Saving Settings...' : 'Save Product Settings'}
                            </button>
                        </div>
                    )}

                    {/* Salary & Payroll Tab */}
                    {activeTab === 'salary' && (
                        <div>
                            <h3 className={styles.settingsCardTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiDollarSign /> Salary & Payroll Configuration
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                <div className={styles.settingsFormGroup}>
                                    <label>Payroll Cycle</label>
                                    <div style={{ position: 'relative' }}>
                                        <FiCalendar style={{ position: 'absolute', top: '12px', left: '12px', color: '#a0aec0' }} />
                                        <select 
                                            value={payrollCycle} 
                                            onChange={(e) => setPayrollCycle(e.target.value)}
                                            style={{ paddingLeft: '36px' }}
                                        >
                                            <option value="Monthly">Monthly</option>
                                            <option value="Bi-Weekly">Bi-Weekly (Every 2 weeks)</option>
                                            <option value="Weekly">Weekly</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.settingsFormGroup}>
                                    <label>Default Pay Day</label>
                                    <select value={payday} onChange={(e) => setPayday(e.target.value)}>
                                        <option value="1">1st of the month</option>
                                        <option value="5">5th of the month</option>
                                        <option value="10">10th of the month</option>
                                        <option value="Last Day">Last day of the month</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ padding: '16px', backgroundColor: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: enableOvertime ? '16px' : '0' }}>
                                    <div>
                                        <strong style={{ display: 'block', color: '#2d3748', fontSize: '15px' }}>Enable Overtime Calculation</strong>
                                        <p style={{ fontSize: '13px', color: '#718096', margin: '4px 0 0 0' }}>Calculate extra pay for hours worked beyond the regular schedule.</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={enableOvertime}
                                        onChange={(e) => setEnableOvertime(e.target.checked)}
                                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                    />
                                </div>

                                {enableOvertime && (
                                    <div style={{ borderTop: '1px dashed #cbd5e0', paddingTop: '16px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                        <div className={styles.settingsFormGroup} style={{ flex: 1, marginBottom: 0 }}>
                                            <label>Overtime Rate (Per Hour)</label>
                                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                <span style={{ position: 'absolute', left: '12px', color: '#718096' }}>৳</span>
                                                <input
                                                    type="number"
                                                    value={overtimeRate}
                                                    onChange={(e) => setOvertimeRate(e.target.value)}
                                                    style={{ paddingLeft: '28px', borderColor: payrollErrors.overtimeRate ? 'red' : '' }}
                                                />
                                            </div>
                                            {payrollErrors.overtimeRate && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{payrollErrors.overtimeRate}</span>}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '12px', color: '#718096', margin: 0, padding: '12px', backgroundColor: '#edf2f7', borderRadius: '6px' }}>
                                                <FiClock style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                                This rate will be multiplied by the extra hours submitted in attendance.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                <div className={styles.settingsFormGroup}>
                                    <label>Late Attendance Penalty (Per Day)</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', top: '10px', left: '12px', color: '#718096' }}>৳</span>
                                        <input
                                            type="number"
                                            value={latePenalty}
                                            onChange={(e) => setLatePenalty(e.target.value)}
                                            style={{ paddingLeft: '28px', borderColor: payrollErrors.latePenalty ? 'red' : '' }}
                                        />
                                    </div>
                                    {payrollErrors.latePenalty && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{payrollErrors.latePenalty}</span>}
                                </div>
                                <div className={styles.settingsFormGroup}>
                                    <label>Default Payment Method</label>
                                    <div style={{ position: 'relative' }}>
                                        <FiPieChart style={{ position: 'absolute', top: '12px', left: '12px', color: '#a0aec0' }} />
                                        <select 
                                            value={defaultPaymentMethod} 
                                            onChange={(e) => setDefaultPaymentMethod(e.target.value)}
                                            style={{ paddingLeft: '36px' }}
                                        >
                                            <option value="Bank Transfer">Bank Transfer</option>
                                            <option value="Mobile Banking">Mobile Banking (bKash/Nagad)</option>
                                            <option value="Cash">Cash</option>
                                            <option value="Cheque">Cheque</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleSavePayroll} className={styles.settingsSaveBtn} disabled={isSavingPayroll} style={{ opacity: isSavingPayroll ? 0.7 : 1, cursor: isSavingPayroll ? 'not-allowed' : 'pointer' }}>
                                {isSavingPayroll ? 'Saving Payroll Settings...' : 'Save Payroll Settings'}
                            </button>
                        </div>
                    )}

                    {/* Payment Gateways Tab */}
                    {activeTab === 'payment' && (
                        <div>
                            <h3 className={styles.settingsCardTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiCreditCard /> Payment Gateways & Checkout Methods
                            </h3>

                            <div style={{ padding: '16px', backgroundColor: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong style={{ display: 'block', color: '#2d3748', fontSize: '15px' }}>Cash on Delivery (COD)</strong>
                                    <p style={{ fontSize: '13px', color: '#718096', margin: '4px 0 0 0' }}>Allow customers to pay in cash upon receiving their order.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={enableCOD}
                                    onChange={(e) => setEnableCOD(e.target.checked)}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                            </div>

                            <div style={{ padding: '20px', backgroundColor: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: enableBkash ? '20px' : '0' }}>
                                    <div>
                                        <strong style={{ display: 'block', color: '#2d3748', fontSize: '15px' }}>bKash Direct Merchant Gateway</strong>
                                        <p style={{ fontSize: '13px', color: '#718096', margin: '4px 0 0 0' }}>Accept instant bKash payments via official Merchant API.</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={enableBkash}
                                        onChange={(e) => setEnableBkash(e.target.checked)}
                                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                    />
                                </div>

                                {enableBkash && (
                                    <div style={{ borderTop: '1px dashed #cbd5e0', paddingTop: '16px' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                            <div className={styles.settingsFormGroup} style={{ marginBottom: 0 }}>
                                                <label>App Key <span style={{color: 'red'}}>*</span></label>
                                                <input
                                                    type="text"
                                                    value={bkashAppKey}
                                                    onChange={(e) => setBkashAppKey(e.target.value)}
                                                    placeholder="Enter bKash App Key"
                                                    style={{ borderColor: paymentErrors.bkashAppKey ? 'red' : '' }}
                                                />
                                                {paymentErrors.bkashAppKey && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{paymentErrors.bkashAppKey}</span>}
                                            </div>
                                            <div className={styles.settingsFormGroup} style={{ marginBottom: 0 }}>
                                                <label>App Secret <span style={{color: 'red'}}>*</span></label>
                                                <div style={{ position: 'relative' }}>
                                                    <input
                                                        type={showBkashSecret ? "text" : "password"}
                                                        value={bkashAppSecret}
                                                        onChange={(e) => setBkashAppSecret(e.target.value)}
                                                        placeholder="••••••••••••"
                                                        style={{ borderColor: paymentErrors.bkashAppSecret ? 'red' : '', width: '100%', paddingRight: '40px' }}
                                                    />
                                                    <button type="button" onClick={() => setShowBkashSecret(!showBkashSecret)} style={eyeButtonStyle}>
                                                        {showBkashSecret ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                                    </button>
                                                </div>
                                                {paymentErrors.bkashAppSecret && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{paymentErrors.bkashAppSecret}</span>}
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                            <div className={styles.settingsFormGroup} style={{ marginBottom: 0 }}>
                                                <label>API Username <span style={{color: 'red'}}>*</span></label>
                                                <input
                                                    type="text"
                                                    value={bkashUsername}
                                                    onChange={(e) => setBkashUsername(e.target.value)}
                                                    placeholder="bKash Merchant Username"
                                                    style={{ borderColor: paymentErrors.bkashUsername ? 'red' : '' }}
                                                />
                                                {paymentErrors.bkashUsername && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{paymentErrors.bkashUsername}</span>}
                                            </div>
                                            <div className={styles.settingsFormGroup} style={{ marginBottom: 0 }}>
                                                <label>API Password <span style={{color: 'red'}}>*</span></label>
                                                <div style={{ position: 'relative' }}>
                                                    <input
                                                        type={showBkashPassword ? "text" : "password"}
                                                        value={bkashPassword}
                                                        onChange={(e) => setBkashPassword(e.target.value)}
                                                        placeholder="••••••••••••"
                                                        style={{ borderColor: paymentErrors.bkashPassword ? 'red' : '', width: '100%', paddingRight: '40px' }}
                                                    />
                                                    <button type="button" onClick={() => setShowBkashPassword(!showBkashPassword)} style={eyeButtonStyle}>
                                                        {showBkashPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                                    </button>
                                                </div>
                                                {paymentErrors.bkashPassword && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{paymentErrors.bkashPassword}</span>}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                                            <input
                                                type="checkbox"
                                                id="bkashSandbox"
                                                checked={bkashSandbox}
                                                onChange={(e) => setBkashSandbox(e.target.checked)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <label htmlFor="bkashSandbox" style={{ fontSize: '13px', color: '#4a5568', cursor: 'pointer', margin: 0 }}>
                                                Enable Sandbox / Test Mode
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ padding: '20px', backgroundColor: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: enableSslCommerz ? '20px' : '0' }}>
                                    <div>
                                        <strong style={{ display: 'block', color: '#2d3748', fontSize: '15px' }}>SSLCommerz Gateway</strong>
                                        <p style={{ fontSize: '13px', color: '#718096', margin: '4px 0 0 0' }}>Accept Visa, MasterCard, Mobile Banking, and Internet Banking.</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={enableSslCommerz}
                                        onChange={(e) => setEnableSslCommerz(e.target.checked)}
                                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                    />
                                </div>

                                {enableSslCommerz && (
                                    <div style={{ borderTop: '1px dashed #cbd5e0', paddingTop: '16px' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                            <div className={styles.settingsFormGroup} style={{ marginBottom: 0 }}>
                                                <label>Store ID <span style={{color: 'red'}}>*</span></label>
                                                <input
                                                    type="text"
                                                    value={sslStoreId}
                                                    onChange={(e) => setSslStoreId(e.target.value)}
                                                    placeholder="Enter SSLCommerz Store ID"
                                                    style={{ borderColor: paymentErrors.sslStoreId ? 'red' : '' }}
                                                />
                                                {paymentErrors.sslStoreId && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{paymentErrors.sslStoreId}</span>}
                                            </div>
                                            <div className={styles.settingsFormGroup} style={{ marginBottom: 0 }}>
                                                <label>Store Password / Secret <span style={{color: 'red'}}>*</span></label>
                                                <div style={{ position: 'relative' }}>
                                                    <input
                                                        type={showSslPassword ? "text" : "password"}
                                                        value={sslStorePassword}
                                                        onChange={(e) => setSslStorePassword(e.target.value)}
                                                        placeholder="••••••••••••"
                                                        style={{ borderColor: paymentErrors.sslStorePassword ? 'red' : '', width: '100%', paddingRight: '40px' }}
                                                    />
                                                    <button type="button" onClick={() => setShowSslPassword(!showSslPassword)} style={eyeButtonStyle}>
                                                        {showSslPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                                    </button>
                                                </div>
                                                {paymentErrors.sslStorePassword && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{paymentErrors.sslStorePassword}</span>}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                                            <input
                                                type="checkbox"
                                                id="sslSandbox"
                                                checked={sslSandbox}
                                                onChange={(e) => setSslSandbox(e.target.checked)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <label htmlFor="sslSandbox" style={{ fontSize: '13px', color: '#4a5568', cursor: 'pointer', margin: 0 }}>
                                                Enable Sandbox / Test Mode
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button onClick={handleSavePayment} className={styles.settingsSaveBtn} disabled={isSavingPayment} style={{ opacity: isSavingPayment ? 0.7 : 1, cursor: isSavingPayment ? 'not-allowed' : 'pointer' }}>
                                {isSavingPayment ? 'Saving Payment Settings...' : 'Save Payment Settings'}
                            </button>
                        </div>
                    )}

                    {/* Taxes & Invoicing Tab */}
                    {activeTab === 'invoice' && (
                        <div>
                            <h3 className={styles.settingsCardTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                                <FiFileText /> Taxes & Invoicing Configuration
                            </h3>

                            {/* 1. Tax Configuration Section */}
                            <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: enableTax ? '20px' : '0' }}>
                                    <div>
                                        <strong style={{ display: 'block', color: '#1a202c', fontSize: '16px' }}>Enable Tax Calculation</strong>
                                        <p style={{ fontSize: '13px', color: '#718096', margin: '4px 0 0 0' }}>Calculate VAT or sales tax automatically on checkout invoices.</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={enableTax}
                                        onChange={(e) => setEnableTax(e.target.checked)}
                                        style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#90273c' }}
                                    />
                                </div>

                                {enableTax && (
                                    <div style={{ borderTop: '1px solid #edf2f7', paddingTop: '20px' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                            <div className={styles.settingsFormGroup} style={{ marginBottom: 0 }}>
                                                <label>Tax Name / Label <span style={{color: 'red'}}>*</span></label>
                                                <input
                                                    type="text"
                                                    value={taxName}
                                                    onChange={(e) => setTaxName(e.target.value)}
                                                    placeholder="e.g., VAT, GST, Sales Tax"
                                                    style={{ borderColor: invoiceErrors.taxName ? 'red' : '', backgroundColor: '#fff' }}
                                                />
                                                {invoiceErrors.taxName && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{invoiceErrors.taxName}</span>}
                                            </div>
                                            <div className={styles.settingsFormGroup} style={{ marginBottom: 0 }}>
                                                <label>Tax Rate (%) <span style={{color: 'red'}}>*</span></label>
                                                <div style={{ position: 'relative' }}>
                                                    <input
                                                        type="number"
                                                        value={taxRate}
                                                        onChange={(e) => setTaxRate(e.target.value)}
                                                        placeholder="15"
                                                        style={{ borderColor: invoiceErrors.taxRate ? 'red' : '', width: '100%', paddingRight: '36px', backgroundColor: '#fff' }}
                                                    />
                                                    <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#718096' }}>%</span>
                                                </div>
                                                {invoiceErrors.taxRate && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{invoiceErrors.taxRate}</span>}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                                            <input
                                                type="checkbox"
                                                id="taxIncluded"
                                                checked={taxIncluded}
                                                onChange={(e) => setTaxIncluded(e.target.checked)}
                                                style={{ cursor: 'pointer', accentColor: '#90273c' }}
                                            />
                                            <label htmlFor="taxIncluded" style={{ fontSize: '13px', color: '#4a5568', cursor: 'pointer', margin: 0 }}>
                                                Prices entered in admin already include tax (Inclusive Pricing)
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 2. Invoicing Customization Section */}
                            <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                                <strong style={{ display: 'block', color: '#1a202c', fontSize: '16px', marginBottom: '20px' }}>Invoice Customization & Numbering</strong>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                    <div className={styles.settingsFormGroup} style={{ marginBottom: 0 }}>
                                        <label>Invoice Prefix <span style={{color: 'red'}}>*</span></label>
                                        <input
                                            type="text"
                                            value={invoicePrefix}
                                            onChange={(e) => setInvoicePrefix(e.target.value)}
                                            placeholder="INV-SM-"
                                            style={{ borderColor: invoiceErrors.invoicePrefix ? 'red' : '', backgroundColor: '#fff' }}
                                        />
                                        {invoiceErrors.invoicePrefix && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{invoiceErrors.invoicePrefix}</span>}
                                    </div>
                                    <div className={styles.settingsFormGroup} style={{ marginBottom: 0 }}>
                                        <label>Next Invoice Number <span style={{color: 'red'}}>*</span></label>
                                        <input
                                            type="number"
                                            value={nextInvoiceNumber}
                                            onChange={(e) => setNextInvoiceNumber(e.target.value)}
                                            placeholder="1001"
                                            style={{ borderColor: invoiceErrors.nextInvoiceNumber ? 'red' : '', backgroundColor: '#fff' }}
                                        />
                                        {invoiceErrors.nextInvoiceNumber && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{invoiceErrors.nextInvoiceNumber}</span>}
                                    </div>
                                </div>

                                <div className={styles.settingsFormGroup}>
                                    <label>Invoice Footer Note / Terms</label>
                                    <textarea
                                        value={invoiceFooterNote}
                                        onChange={(e) => setInvoiceFooterNote(e.target.value)}
                                        rows={3}
                                        style={{ 
                                            width: '100%', 
                                            padding: '12px', 
                                            borderRadius: '8px', 
                                            border: '1px solid #cbd5e0', 
                                            fontSize: '14px', 
                                            fontFamily: 'inherit',
                                            backgroundColor: '#fff', 
                                            color: '#1a202c', 
                                            lineHeight: '1.5'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                                    <input
                                        type="checkbox"
                                        id="digitalStamp"
                                        checked={enableDigitalStamp}
                                        onChange={(e) => setEnableDigitalStamp(e.target.checked)}
                                        style={{ cursor: 'pointer', accentColor: '#90273c' }}
                                    />
                                    <label htmlFor="digitalStamp" style={{ fontSize: '13px', color: '#4a5568', cursor: 'pointer', margin: 0 }}>
                                        Include Digital Signature / Stamp on PDF Invoices
                                    </label>
                                </div>
                            </div>

                            {/* Live Invoice Preview Box */}
                            <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '12px', border: '1px dashed #90273c', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #edf2f7', paddingBottom: '10px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#90273c', textTransform: 'uppercase', letterSpacing: '1px' }}>Live Invoice Preview</span>
                                    <span style={{ fontSize: '12px', color: '#718096', display: 'flex', alignItems: 'center', gap: '4px' }}><FiPrinter /> Sample Print</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#1a202c', marginBottom: '6px' }}>
                                    <strong style={{ fontSize: '16px' }}>{companyName}</strong>
                                    <span style={{ fontWeight: 'bold', color: '#90273c' }}>{invoicePrefix}{nextInvoiceNumber}</span>
                                </div>
                                <div style={{ fontSize: '12px', color: '#718096', marginBottom: '16px' }}>
                                    {address} | {supportEmail}
                                </div>
                                <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', color: '#2d3748', display: 'flex', justifyContent: 'space-between', border: '1px solid #edf2f7' }}>
                                    <span>Sample Item (1x) — ৳1,000</span>
                                    <span style={{ fontWeight: '500' }}>{enableTax ? `${taxName} (${taxRate}%): ৳${(1000 * Number(taxRate)) / 100}` : 'Tax Disabled'}</span>
                                </div>
                                <p style={{ fontSize: '12px', color: '#2d3748', margin: '16px 0 0 0', fontStyle: 'italic', textAlign: 'center', fontWeight: '500' }}>
                                    "{invoiceFooterNote}"
                                </p>
                            </div>

                            <button onClick={handleSaveInvoice} className={styles.settingsSaveBtn} disabled={isSavingInvoice} style={{ opacity: isSavingInvoice ? 0.7 : 1, cursor: isSavingInvoice ? 'not-allowed' : 'pointer' }}>
                                {isSavingInvoice ? 'Saving Invoicing Settings...' : 'Save Tax & Invoicing Settings'}
                            </button>
                        </div>
                    )}

                    {/* ================= NOTIFICATIONS TAB (REDESIGNED) ================= */}
                    {activeTab === 'notifications' && (
                        <div>
                            <h3 className={styles.settingsCardTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                                <FiBell /> Notification & Alerts Configuration
                            </h3>

                            {/* Admin Notification Email Input */}
                            <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                                <strong style={{ display: 'block', color: '#1a202c', fontSize: '16px', marginBottom: '12px' }}>Admin Notification Recipient</strong>
                                <p style={{ fontSize: '13px', color: '#718096', margin: '0 0 16px 0' }}>Where should administrative alerts and system emails be sent?</p>
                                
                                <div className={styles.settingsFormGroup} style={{ marginBottom: 0 }}>
                                    <label>Admin Email Address <span style={{color: 'red'}}>*</span></label>
                                    <div style={{ position: 'relative' }}>
                                        <FiMail style={{ position: 'absolute', top: '12px', left: '12px', color: '#a0aec0' }} />
                                        <input
                                            type="email"
                                            value={adminNotificationEmail}
                                            onChange={(e) => setAdminNotificationEmail(e.target.value)}
                                            placeholder="admin@smartmess.com"
                                            style={{ paddingLeft: '36px', borderColor: notificationErrors.adminEmail ? 'red' : '', backgroundColor: '#fff' }}
                                        />
                                    </div>
                                    {notificationErrors.adminEmail && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{notificationErrors.adminEmail}</span>}
                                </div>
                            </div>

                            {/* Email Alerts Section */}
                            <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                    <FiMail color="#90273c" size={18} />
                                    <strong style={{ color: '#1a202c', fontSize: '16px' }}>Email Notification Triggers</strong>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #edf2f7' }}>
                                        <div>
                                            <strong style={{ display: 'block', color: '#2d3748', fontSize: '14px' }}>New Order Alert</strong>
                                            <p style={{ fontSize: '12px', color: '#718096', margin: '2px 0 0 0' }}>Receive an email instantly whenever a customer places a new order.</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={emailNewOrder}
                                            onChange={(e) => setEmailNewOrder(e.target.checked)}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#90273c' }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #edf2f7' }}>
                                        <div>
                                            <strong style={{ display: 'block', color: '#2d3748', fontSize: '14px' }}>Low Stock Inventory Alert</strong>
                                            <p style={{ fontSize: '12px', color: '#718096', margin: '2px 0 0 0' }}>Get notified when a product falls below the low stock threshold.</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={emailLowStock}
                                            onChange={(e) => setEmailLowStock(e.target.checked)}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#90273c' }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <strong style={{ display: 'block', color: '#2d3748', fontSize: '14px' }}>New Customer Registration</strong>
                                            <p style={{ fontSize: '12px', color: '#718096', margin: '2px 0 0 0' }}>Receive a notification when a new user registers an account on the store.</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={emailCustomerSignup}
                                            onChange={(e) => setEmailCustomerSignup(e.target.checked)}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#90273c' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SMS / Mobile Alerts Section */}
                            <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                    <FiMessageSquare color="#90273c" size={18} />
                                    <strong style={{ color: '#1a202c', fontSize: '16px' }}>SMS & Customer Text Alerts</strong>
                                </div>

                                <div className={styles.settingsFormGroup} style={{ marginBottom: '20px' }}>
                                    <label>SMS Sender ID / Masking Name</label>
                                    <input
                                        type="text"
                                        value={smsSenderId}
                                        onChange={(e) => setSmsSenderId(e.target.value)}
                                        placeholder="SmartMess"
                                        style={{ backgroundColor: '#fff' }}
                                    />
                                    <span style={{ fontSize: '11px', color: '#718096', marginTop: '4px', display: 'block' }}>The name or brand ID that appears on customer's phone when receiving a text message.</span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #edf2f7' }}>
                                        <div>
                                            <strong style={{ display: 'block', color: '#2d3748', fontSize: '14px' }}>Order Confirmation SMS to Customer</strong>
                                            <p style={{ fontSize: '12px', color: '#718096', margin: '2px 0 0 0' }}>Automatically text buyers a confirmation text when order is placed.</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={smsOrderConfirmation}
                                            onChange={(e) => setSmsOrderConfirmation(e.target.checked)}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#90273c' }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <strong style={{ display: 'block', color: '#2d3748', fontSize: '14px' }}>Shipping & Courier Status Updates</strong>
                                            <p style={{ fontSize: '12px', color: '#718096', margin: '2px 0 0 0' }}>Send text alerts when order is dispatched, out for delivery, or delivered.</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={smsShippingUpdate}
                                            onChange={(e) => setSmsShippingUpdate(e.target.checked)}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#90273c' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Push Notifications Section */}
                            <div style={{ padding: '20px 24px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong style={{ display: 'block', color: '#1a202c', fontSize: '15px' }}>Browser Push Notifications</strong>
                                    <p style={{ fontSize: '13px', color: '#718096', margin: '4px 0 0 0' }}>Show desktop pop-up notifications inside admin panel for critical activities.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={pushDesktop}
                                    onChange={(e) => setPushDesktop(e.target.checked)}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#90273c' }}
                                />
                            </div>

                            <button onClick={handleSaveNotifications} className={styles.settingsSaveBtn} disabled={isSavingNotifications} style={{ opacity: isSavingNotifications ? 0.7 : 1, cursor: isSavingNotifications ? 'not-allowed' : 'pointer' }}>
                                {isSavingNotifications ? 'Saving Notification Settings...' : 'Save Notification Settings'}
                            </button>
                        </div>
                    )}
                    {/* ================= END NOTIFICATIONS TAB ================= */}

                    {/* Security & Roles Tab */}
                    {activeTab === 'security' && (
                        <div>
                            <h3 className={styles.settingsCardTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiLock /> Password & Account Security
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
                                <div className={styles.settingsFormGroup}>
                                    <label>Current Password <span style={{color: 'red'}}>*</span></label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            style={{ borderColor: securityErrors.currentPassword ? 'red' : '', width: '100%', paddingRight: '40px' }}
                                        />
                                        <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} style={eyeButtonStyle}>
                                            {showCurrentPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                        </button>
                                    </div>
                                    {securityErrors.currentPassword && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{securityErrors.currentPassword}</span>}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div className={styles.settingsFormGroup}>
                                        <label>New Password <span style={{color: 'red'}}>*</span></label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                placeholder="At least 6 characters"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                style={{ borderColor: securityErrors.newPassword ? 'red' : '', width: '100%', paddingRight: '40px' }}
                                            />
                                            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} style={eyeButtonStyle}>
                                                {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                            </button>
                                        </div>
                                        {securityErrors.newPassword && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{securityErrors.newPassword}</span>}
                                    </div>

                                    <div className={styles.settingsFormGroup}>
                                        <label>Confirm New Password <span style={{color: 'red'}}>*</span></label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Re-enter new password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                style={{ borderColor: securityErrors.confirmPassword ? 'red' : '', width: '100%', paddingRight: '40px' }}
                                            />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={eyeButtonStyle}>
                                                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                            </button>
                                        </div>
                                        {securityErrors.confirmPassword && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{securityErrors.confirmPassword}</span>}
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleSaveSecurity} className={styles.settingsSaveBtn} disabled={isSavingSecurity} style={{ opacity: isSavingSecurity ? 0.7 : 1, cursor: isSavingSecurity ? 'not-allowed' : 'pointer', marginBottom: '32px' }}>
                                {isSavingSecurity ? 'Updating Password...' : 'Update Password'}
                            </button>

                            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0' }} />

                            <h3 className={styles.settingsCardTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiKey /> System Roles & Authentication
                            </h3>

                            <div style={{ padding: '16px', backgroundColor: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong style={{ display: 'block', color: '#2d3748', fontSize: '15px' }}>Two-Factor Authentication (2FA)</strong>
                                    <p style={{ fontSize: '13px', color: '#718096', margin: '4px 0 0 0' }}>Add an extra layer of security to your admin account.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={twoFactorAuth}
                                    onChange={handle2FAToggle}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                            </div>

                            <div style={{ padding: '16px', backgroundColor: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <FiUserCheck size={24} color="#90273c" />
                                <div>
                                    <strong style={{ display: 'block', color: '#2d3748', fontSize: '14px' }}>Active Admin Role: <span style={{ color: '#90273c' }}>Super Admin</span></strong>
                                    <p style={{ fontSize: '12px', color: '#718096', margin: '2px 0 0 0' }}>You have full system access control across all operations.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for remaining tabs */}
                    {['appearance', 'system'].includes(activeTab) && (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: '#a0aec0' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.2 }}>
                                <FiSettings style={{ display: 'inline' }} />
                            </div>
                            <h3 style={{ color: '#4a5568', marginBottom: '8px' }}>
                                {menuGroups.flatMap(g => g.items).find(i => i.id === activeTab)?.label}
                            </h3>
                            <p style={{ fontSize: '14px' }}>This settings panel is under construction.</p>
                        </div>
                    )}
                    
                </div>
            </div>
        </div>
    );
}