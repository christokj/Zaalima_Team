import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { StarsCanvas } from '../components';

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+$/;
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;
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
        email: '', name: '', age: '', mobile: '', password: '', confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        const email = formData.email.trim().toLowerCase();

        if (!email) newErrors.email = 'Email is required';
        else if (!emailRegex.test(email)) newErrors.email = 'Invalid email';
        else {
            const blockedDomains = ['tempmail.com', 'mailinator.com', '10minutemail.com'];
            const domain = email.split('@')[1];
            if (blockedDomains.includes(domain)) newErrors.email = 'Disposable email not allowed';
        }

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.name)) {
            newErrors.name = '2-50 letters & spaces only';
        }

        const age = Number(formData.age);
        if (!age || age < 13 || age > 120) newErrors.age = 'Age must be 13–120';

        if (!/^[6-9][0-9]{9}$/.test(formData.mobile)) {
            newErrors.mobile = 'Enter valid 10-digit mobile';
        } else if (/^(.)\1{9}$/.test(formData.mobile)) {
            newErrors.mobile = 'All digits cannot be same';
        }

        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 8 || formData.password.length > 64) {
            newErrors.password = '8–64 characters required';
        } else if (!strongPasswordRegex.test(formData.password)) {
            newErrors.password = 'Include uppercase, lowercase, number, symbol';
        } else if (containsWeakPattern(formData.password)) {
            newErrors.password = 'Password too weak';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords don’t match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
                err.response.data.errors.forEach((e) => (apiErrors[e.field] = e.message));
                setErrors(apiErrors);
                toast.error('Please fix the errors');
            } else {
                toast.error(err.response?.data?.message || 'Signup failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-30  ">
            <div className="relative w-full max-w-md p-8 bg-transparent rounded-2xl shadow-lg border border-white/20">
                <h2 className="text-3xl text-white font-bold text-center mb-6">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                        { name: 'email', type: 'email', placeholder: 'Email' },
                        { name: 'name', type: 'text', placeholder: 'Full Name' },
                        { name: 'age', type: 'number', placeholder: 'Age' },
                        { name: 'mobile', type: 'text', placeholder: 'Mobile' },
                    ].map(({ name, type, placeholder }) => (
                        <div key={name}>
                            <input
                                type={type}
                                name={name}
                                placeholder={placeholder}
                                onChange={handleChange}
                                value={formData[name]}
                                className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors[name] && <p className="text-red-400 text-sm">{errors[name]}</p>}
                        </div>
                    ))}

                    {/* Password */}
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            value={formData.password}
                            className="w-full p-3 pr-10 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div
                            className="absolute inset-y-0 right-3 flex items-center text-white cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </div>
                        {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            onChange={handleChange}
                            value={formData.confirmPassword}
                            className="w-full p-3 pr-10 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div
                            className="absolute inset-y-0 right-3 flex items-center text-white cursor-pointer"
                            onClick={() => setShowConfirm(!showConfirm)}
                        >
                            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex items-center justify-center gap-2 ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                            } text-white py-3 rounded-lg font-semibold transition-all duration-300`}
                    >
                        {loading && (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                        )}
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-300 text-sm">
                    Already have an account?{' '}
                    <span
                        onClick={() => navigate('/login-page')}
                        className="text-blue-400 hover:underline cursor-pointer"
                    >
                        Login
                    </span>
                </p>
            </div>
            <StarsCanvas />
        </div>
    );
}

export default SignupPage;
