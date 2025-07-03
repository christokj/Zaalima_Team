import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/axiosInstance';
import { toast } from 'sonner';

const AddEditProduct = () => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        oldPrice: '',
        stock: '',
        brand: '',
        size: '',
        category: '',
        photoUrl: '',
    });

    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    // Fetch product if editing
    useEffect(() => {
        if (id) {
            api
                .get(`/admin/getProduct/${id}`)
                .then((res) => setForm(res.data.data))
                .catch(() => toast.error('Failed to load product'));
        }
    }, [id]);

    // Handle image upload
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await api.post('/admin/upload-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setForm((prev) => ({ ...prev, photoUrl: res.data.imageUrl }));
            toast.success('Image uploaded');
        } catch (err) {
            console.error('Image upload error:', err);
            toast.error('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Submit product form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.photoUrl) {
            toast.error('Please upload a product image');
            return;
        }

        try {
            setSubmitting(true);
            if (id) {
                await api.put(`/admin/products/${id}`, form);
                toast.success('Product updated successfully!');
            } else {
                await api.post('/admin/products', form);
                toast.success('Product added successfully!');
            }
            navigate('/admin/products');
        } catch (err) {
            console.error('Save product error:', err);
            toast.error(err?.response?.data?.message || 'Failed to save product');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex justify-center items-center px-4 py-10">
            <div className="w-full max-w-2xl bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">
                    {id ? 'Edit Product' : 'Add New Product'}
                </h1>

                <form onSubmit={handleSubmit} className="grid gap-5 text-white font-medium">
                    <div>
                        <label className="mb-1 block">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Product Title"
                            className="px-4 py-2 rounded bg-white/90 text-black w-full"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Product Description"
                            rows={4}
                            className="px-4 py-2 rounded bg-white/90 text-black w-full"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="Price"
                                className="px-4 py-2 rounded bg-white/90 text-black w-full"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block">Old Price</label>
                            <input
                                type="number"
                                name="oldPrice"
                                value={form.oldPrice}
                                onChange={handleChange}
                                placeholder="Old Price"
                                className="px-4 py-2 rounded bg-white/90 text-black w-full"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={form.stock}
                                onChange={handleChange}
                                placeholder="Stock"
                                className="px-4 py-2 rounded bg-white/90 text-black w-full"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block">Brand</label>
                            <input
                                type="text"
                                name="brand"
                                value={form.brand}
                                onChange={handleChange}
                                placeholder="Brand"
                                className="px-4 py-2 rounded bg-white/90 text-black w-full"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block">Size</label>
                            <input
                                type="text"
                                name="size"
                                value={form.size}
                                onChange={handleChange}
                                placeholder="Size"
                                className="px-4 py-2 rounded bg-white/90 text-black w-full"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block">Category</label>
                            <input
                                type="text"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                placeholder="Category"
                                className="px-4 py-2 rounded bg-white/90 text-black w-full"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block">Upload Product Image</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="text-white w-full"
                        />
                        {uploading && <p className="text-yellow-400 mt-2">Uploading image...</p>}
                        {form.photoUrl && (
                            <img
                                src={form.photoUrl}
                                alt="Preview"
                                className="mt-4 w-48 h-48 object-cover border-2 border-white rounded-lg"
                            />
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition duration-300"
                    >
                        {submitting ? 'Submitting...' : id ? 'Update Product' : 'Add Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddEditProduct;
