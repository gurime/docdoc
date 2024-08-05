'use client';

import React, { useState, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { RiseLoader } from 'react-spinners'; 
import donateimg from '../../img/doc_care.png'
import Image from 'next/image';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [amountInput, setAmountInput] = useState(''); // Default input value with cents
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');

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
      const amountInCents = Math.round(parseFloat(amountInput.replace(/,/g, '')) * 100); // Convert dollars to cents, removing commas
      if (isNaN(amountInCents) || amountInCents <= 0) {
        throw new Error('Invalid amount');
      }

      // Post payment and user data to your API
      const { data } = await axios.post('/api/checkout/', {
        amount: amountInCents,
        firstName,
        lastName,
        address,
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
  }, [stripe, elements, amountInput, firstName, lastName, address]);

  const handleChange = (event: { complete: boolean | ((prevState: boolean) => boolean); }) => {
    setIsCardComplete(event.complete);
  };

  const formatCurrency = (value: string) => {
    // Remove non-numeric characters except commas and periods
    const numericValue = value.replace(/[^0-9.,]/g, '');
    
    // Split the input into dollars and cents
    let [dollars, cents] = numericValue.split('.');
    
    // Remove existing commas from dollars
    dollars = dollars.replace(/,/g, '');
    
    // Add commas for thousands
    dollars = dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // Limit cents to two decimal places
    if (cents) {
      cents = cents.slice(0, 2);
    }
    
    // Combine dollars and cents
    const formattedValue = cents ? `${dollars}.${cents}` : dollars;
    
    return `$${formattedValue}`;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatCurrency(rawValue);
    setAmountInput(formattedValue.slice(1)); // Remove the leading $ before setting state
  };
  return (
    <>
     <div className="donatebox">
     <div className="donatebox-left">
  <h1>Support Doctor Care</h1>
  <p>Your donation is more than just a financial contribution—it's a lifeline to those who need it most. With your help, we can continue to deliver compassionate and comprehensive healthcare to underserved communities. Every dollar you give directly impacts the well-being of individuals and families, ensuring they receive the care they deserve.</p>
  <p>By donating, you play a vital role in:</p>
  <ul>
    <li>Funding critical medical equipment, enabling our teams to provide cutting-edge treatments</li>
    <li>Supporting patient care programs that offer free or subsidized healthcare services</li>
    <li>Contributing to groundbreaking medical research, paving the way for future innovations</li>
    <li>Helping train the next generation of healthcare professionals, ensuring a brighter future for all</li>
  </ul>
  <p>Your generosity not only saves lives but also strengthens the entire community. Together, we can make a lasting impact. Thank you for standing with us in our mission to deliver hope and healing.</p>
</div>

      <div className='donatebox-right'>
        <Image src={donateimg} alt="" />
        <form onSubmit={handleSubmit} className="form-grid" style={{gridTemplateColumns:'1fr',color:'#000'}}>
          <h2 style={{color:'#000'}}>Make a Donation</h2>
          <div  className='form-group'>
            <label style={{color:'#000'}} className='form-label' htmlFor="firstName">First Name:</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
            <label style={{color:'#000'}} className='form-label' htmlFor="lastName">Last Name:</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
            <label style={{color:'#000'}} className='form-label' htmlFor="address">Address:</label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
              <label style={{color:'#000'}} className='form-label' htmlFor="amount">Donation Amount:</label>
              <input
                id="amount"
                type="text"
                value={`$${amountInput}`}
                onChange={handleAmountChange}
                required
                style={{color:'#000'}}
              />
            </div>
          <div className='form-group'>
            <label style={{color:'#000'}} className='form-label'>Card Details:</label>
            <CardElement
              onChange={handleChange}
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#000',
                    '::placeholder': {
                      color: '#000',
                    },
                  },
                  invalid: {
                    color: 'red',
                  },
                },
              }}
            />
          </div>
          <button className='donate-button' type="submit" disabled={processing || !isCardComplete}>
            {processing ? <RiseLoader color="#ffffff" size={10} /> : 'Donate Now'}
          </button>
          {error && <div className="error-message">{error}</div>}
          {paymentSuccess && <div className="success-message">Thank you for your donation!</div>}
        </form>
      </div>
    </div>
    </>
  );
};

const CheckoutPage = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default CheckoutPage;
