import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+$/;

const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;

const weakPatterns = new Set([
    'password', '123', '1234', '123456', 'qwerty', 'admin', 'letmein',
    'welcome', 'abc', 'abc123', 'iloveyou', 'test', 'pass', 'root'
]);

const containsWeakPattern = (str) => {
    const lower = str.toLowerCase();
    for (const pattern of weakPatterns) {
        if (lower.includes(pattern)) return true;
    }
    return false;
};

function SignupPage() {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        age: '',
        mobile: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        const email = formData.email.trim().toLowerCase();

        // Email validation
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Invalid email format';
        } else {
            const blockedDomains = ['tempmail.com', 'mailinator.com', '10minutemail.com'];
            const domain = email.split('@')[1];
            if (blockedDomains.includes(domain)) {
                newErrors.email = 'Disposable email addresses are not allowed';
            }
        }

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.name)) {
            newErrors.name = 'Name must be 2-50 characters and contain only letters and spaces';
        }

        // Age validation
        const age = Number(formData.age);
        if (!age || age < 13 || age > 120) {
            newErrors.age = 'Age must be between 13 and 120';
        }

        // Mobile validation
        if (!/^[6-9][0-9]{9}$/.test(formData.mobile)) {
            newErrors.mobile = 'Mobile must be 10 digits starting with 6-9';
        } else if (/^(.)\1{9}$/.test(formData.mobile)) {
            newErrors.mobile = 'Mobile number cannot have all identical digits';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8 || formData.password.length > 64) {
            newErrors.password = 'Password must be 8 to 64 characters long';
        } else if (!strongPasswordRegex.test(formData.password)) {
            newErrors.password = 'Must include uppercase, lowercase, number, and special character';
        } else if (containsWeakPattern(formData.password)) {
            newErrors.password = 'Password contains weak patterns like "1234" or "admin"';
        }

        // Confirm password
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:3000/api/v1/public/signup', {
                email: formData.email.trim().toLowerCase(),
                name: formData.name.trim(),
                age: Number(formData.age),
                mobile: formData.mobile,
                password: formData.password,
            });

            toast.success(res.data.message);
            navigate('/login-page');
        } catch (err) {
            if (err.response?.data?.errors) {
                const apiErrors = {};
                err.response.data.errors.forEach((e) => {
                    apiErrors[e.field] = e.message;
                });
                setErrors(apiErrors);
                toast.error('Please fix the form errors');
            } else {
                toast.error(err.response?.data?.message || 'Signup failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-center">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            value={formData.email}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    <div>
                        <input
                            name="name"
                            placeholder="Full Name"
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            value={formData.name}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    <div>
                        <input
                            name="age"
                            type="number"
                            placeholder="Age"
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            value={formData.age}
                        />
                        {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
                    </div>

                    <div>
                        <input
                            name="mobile"
                            placeholder="Mobile"
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            value={formData.mobile}
                        />
                        {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
                    </div>

                    <div>
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            value={formData.password}
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    <div>
                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            value={formData.confirmPassword}
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-green-600 text-white py-2 rounded transition ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                            }`}
                    >
                        {loading ? 'Signing up...' : 'Signup'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SignupPage;
