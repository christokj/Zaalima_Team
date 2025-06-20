import express, { Request, Response } from 'express';
const router = express.Router();

router.post('/webhook', express.json({ type: 'application/json' }), async (req: Request, res: Response) => {
    try {
        const event = req.body;

        // ✅ Process based on event type
        if (event.type === 'user.registered') {
            console.log('New user registered:', event.data);
        } else if (event.type === 'payment.success') {
            console.log('Payment received:', event.data);
        }

        res.status(200).json({ received: true });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid webhook' });
    }
});

export default router;
