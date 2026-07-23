const express = require('express');
const auth = require('../middlewares/auth');
const Reservation = require('../models/reservation');
const FoodOrder = require('../models/foodOrder');
const Order = require('../models/order');
const { generateInitiateSalePayload } = require('../utils/iciciPay');
const axios = require('axios');

const router = new express.Router();

// Initiate ICICI Ticket Payment
router.post('/reservations/icici/initiate', auth.simple, async (req, res) => {
    const { amount, reservationData } = req.body;
    if (!amount || amount <= 0) {
        return res.status(400).send({ error: 'Invalid amount' });
    }

    try {
        const returnUrl = `http://localhost:8080/reservations/icici/callback`;

        const orderId = `BKG${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // 1. Create a PENDING reservation first
        const reservation = new Reservation({
            ...reservationData,
            status: 'Pending',
            paymentId: orderId
        });
        await reservation.save();

        // 2. Generate ICICI payload
        const payload = generateInitiateSalePayload(amount, orderId, returnUrl);

        // 3. Call ICICI API
        const iciciRes = await axios.post('https://pgpayuat.icicibank.com/tsp/pg/api/v2/initiateSale', payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (iciciRes.data.responseCode !== 'R1000' && !iciciRes.data.redirectURI) {
            return res.status(400).send({ error: iciciRes.data.responseDescription || 'Payment initiation failed' });
        }

        let finalUrl = iciciRes.data.redirectURI;
        if (iciciRes.data.tranCtx) {
            finalUrl += `?tranCtx=${iciciRes.data.tranCtx}`;
        }

        // 4. Send URL to frontend for  redirectionss
        res.send({ paymentUrl: finalUrl });
    } catch (e) {
        res.status(500).send({ error: 'Server error', details: e.message });
    }
});

// ICICI Ticket Callback
router.post('/reservations/icici/callback', async (req, res) => {
    console.log('ICICI CALLBACK REQ.BODY:', req.body);
    const { merchantTxnNo, txnStatus, responseCode } = req.body;

    try {
        if (!merchantTxnNo) {
            console.error('Missing merchantTxnNo in payload');
            return res.redirect('http://localhost:3000?payment=error');
        }
        const reservation = await Reservation.findOne({ paymentId: merchantTxnNo });
        if (!reservation) {
            return res.redirect('http://localhost:3000?payment=error');
        }

        if (txnStatus !== 'SUC' && responseCode !== '000' && responseCode !== '0000') {
            // Payment Failed
            reservation.status = 'Cancelled';
            await reservation.save();
            return res.redirect(`http://localhost:3000/movie/booking/${reservation.movieId}?payment=failed`);
        }

        // Payment Success
        reservation.status = 'Paid';
        await reservation.save();

        return res.redirect(`http://localhost:3000/movie/booking/${reservation.movieId}?payment=success&reservationId=${reservation._id}`);
    } catch (error) {
        console.error('ICICI Callback Error:', error.message, req.body);
        return res.redirect('http://localhost:3000?payment=error');
    }
});

// Initiate ICICI Food Payment
router.post('/orders/food/icici/initiate', auth.simple, async (req, res) => {
    const { amount, orderData } = req.body;
    if (!amount || amount <= 0) return res.status(400).send({ error: 'Invalid amount' });

    try {
        const returnUrl = `http://localhost:8080/orders/food/icici/callback`;
        const paymentId = `FOD${Date.now()}${Math.floor(Math.random() * 1000)}`;

        const foodOrder = new FoodOrder({
            ...orderData,
            user: req.user._id,
            status: 'PENDING_PAYMENT',
            paymentId
        });
        await foodOrder.save();

        const payload = generateInitiateSalePayload(amount, paymentId, returnUrl);
        const iciciRes = await axios.post('https://pgpayuat.icicibank.com/tsp/pg/api/v2/initiateSale', payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (iciciRes.data.responseCode !== 'R1000' && !iciciRes.data.redirectURI) {
            return res.status(400).send({ error: iciciRes.data.responseDescription || 'Payment initiation failed' });
        }

        let finalUrl = iciciRes.data.redirectURI;
        if (iciciRes.data.tranCtx) finalUrl += `?tranCtx=${iciciRes.data.tranCtx}`;

        res.send({ paymentUrl: finalUrl });
    } catch (e) {
        res.status(500).send({ error: 'Server error', details: e.message });
    }
});

// ICICI Food Callback
router.post('/orders/food/icici/callback', async (req, res) => {
    const { merchantTxnNo, txnStatus, responseCode } = req.body;
    try {
        if (!merchantTxnNo) return res.redirect('http://localhost:3000/food-checkout?payment=error');
        const foodOrder = await FoodOrder.findOne({ paymentId: merchantTxnNo });
        if (!foodOrder) return res.redirect('http://localhost:3000/food-checkout?payment=error');

        if (txnStatus !== 'SUC' && responseCode !== '000' && responseCode !== '0000') {
            foodOrder.status = 'Cancelled';
            await foodOrder.save();
            return res.redirect(`http://localhost:3000/food-checkout?payment=failed`);
        }

        foodOrder.status = 'Pending';
        await foodOrder.save();

        return res.redirect(`http://localhost:3000/food-checkout?payment=success&orderId=${foodOrder._id}`);
    } catch (error) {
        return res.redirect('http://localhost:3000/food-checkout?payment=error');
    }
});

// Initiate ICICI Merchandise Payment
router.post('/orders/merch/icici/initiate', auth.simple, async (req, res) => {
    const { amount, orderData } = req.body;
    if (!amount || amount <= 0) return res.status(400).send({ error: 'Invalid amount' });

    try {
        const returnUrl = `http://localhost:8080/orders/merch/icici/callback`;
        const paymentId = `MRCH${Date.now()}${Math.floor(Math.random() * 1000)}`;

        const order = new Order({
            ...orderData,
            user: req.user._id,
            status: 'PENDING_PAYMENT',
            paymentId
        });
        await order.save();

        const payload = generateInitiateSalePayload(amount, paymentId, returnUrl);
        const iciciRes = await axios.post('https://pgpayuat.icicibank.com/tsp/pg/api/v2/initiateSale', payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (iciciRes.data.responseCode !== 'R1000' && !iciciRes.data.redirectURI) {
            return res.status(400).send({ error: iciciRes.data.responseDescription || 'Payment initiation failed' });
        }

        let finalUrl = iciciRes.data.redirectURI;
        if (iciciRes.data.tranCtx) finalUrl += `?tranCtx=${iciciRes.data.tranCtx}`;

        res.send({ paymentUrl: finalUrl });
    } catch (e) {
        res.status(500).send({ error: 'Server error', details: e.message });
    }
});

// ICICI Merchandise Callback
router.post('/orders/merch/icici/callback', async (req, res) => {
    const { merchantTxnNo, txnStatus, responseCode } = req.body;
    try {
        if (!merchantTxnNo) return res.redirect('http://localhost:3000/merch-checkout?payment=error');
        const order = await Order.findOne({ paymentId: merchantTxnNo });
        if (!order) return res.redirect('http://localhost:3000/merch-checkout?payment=error');

        if (txnStatus !== 'SUC' && responseCode !== '000' && responseCode !== '0000') {
            order.status = 'Cancelled';
            await order.save();
            return res.redirect(`http://localhost:3000/merch-checkout?payment=failed`);
        }

        order.status = 'Pending';
        await order.save();

        return res.redirect(`http://localhost:3000/merch-checkout?payment=success&orderId=${order._id}`);
    } catch (error) {
        return res.redirect('http://localhost:3000/merch-checkout?payment=error');
    }
});

module.exports = router;