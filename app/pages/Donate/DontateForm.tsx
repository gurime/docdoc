'use client';

import React, { useState, useCallback } from 'react';

import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = () => {
const stripe = useStripe();
const elements = useElements();
const [error, setError] = useState<string | null>(null);
const [processing, setProcessing] = useState(false);
const [paymentSuccess, setPaymentSuccess] = useState(false);
const [isCardComplete, setIsCardComplete] = useState(false);
const [selectedAmount, setSelectedAmount] = useState(2000); // Default to $20 (in cents)

const handleSubmit = useCallback(async (event: React.FormEvent) => {
event.preventDefault();
if (!stripe || !elements) {
setError('Stripe has not been initialized');
return;
}
    
setProcessing(true);
setError(null);
const cardElement = elements.getElement(CardElement);
if (!cardElement) {
setError('Card element not found');
setProcessing(false);
return;
}
    
try {
const { data } = await axios.post('/api/checkout/', {
amount: selectedAmount  // Use the selected amount
}, {
headers: {
'Content-Type': 'application/json',
}
});
    
const { clientSecret } = data;
if (!clientSecret) {
throw new Error('No client secret received from the server');
}
    
const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
payment_method: {
card: cardElement,
},
});
    
if (stripeError) {
setError(stripeError.message || 'An error occurred during payment processing');
} else if (paymentIntent?.status === 'succeeded') {
setPaymentSuccess(true);
setTimeout(() => setPaymentSuccess(false), 3000); 
} else {
setError(`Unexpected payment intent status: ${paymentIntent?.status}`);
}
} catch (error) {
console.error('Payment error:', error);
setError(error instanceof Error ? error.message : 'An unexpected error occurred');
} finally {
setProcessing(false);
}
}, [stripe, elements, selectedAmount]);
    
const handleChange = (event: { complete: boolean | ((prevState: boolean) => boolean); }) => {
setIsCardComplete(event.complete);
};
  return (
    <div>DontateForm</div>


  )
}
const CheckoutPage = () => (
<Elements stripe={stripePromise}>
<CheckoutForm />
</Elements>
);

export default CheckoutPage;