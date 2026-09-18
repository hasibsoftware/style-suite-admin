'use client';

import React, { useState, useRef } from 'react';
import { FiX, FiBox, FiCheck, FiTrash2 } from 'react-icons/fi';

export default function AddProductModal({ onClose, onAddProduct }) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Cotton');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    
    // একাধিক ছবি সংরক্ষণের জন্য স্টেট
    const [imageFiles, setImageFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');

    // ইনপুট রিসেট করার জন্য রেফারেন্স
    const fileInputRef = useRef(null);

    // আপনার ImgBB API Key
    const IMGBB_API_KEY = 'c0754eaeff9130ab172386dce7971d56';

    const handleFileChange = (e) => {
        if (e.target.files) {
            // নতুন ছবিগুলোকে আগের ছবির সাথে যুক্ত করা হচ্ছে
            const newFiles = Array.from(e.target.files);
            setImageFiles(prevFiles => [...prevFiles, ...newFiles]);
        }
    };

    // সিলেক্ট করা ছবি মুছে ফেলার ফাংশন
    const handleClearImages = () => {
        setImageFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // ইনপুট বক্সও ক্লিয়ার করা হচ্ছে
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let uploadedImagesUrls = [];

        if (imageFiles.length > 0) {
            for (let i = 0; i < imageFiles.length; i++) {
                setUploadStatus(`Uploading image ${i + 1} of ${imageFiles.length}...`);
                const formData = new FormData();
                formData.append('image', imageFiles[i]);

                try {
                    const imgResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                        method: 'POST',
                        body: formData,
                    });
                    const imgData = await imgResponse.json();
                    
                    if (imgData.success) {
                        uploadedImagesUrls.push(imgData.data.url);
                    }
                } catch (error) {
                    console.error("Image upload failed:", error);
                }
            }
        }

        setUploadStatus('Saving product to database...');

        const stockNum = parseInt(stock, 10) || 0;
        let status = 'In stock';
        if (stockNum === 0) {
            status = 'Out stock';
        } else if (stockNum > 0 && stockNum <= 5) {
            status = 'Low stock';
        }

        const newProduct = {
            id: `#PRD-${Math.floor(1000 + Math.random() * 9000)}`,
            name: name.trim(),
            category,
            price: `৳${price}`,
            stock: stockNum,
            status,
            images: uploadedImagesUrls, 
            createdAt: new Date().toISOString()
        };

        await onAddProduct(newProduct);
        setLoading(false);
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', width: '450px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#1a202c' }}>
                        <FiBox style={{ color: '#90273c' }} /> Add New Product
                    </h3>
                    <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}><FiX size={20} /></button>
                </div>

                {/* ফর্মের ভেতরে স্ক্রল করার ব্যবস্থা */}
                <form onSubmit={handleSubmit} style={{ padding: '24px', maxHeight: '75vh', overflowY: 'auto' }}>
                    
                    {/* ছবি আপলোড ফিল্ড */}
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '600', color: '#4a5568' }}>Product Images (Gallery)</label>
                            
                            {/* ক্লিয়ার অল বাটন */}
                            {imageFiles.length > 0 && (
                                <button type="button" onClick={handleClearImages} style={{ background: 'transparent', border: 'none', color: '#e53e3e', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <FiTrash2 size={12} /> Clear All
                                </button>
                            )}
                        </div>

                        <div style={{ border: '1px dashed #cbd5e0', padding: '12px', borderRadius: '6px', textAlign: 'center', background: '#f8fafc' }}>
                            <input 
                                type="file" 
                                accept="image/*"
                                multiple 
                                onChange={handleFileChange}
                                ref={fileInputRef} // ইনপুট রিসেট করার জন্য 
                                style={{ fontSize: '13px', color: '#4a5568', width: '100%' }}
                            />
                        </div>

                        {/* সিলেক্ট করা ছবির সংখ্যা ও নাম দেখানোর অপশন */}
                        {imageFiles.length > 0 && (
                            <div style={{ marginTop: '10px', background: '#f0fff4', padding: '10px', borderRadius: '6px', border: '1px solid #c6f6d5' }}>
                                <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#2f855a', fontWeight: '700' }}>
                                    ✓ {imageFiles.length} images selected
                                </p>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {imageFiles.map((file, index) => (
                                        <span key={index} style={{ background: '#e2e8f0', color: '#4a5568', fontSize: '10px', padding: '3px 6px', borderRadius: '4px', fontWeight: '600' }}>
                                            {file.name.length > 12 ? file.name.substring(0, 12) + '...' : file.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#4a5568' }}>Product Name</label>
                        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none', color: '#1a202c', backgroundColor: '#fff' }} placeholder="e.g. Royal Red Jamdani Saree" />
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
                            <input type="number" required min="0" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none', color: '#1a202c', backgroundColor: '#fff' }} placeholder="4500" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#4a5568' }}>Stock Quantity</label>
                            <input type="number" required min="0" value={stock} onChange={(e) => setStock(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 'none', color: '#1a202c', backgroundColor: '#fff' }} placeholder="15" />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button type="button" onClick={onClose} style={{ padding: '10px 16px', borderRadius: '6px', border: '1px solid #cbd5e0', background: '#fff', cursor: 'pointer', fontWeight: '600', color: '#4a5568' }}>Cancel</button>
                        <button type="submit" disabled={loading} style={{ padding: '10px 16px', borderRadius: '6px', border: 'none', background: '#90273c', color: '#fff', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {loading ? uploadStatus || 'Saving...' : <><FiCheck /> Save Product</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}