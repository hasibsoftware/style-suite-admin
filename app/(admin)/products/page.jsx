'use client';

import { useState, useEffect } from 'react';
import styles from '../dashboard.module.css';
import { 
    FiSearch, FiBox, FiPlus, FiFilter, FiTrash2, 
    FiArchive, FiRefreshCw, FiX, FiChevronLeft, FiChevronRight, FiEdit, FiArrowUp, FiArrowDown 
} from 'react-icons/fi';
import AddProductModal from '@/components/AddProductModal';
import EditProductModal from '@/components/EditProductModal';

import toast, { Toaster } from 'react-hot-toast';

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export default function ProductsPage() {
    const [activeTab, setActiveTab] = useState('All products');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    
    // সর্টিংয়ের জন্য নতুন স্টেট (newest, low-to-high, high-to-low)
    const [sortBy, setSortBy] = useState('newest');
    
    // পেজিনেশনের জন্য নতুন স্টেট (প্রতি পেজে ৮টি করে প্রোডাক্ট দেখাবে)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [showAddModal, setShowAddModal] = useState(false);
    const [productsList, setProductsList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [editingProduct, setEditingProduct] = useState(null);

    const productTabs = ['All products', 'In stock', 'Low stock', 'Out stock', 'Archived'];
    const categories = ['All', 'Cotton', 'Jamdani', 'Katan', 'Silk', 'Georgette'];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "products"));
                const products = querySnapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() }));
                products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setProductsList(products);
            } catch (error) {
                toast.error("Failed to load products!");
                console.error("Error fetching products: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAddProduct = async (productData) => {
        try {
            const docRef = await addDoc(collection(db, "products"), productData);
            const newProduct = { firebaseId: docRef.id, ...productData };
            
            // 🔴 Dashboard er jonno Live Activity Log
            await addDoc(collection(db, "activity_logs"), {
                action: `Added new product: ${productData.name}`,
                timestamp: new Date().toISOString()
            });

            setProductsList([newProduct, ...productsList]);
            setShowAddModal(false);
            toast.success('Product added successfully!');
        } catch (error) {
            toast.error('Failed to add product.');
            console.error("Error adding product: ", error);
        }
    };

    const handleUpdateProduct = async (updatedProduct) => {
        try {
            const productRef = doc(db, "products", updatedProduct.firebaseId);
            await updateDoc(productRef, {
                name: updatedProduct.name,
                category: updatedProduct.category,
                price: updatedProduct.price,
                stock: updatedProduct.stock,
                status: updatedProduct.status,
                images: updatedProduct.images,
            });
            
            // 🔴 Dashboard er jonno Live Activity Log
            await addDoc(collection(db, "activity_logs"), {
                action: `Updated product: ${updatedProduct.name}`,
                timestamp: new Date().toISOString()
            });
            
            setProductsList(productsList.map(p => p.firebaseId === updatedProduct.firebaseId ? updatedProduct : p));
            setEditingProduct(null);
            toast.success('Product updated successfully!');
        } catch (error) {
            toast.error('Failed to update product.');
            console.error("Error updating product: ", error);
        }
    };

    const handleToggleArchive = async (firebaseId, currentStatus, productStock, e) => {
        e.stopPropagation();
        let newStatus;
        if (currentStatus === 'Archived') {
            const stockNum = parseInt(productStock, 10) || 0;
            if (stockNum === 0) newStatus = 'Out stock';
            else if (stockNum <= 5) newStatus = 'Low stock';
            else newStatus = 'In stock';
        } else {
            newStatus = 'Archived';
        }

        try {
            const productRef = doc(db, "products", firebaseId);
            await updateDoc(productRef, { status: newStatus });
            
            // 🔴 Dashboard er jonno Live Activity Log
            await addDoc(collection(db, "activity_logs"), {
                action: `Product status changed to ${newStatus}`,
                timestamp: new Date().toISOString()
            });

            setProductsList(productsList.map(p => p.firebaseId === firebaseId ? { ...p, status: newStatus } : p));
            
            if (newStatus === 'Archived') toast.success('Product moved to Archive.');
            else toast.success('Product restored successfully!');
        } catch (error) {
            toast.error('Failed to change status.');
            console.error("Error updating archive status: ", error);
        }
    };

    const handleDelete = async (firebaseId, e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this product permanently?")) return;
        try {
            await deleteDoc(doc(db, "products", firebaseId));
            
            // 🔴 Dashboard er jonno Live Activity Log
            await addDoc(collection(db, "activity_logs"), {
                action: `Deleted a product permanently`,
                timestamp: new Date().toISOString()
            });

            setProductsList(productsList.filter(p => p.firebaseId !== firebaseId));
            toast.success('Product deleted permanently.');
        } catch (error) {
            toast.error('Failed to delete product.');
            console.error("Error deleting product: ", error);
        }
    };

    const openGallery = (product) => {
        const hasImages = (product.images && product.images.length > 0) || product.imageUrl;
        if (hasImages) {
            setSelectedProduct(product);
            setCurrentImageIndex(0);
        }
    };

    // ১. ফিল্টারিং এবং সর্টিং লজিক
    const filteredProducts = productsList.filter(item => {
        let matchesTab = true;
        if (activeTab === 'All products') matchesTab = item.status !== 'Archived';
        else matchesTab = item.status === activeTab;
        
        const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = (item.name?.toLowerCase().includes(searchLower)) || (item.id?.toLowerCase().includes(searchLower));
        return matchesTab && matchesCat && matchesSearch;
    }).sort((a, b) => {
        const priceA = parseFloat(a.price?.replace('৳', '') || 0);
        const priceB = parseFloat(b.price?.replace('৳', '') || 0);

        if (sortBy === 'low-to-high') return priceA - priceB;
        if (sortBy === 'high-to-low') return priceB - priceA;
        // Default: newest first
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // ২. পেজিনেশন লজিক
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div style={{ padding: '0 4px' }}>
            <Toaster position="top-right" reverseOrder={false} />

            <div className={styles.productHeaderBar}>
                <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a202c', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FiBox style={{ color: '#90273c' }} /> Product Inventory Management
                    </h2>
                    <p style={{ fontSize: '13px', color: '#718096', margin: '4px 0 0 0' }}>Monitor stock levels, organize product categories, and manage catalogue.</p>
                </div>
                <button onClick={() => setShowAddModal(true)} style={{ background: '#90273c', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(144, 39, 60, 0.2)' }}>
                    <FiPlus style={{ fontSize: '16px' }} /> Add New Product
                </button>
            </div>

            <div className={styles.productTabs}>
                {productTabs.map((tab) => (
                    <button key={tab} className={`${styles.productTabBtn} ${activeTab === tab ? styles.activeProductTab : ''}`} onClick={() => { setActiveTab(tab); setCurrentPage(1); }}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* কন্ট্রোল বার: সার্চ, ক্যাটাগরি ফিল্টার এবং সর্টিং */}
            <div className={styles.productControlBar} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #cbd5e0', borderRadius: '8px', padding: '8px 14px', flexGrow: 1, maxWidth: '350px' }}>
                    <FiSearch style={{ color: '#718096', marginRight: '10px', fontSize: '16px' }} />
                    <input type="text" placeholder="Search product name or ID..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px', color: '#1a202c' }} />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                    {/* ক্যাটাগরি ড্রপডাউন */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#4a5568' }}><FiFilter /> Category:</span>
                        <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }} style={{ background: '#f8fafc', border: '1px solid #cbd5e0', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#2d3748', outline: 'none', cursor: 'pointer' }}>
                            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    {/* সর্টিং ড্রপডাউন */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#4a5568' }}>Sort By:</span>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ background: '#f8fafc', border: '1px solid #cbd5e0', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#2d3748', outline: 'none', cursor: 'pointer' }}>
                            <option value="newest">Newest First</option>
                            <option value="low-to-high">Price: Low to High</option>
                            <option value="high-to-low">Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>Loading products from database...</div>
            ) : (
                <>
                    <div className={styles.productGridContainer}>
                        {currentProducts.length > 0 ? (
                            currentProducts.map((product) => {
                                const coverImage = product.images && product.images.length > 0 ? product.images[0] : product.imageUrl;

                                return (
                                    <div key={product.firebaseId} className={styles.productCard}>
                                        
                                        <div 
                                            className={styles.productImgPlaceholder} 
                                            onClick={() => openGallery(product)}
                                            style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', cursor: coverImage ? 'pointer' : 'default' }}
                                        >
                                            {coverImage ? (
                                                <img src={coverImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', transition: 'transform 0.3s' }} />
                                            ) : (
                                                <span style={{ color: '#a0aec0', fontSize: '12px', fontWeight: '600' }}>📦 No Image</span>
                                            )}
                                            
                                            <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
                                                <button onClick={(e) => { e.stopPropagation(); setEditingProduct(product); }} style={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer', color: '#3182ce', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Edit Product">
                                                    <FiEdit size={14} />
                                                </button>

                                                <button onClick={(e) => handleToggleArchive(product.firebaseId, product.status, product.stock, e)} style={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer', color: product.status === 'Archived' ? '#3182ce' : '#d69e2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={product.status === 'Archived' ? 'Restore Product' : 'Archive Product'}>
                                                    {product.status === 'Archived' ? <FiRefreshCw size={14} /> : <FiArchive size={14} />}
                                                </button>

                                                <button onClick={(e) => handleDelete(product.firebaseId, e)} style={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer', color: '#e53e3e', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete Permanently">
                                                    <FiTrash2 size={14} />
                                                </button>
                                            </div>

                                            {product.images && product.images.length > 1 && (
                                                <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '11px', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                                                    + {product.images.length} Photos
                                                </div>
                                            )}
                                        </div>

                                        <div className={styles.productCardBody}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                                                <span style={{ fontSize: '11px', fontWeight: '700', color: '#90273c', background: '#fdf2f4', padding: '2px 8px', borderRadius: '4px' }}>{product.category || 'N/A'}</span>
                                                <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', background: product.status === 'In stock' ? '#c6f6d5' : product.status === 'Low stock' ? '#feebc8' : product.status === 'Out stock' ? '#fed7d7' : '#ebf8ff', color: product.status === 'In stock' ? '#22543d' : product.status === 'Low stock' ? '#c05621' : product.status === 'Out stock' ? '#9b2c2c' : '#2b6cb0' }}>{product.status || 'Unknown'}</span>
                                            </div>
                                            <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1a202c', margin: '6px 0 2px 0' }}>{product.name}</h4>
                                            <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#718096' }}>ID: {product.id}</p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px solid #edf2f7', paddingTop: '10px' }}>
                                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#718096' }}>Stock: <strong>{product.stock || 0} pcs</strong></span>
                                                <span style={{ fontSize: '15px', fontWeight: '800', color: '#90273c' }}>{product.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#718096', fontWeight: '600' }}>No products found matching your criteria.</div>
                        )}
                    </div>

                    {/* ৩. পেজিনেশন বাটন */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '30px', marginBottom: '20px' }}>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                                disabled={currentPage === 1}
                                style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e0', background: currentPage === 1 ? '#edf2f7' : '#fff', color: currentPage === 1 ? '#a0aec0' : '#2d3748', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '13px' }}
                            >
                                Previous
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setCurrentPage(i + 1)}
                                    style={{ 
                                        width: '35px', height: '35px', borderRadius: '6px', border: 'none', 
                                        background: currentPage === i + 1 ? '#90273c' : '#fff', 
                                        color: currentPage === i + 1 ? '#fff' : '#4a5568', 
                                        fontWeight: '700', fontSize: '13px', cursor: 'pointer',
                                        boxShadow: currentPage === i + 1 ? '0 2px 4px rgba(144, 39, 60, 0.3)' : 'inset 0 0 0 1px #cbd5e0'
                                    }}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                                disabled={currentPage === totalPages}
                                style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e0', background: currentPage === totalPages ? '#edf2f7' : '#fff', color: currentPage === totalPages ? '#a0aec0' : '#2d3748', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '13px' }}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
            {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} onAddProduct={handleAddProduct} />}
            
            {editingProduct && (
                <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} onUpdateProduct={handleUpdateProduct} />
            )}

            {/* Premium Image Gallery Lightbox */}
            {selectedProduct && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.92)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
                    
                    <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '25px', right: '35px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '10px', borderRadius: '50%', cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiX size={28} />
                    </button>

                    {selectedProduct.images && selectedProduct.images.length > 1 && (
                        <button 
                            onClick={() => setCurrentImageIndex(prev => (prev === 0 ? selectedProduct.images.length - 1 : prev - 1))}
                            style={{ position: 'absolute', left: '40px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '15px', borderRadius: '50%', cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <FiChevronLeft size={35} />
                        </button>
                    )}

                    {selectedProduct.images && selectedProduct.images.length > 1 && (
                        <button 
                            onClick={() => setCurrentImageIndex(prev => (prev === selectedProduct.images.length - 1 ? 0 : prev + 1))}
                            style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '15px', borderRadius: '50%', cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <FiChevronRight size={35} />
                        </button>
                    )}

                    <div style={{ width: '100%', height: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 100px' }}>
                        <img 
                            src={selectedProduct.images ? selectedProduct.images[currentImageIndex] : selectedProduct.imageUrl} 
                            alt={selectedProduct.name} 
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 15px 40px rgba(0,0,0,0.6)' }} 
                        />
                    </div>

                    <h3 style={{ color: '#fff', marginTop: '20px', fontWeight: '600', fontSize: '18px' }}>
                        {selectedProduct.name} <span style={{ fontSize: '14px', color: '#a0aec0', fontWeight: '400', marginLeft: '8px' }}>({currentImageIndex + 1} / {selectedProduct.images ? selectedProduct.images.length : 1})</span>
                    </h3>

                    {selectedProduct.images && selectedProduct.images.length > 1 && (
                        <div style={{ display: 'flex', gap: '12px', marginTop: '15px' }}>
                            {selectedProduct.images.map((imgUrl, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => setCurrentImageIndex(index)}
                                    style={{ 
                                        width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', 
                                        border: currentImageIndex === index ? '3px solid #fff' : '2px solid transparent', 
                                        opacity: currentImageIndex === index ? 1 : 0.4, 
                                        transition: 'all 0.3s ease',
                                        transform: currentImageIndex === index ? 'scale(1.05)' : 'scale(1)'
                                    }}
                                >
                                    <img src={imgUrl} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}