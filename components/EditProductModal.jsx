'use client';

import React, { useState, useRef } from 'react';
import { FiX, FiEdit, FiCheck, FiTrash2 } from 'react-icons/fi';

export default function EditProductModal({ product, onClose, onUpdateProduct }) {
    const [name, setName] = useState(product.name || '');
    const [category, setCategory] = useState(product.category || 'Cotton');
    const initialPrice = product.price ? product.price.replace('৳', '') : '';
    const [price, setPrice] = useState(initialPrice);
    const [stock, setStock] = useState(product.stock || 0);
    
    const [existingImages, setExistingImages] = useState(product.images || (product.imageUrl ? [product.imageUrl] : []));
    const [newImageFiles, setNewImageFiles] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const fileInputRef = useRef(null);

    const IMGBB_API_KEY = 'c0754eaeff9130ab172386dce7971d56';

    const handleFileChange = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setNewImageFiles(prev => [...prev, ...files]);
        }
    };

    const handleClearNewImages = () => {
        setNewImageFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleClearExistingImages = () => {
        if (window.confirm("Are you sure you want to remove all existing images?")) {
            setExistingImages([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let finalImagesUrls = [...existingImages];

        if (newImageFiles.length > 0) {
            for (let i = 0; i < newImageFiles.length; i++) {
                setUploadStatus(`Uploading new image ${i + 1} of ${newImageFiles.length}...`);
                const formData = new FormData();
                formData.append('image', newImageFiles[i]);

                try {
                    const imgResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                        method: 'POST',
                        body: formData,
                    });
                    const imgData = await imgResponse.json();
                    
                    if (imgData.success) {
                        finalImagesUrls.push(imgData.data.url);
                    }
                } catch (error) {
                    console.error("Image upload failed:", error);
                }
            }
        }

        setUploadStatus('Updating product...');

        const stockNum = parseInt(stock, 10) || 0;
        let status = 'In stock';
        if (stockNum === 0) status = 'Out stock';
        else if (stockNum > 0 && stockNum <= 5) status = 'Low stock';

        const updatedProduct = {
            ...product,
            name: name.trim(),
            category,
            price: `৳${price}`,
            stock: stockNum,
            status,
            images: finalImagesUrls,
        };

        await onUpdateProduct(updatedProduct);
        setLoading(false);
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', width: '450px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#1a202c' }}>
                        <FiEdit style={{ color: '#3182ce' }} /> Edit Product
                    </h3>
                    <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}><FiX size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '24px', maxHeight: '75vh', overflowY: 'auto' }}>
                    
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '600', color: '#4a5568' }}>Images (Gallery)</label>
                            {existingImages.length > 0 && (
                                <button type="button" onClick={handleClearExistingImages} style={{ background: 'transparent', border: 'none', color: '#e53e3e', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                                    Remove Old Images
                                </button>
                            )}
                        </div>

                        {existingImages.length > 0 && (
                            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                                {existingImages.map((img, i) => (
                                    <img key={i} src={img} alt="old" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e0' }} />
                                ))}
                            </div>
                        )}

                        <div style={{ border: '1px dashed #cbd5e0', padding: '12px', borderRadius: '6px', textAlign: 'center', background: '#f8fafc' }}>
                            <input type="file" accept="image/*" multiple onChange={handleFileChange} ref={fileInputRef} style={{ fontSize: '13px', color: '#4a5568', width: '100%' }} />
                        </div>

                        {newImageFiles.length > 0 && (
                            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ebf8ff', padding: '8px', borderRadius: '6px', border: '1px solid #bee3f8' }}>
                                <span style={{ fontSize: '12px', color: '#2b6cb0', fontWeight: '600' }}>+{newImageFiles.length} New images selected</span>
                                <FiTrash2 onClick={handleClearNewImages} style={{ color: '#e53e3e', cursor: 'pointer' }} size={14} />
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#4a5568' }}>Product Name</label>
                        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none', color: '#1a202c', backgroundColor: '#fff' }} />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#4a5568' }}>Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none', color: '#1a202c', backgroundColor: '#fff' }}>
                            <option value="Cotton">Cotton</option>
                            <option value="Jamdani">Jamdani</option>
                            <option value="Katan">Katan</option>
                            <option value="Silk">Silk</option>
                            <option value="Georgette">Georgette</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#4a5568' }}>Price (৳)</label>
                            <input type="number" required min="0" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none', color: '#1a202c', backgroundColor: '#fff' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#4a5568' }}>Stock Quantity</label>
                            <input type="number" required min="0" value={stock} onChange={(e) => setStock(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none', color: '#1a202c', backgroundColor: '#fff' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button type="button" onClick={onClose} style={{ padding: '10px 16px', borderRadius: '6px', border: '1px solid #cbd5e0', background: '#fff', cursor: 'pointer', fontWeight: '600', color: '#4a5568' }}>Cancel</button>
                        <button type="submit" disabled={loading} style={{ padding: '10px 16px', borderRadius: '6px', border: 'none', background: '#3182ce', color: '#fff', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {loading ? uploadStatus || 'Updating...' : <><FiCheck /> Update Product</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}