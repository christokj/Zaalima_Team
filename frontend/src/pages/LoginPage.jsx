import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/authSlice';
import api from '../config/axiosInstance';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { StarsCanvas } from '../components';

function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [role, setRole] = useState('consumer'); // admin or consumer
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (role === 'admin') {
                const res = await api.post('/admin/login', { ...formData, role });

                localStorage.setItem('accessToken', res.data.accessToken);

                dispatch(
                    loginUser({
                        user: { email: res.data.email, role },
                    })
                );

                navigate('/admin');
            }
            if (role === 'consumer') {
                const res = await api.post('/public/login', { ...formData, role });

                localStorage.setItem('accessToken', res.data.accessToken);

                dispatch(
                    loginUser({
                        user: { email: res.data.email, role },
                    })
                );

                navigate('/');
            }



            toast.success('Login successful');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=" min-h-screen  flex items-center justify-center px-4">
            <div className="relative w-full max-w-md p-8 bg-transparent  rounded-2xl shadow-lg border border-white/20">
                <h2 className="text-3xl text-white font-bold text-center mb-6">Welcome </h2>

                {/* Role toggle */}
                <div className="flex justify-center gap-4 mb-6">
                    <button
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${role === 'consumer'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-black hover:bg-gray-100'
                            }`}
                        onClick={() => setRole('consumer')}
                        type="button"
                    >
                        Consumer
                    </button>
                    <button
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${role === 'admin'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-black hover:bg-gray-100'
                            }`}
                        onClick={() => setRole('admin')}
                        type="button"
                    >
                        Admin
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                        className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                            className="w-full p-3 pr-10 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div
                            className="absolute inset-y-0 right-3 flex items-center text-white cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`w-full cursor-pointer flex items-center justify-center gap-2 ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                            } text-white py-3 rounded-lg font-semibold transition-all duration-300`}
                        disabled={loading}
                    >
                        {loading && (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8z"
                                ></path>
                            </svg>
                        )}
                        {loading ? 'Logging in...' : `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
                    </button>
                </form>

                <p className={`mt-6 text-center text-gray-300 text-sm ${role === 'admin' ? 'hidden' : ''}`}>
                    Don’t have an account?{' '}
                    <span
                        onClick={() => navigate('/signup')}
                        className="text-blue-400 hover:underline cursor-pointer"
                    >
                        Create one
                    </span>
                </p>
            </div>
            <StarsCanvas />
        </div>
    );
}

export default LoginPage;
