const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();
const Admin = require("../models/admin.model")
const razorpay = new Razorpay({
    key_id: 'rzp_test_cR8X4jkGEnx1zo',
    key_secret: '8skYLiHs4eBvJre5pSNp9VcQ',
});

router.post('/create-order', async (req, res) => {
    let data = req.user;
    let admin = await Admin.findOne({ username: data.username })
        .populate("students")
        .exec();

    try {
        const order = await razorpay.orders.create({
            amount: parseInt(admin.fees)*100, // Amount in paise (500.00 INR)
            currency: 'INR',
            receipt: 'receipt#1',
        });
        res.json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

module.exports = router;
