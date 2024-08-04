import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
try {
const body = await req.json();
const { amount, userId, orderId, productDescription } = body;

// Ensure 'amount' is valid
if (typeof amount !== 'number' || amount <= 0) {
return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
}

// Create a PaymentIntent with the specified amount
const paymentIntent = await stripe.paymentIntents.create({
amount: amount,  // Use the amount from the request body
currency: 'usd',
automatic_payment_methods: {
enabled: true,
},
metadata: {
userId: userId || 'N/A',
orderId: orderId || 'N/A',
productDescription: productDescription || 'N/A',}
});

return NextResponse.json({ clientSecret: paymentIntent.client_secret });
} catch (error) {
console.error('Error creating PaymentIntent:', error);
return NextResponse.json({ error: 'An error occurred while creating the PaymentIntent.' }, { status: 500});
}
}