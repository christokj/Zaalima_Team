import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import api from '../../config/axiosInstance';
import { loadStripe } from '@stripe/stripe-js';

const apparelOptions = ['T-Shirt', 'Hoodie', 'Sweatshirt'];

const apparelPrices = {
    'T-Shirt': 1999,
    'Hoodie': 2999,
    'Sweatshirt': 2499,
};


const CustomClothesDesigner = () => {
    const [selectedApparel, setSelectedApparel] = useState('T-Shirt');
    const [previewUrl, setPreviewUrl] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [size, setSize] = useState('M');
    const [position, setPosition] = useState({ x: 80, y: 80 });
    const [scale, setScale] = useState(1);
    const [uploading, setUploading] = useState(false);
    const dragging = useRef(false);
    const designImageRef = useRef('');

    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_Publishable_key);

    const mockups = import.meta.glob('../../assets/*.jpg', {
        eager: true,
        import: 'default',
    });

    const selectedKey = `../../assets/${selectedApparel.toLowerCase()}.jpg`;
    const selectedImage = mockups[selectedKey];

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload a valid image file.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size exceeds 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const res = await api.post('/public/upload-design', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            designImageRef.current = res.data.imageUrl;
            toast.success('Design image uploaded successfully!');
            setPreviewUrl(res.data.imageUrl);

        } catch (err) {
            console.error('Upload failed:', err);
            toast.error('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleMouseDown = () => (dragging.current = true);
    const handleMouseUp = () => (dragging.current = false);
    const handleMouseMove = (e) => {
        if (!dragging.current) return;

        const container = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - container.left - 50;
        const y = e.clientY - container.top - 50;
        setPosition({ x, y });
    };

    const handleOrderAndPayment = async () => {
        if (!customerName || !designImageRef.current) {
            toast.error('Please enter name and upload design.');
            return;
        }

        try {
            const stripe = await stripePromise;

            const payload = {
                apparel: selectedApparel,
                designImageUrl: designImageRef.current,
                previewUrl,
                customerName,
                size,
                position,
                scale,
                price
            };

            const res = await api.post('/public/custom-design-checkout-session', payload);
            const sessionId = res.data.sessionId;
            await stripe.redirectToCheckout({ sessionId });
        } catch (error) {
            if (error.response.data) {
                toast.error(error.response.data.message);
            } else if (error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to process payment');

            }
        }
    };

    return (
        <div className="p-10 text-white min-h-screen flex flex-col items-center gap-8">
            <h1 className="text-3xl font-bold">Custom Clothes Designer</h1>

            {/* Apparel Selection */}
            <div className="flex gap-4">
                {apparelOptions.map((item) => (
                    <button
                        key={item}
                        className={`px-4 py-2 rounded ${selectedApparel === item ? 'bg-blue-600' : 'bg-gray-700'}`}
                        onClick={() => setSelectedApparel(item)}
                    >
                        {item}
                    </button>
                ))}


            </div>

            {/* Upload */}
            <div className="flex flex-col items-center gap-2">
                <label className="text-sm">Upload your design (PNG/JPG)</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="p-2 rounded bg-gray-100 text-black cursor-pointer"
                />
                {uploading && <p className="text-yellow-400">Uploading...</p>}
            </div>

            {/* Preview */}
            <div
                className="relative w-72 h-72 bg-white rounded-lg shadow-lg overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <img src={selectedImage} alt="Mockup" className="w-full h-full object-cover pointer-events-none" />
                {previewUrl && (
                    <img
                        src={previewUrl}
                        alt="Design"
                        className="absolute"
                        style={{
                            top: position.y,
                            left: position.x,
                            width: `${100 * scale}px`,
                            height: `${100 * scale}px`,
                            cursor: 'move',
                            userSelect: 'none',
                        }}
                        draggable={false}
                        onMouseDown={handleMouseDown}
                    />
                )}
            </div>

            {/* Scale Control */}
            <div className="flex items-center gap-2">
                <label>Resize:</label>
                <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="cursor-pointer"
                />
                <span>{Math.round(scale * 100)}%</span>
            </div>

            {/* Order */}
            <div className="w-full max-w-md grid gap-4">
                <input
                    type="text"
                    placeholder="Your Name"
                    className="px-4 py-2 rounded bg-gray-50 text-black"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />
                <select
                    className="px-4 py-2 rounded bg-gray-50 text-black"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                >
                    <option value="S">Small</option>
                    <option value="M">Medium</option>
                    <option value="L">Large</option>
                    <option value="XL">XL</option>
                </select>
                <p className="text-lg font-semibold text-green-400">
                    Price: ₹{(apparelPrices[selectedApparel] / 100).toFixed(2)}
                </p>
                <button
                    className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white font-semibold"
                    onClick={handleOrderAndPayment}
                >
                    Place Order
                </button>
            </div>
        </div>
    );
};

export default CustomClothesDesigner;
