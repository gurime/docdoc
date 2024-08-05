import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import supabase from '@/app/Config/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);



export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount,  firstName, lastName, address } = body;

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
firstName, 
lastName      },
    });

    // Insert user details into Supabase
    const { error: supabaseError } = await supabase
      .from('payments')
      .insert([
        {
          amount: amount,
          first_name: firstName,
          last_name: lastName,
          address: address,
          stripe_payment_intent_id: paymentIntent.id,
        }
      ]);

    if (supabaseError) {
      console.error('Error inserting data into Supabase:', supabaseError);
      return NextResponse.json({ error: 'An error occurred while saving payment details.' }, { status: 500 });
    }

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    return NextResponse.json({ error: 'An error occurred while creating the PaymentIntent.' }, { status: 500 });
  }
}
