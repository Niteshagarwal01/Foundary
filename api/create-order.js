import Razorpay from 'razorpay';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { amount, currency = "INR", receipt } = req.body;

  if (!amount || amount < 100) {
    return res.status(400).json({ error: 'Invalid amount. Minimum amount is 100 paise.' });
  }

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount,
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    
    if (!order) {
      return res.status(500).json({ error: 'Failed to create order' });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Error:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
