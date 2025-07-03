import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../config/axiosInstance';

function SuccessPage() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (!sessionId) return;

        const saveOrder = async () => {
            try {
                const res = await api.post(
                    'public/save-custom-order',
                    { sessionId },
                    { withCredentials: true }
                );
                if (res.data.success) {
                    toast.success('Order saved successfully!');
                } else {
                    toast.warning('Payment succeeded, but order not saved');
                }
            } catch (err) {
                toast.error('Error saving order');
                console.error(err);
            }
        };

        saveOrder();
    }, []);

    return (
        <div className="text-white min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-4">✅ Payment Successful!</h1>
            <p className="text-lg">Thank you for your purchase. We’ll start working on your custom order!</p>
        </div>
    );
}

export default SuccessPage;
