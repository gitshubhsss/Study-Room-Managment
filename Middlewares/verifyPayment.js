const Razorpay = require('razorpay');
const crypto = require('crypto');

// Razorpay instance
const razorpay = new Razorpay({
  key_id: 'rzp_test_cR8X4jkGEnx1zo',
  key_secret: '8skYLiHs4eBvJre5pSNp9VcQ',
});

// Middleware to verify payment
async function verifyPayment(req, res, next) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', razorpay.key_secret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      req.flash('error', 'Payment verification failed. Please try again.');
      return res.redirect('/newstudent');
    }

    // Payment verified successfully, proceed to the next middleware
    next();
  } catch (error) {
    console.error("Error verifying payment:", error);
    req.flash('error', 'An error occurred during payment verification.');
    return res.redirect('/newstudent');
  }
}

module.exports =  verifyPayment ;