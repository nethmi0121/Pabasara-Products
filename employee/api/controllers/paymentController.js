import Payment from '../models/paymentModel.js';
import stripe from 'stripe';

const Stripe = stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
    const { userId, amount, currency, paymentMethodId } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    try {
        const paymentIntent = await Stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            payment_method: paymentMethodId,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never',
            },
        });

        const payment = new Payment({
            userId,
            amount,
            currency,
            paymentIntentId: paymentIntent.id,
            status: 'pending'
        });

        await payment.save();

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentId: payment.id,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const confirmPayment = async (req, res) => {
    const { paymentIntentId } = req.body;
    try {
        const paymentIntent = await Stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            return res.status(200).json({
                success: true,
                message: 'This PaymentIntent has already been confirmed and succeeded.',
                status: paymentIntent.status
            });
        }

        if (paymentIntent.status === 'canceled') {
            return res.status(400).json({
                success: false,
                message: 'This PaymentIntent has been canceled and cannot be confirmed.'
            });
        }

        const confirmedPaymentIntent = await Stripe.paymentIntents.confirm(paymentIntentId);

        const payment = await Payment.findOne({ paymentIntentId: confirmedPaymentIntent.id });
        if (payment) {
            if (confirmedPaymentIntent.status === 'succeeded') {
                payment.status = 'successful';
            } else if (confirmedPaymentIntent.status === 'failed') {
                payment.status = 'failed';
            }
            await payment.save();
        }

        res.status(200).json({
            success: true,
            message: 'Payment confirmed',
            status: confirmedPaymentIntent.status
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updatePaymentStatus = async (req, res) => {
    const { paymentIntentId, status } = req.body;
    try {
        const validStatuses = ['pending', 'successful', 'failed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status. Valid statuses are: pending, successful, failed.' });
        }

        const payment = await Payment.findOne({ paymentIntentId });
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found.' });
        }

        payment.status = status;
        await payment.save();

        res.status(200).json({ success: true, message: `Payment status updated to ${status}`, payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllPayment = async (req, res) => {
    try {
        const allPayment = await Payment.find().sort({ createdAt: -1 });
        const count = await Payment.countDocuments();
        res.status(200).json({ message: 'Payment List', list: allPayment, count });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const deletePayment = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPayment = await Payment.findByIdAndDelete(id);
        if (!deletedPayment) {
            return res.status(404).json({ success: false, message: 'Payment not found.' });
        }
        res.status(200).json({ success: true, message: 'Payment deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};