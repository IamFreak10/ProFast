import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { ScaleLoader } from 'react-spinners';
import useAuth from '../../../Hooks/useAuth';
import Swal from 'sweetalert2';
import useTrackingLogger from '../../../Hooks/useTrackingLogger';

const PaymenForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { logTracking } = useTrackingLogger();
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const {
    isLoading,
    isPending,
    data: parcelInfo = {},
  } = useQuery({
    queryKey: ['parcels', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${id}`);
      return res.data;
    },
  });

  if (isLoading || isPending) {
    return <ScaleLoader height={61} radius={9} width={21} />;
  }
  let price = parcelInfo.cost;
  if (price < 80) {
    price = 80; // Minimum price set to 80
  }

  const amountInCents = price * 100;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);
    if (!card) {
      return;
    }
    // step-1:VAlidate card
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });
    if (error) {
      setError(error.message);
    } else {
      setError('');
      console.log('Payment Method:', paymentMethod);
    }
    //step-2:Create Payemnet Intent
    const res = await axiosSecure.post('/create-payment-intent', {
      amountInCents,
      id,
    });

    // doent console log response
    const clientSecret = res.data.clientSecret;

    //step-3:Confirm Payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: user.displayName,
          email: user.email,
        },
      },
    });

    if (result.error) {
      setError(result.error.message);
    } else {
      setError('');
      if (result.paymentIntent.status === 'succeeded') {
        console.log('payment successful');
        // Step-4 Mark Parcel PAid also Create Payment History
       
        const paymentData = {
          id,
          email: user.email,
          amount: price, // ✅ match backend
          paymentMethod: result.paymentIntent.payment_method_types,
          transactionId: result.paymentIntent.id,
          paid_at_string: new Date().toISOString(),
          paid_at: new Date(),
        };

        const paymentRes = await axiosSecure.post('/payments', paymentData);
        if (paymentRes.data.insertedId) {
          Swal.fire({
            title: '✅ Payment Successful!',
            html: `
    <div style="text-align: left; font-size: 15px; line-height: 1.6;">
      <p><strong>📦 Title:</strong> ${parcelInfo.title}</p>
      <p><strong>🧾 Tracking ID:</strong> <code>${parcelInfo.tracking_id}</code></p>
      <p><strong>💰 Paid Amount:</strong> <span style="color:#16a34a">৳${price}</span></p>
      
    </div>
  `,
            background: '#f0fdf4',
            color: '#166534',
            icon: 'success',
            iconColor: '#22c55e',
            showConfirmButton: true,
            confirmButtonText: '📦 Go to My Parcels',
            confirmButtonColor: '#22c55e',
            customClass: {
              popup: 'swal2-rounded swal2-shadow',
            },
            didOpen: () => {
              const popup = Swal.getPopup();
              if (popup) {
                popup.style.borderRadius = '20px';
                popup.style.padding = '25px';
                popup.style.boxShadow = '0 0 10px rgba(34, 197, 94, 0.3)';
              }
            },
          }).then(async (result) => {
            if (result.isConfirmed) {
              await logTracking({
                tracking_id: parcelInfo?.tracking_id,
                status: 'Parcels Charge is Paid',
                details: `Parcels Charge is Paid by ${user?.displayName}`,
                updated_by: user?.email,
              });
              navigate('/dashboard/myParcels');
            }
          });
        }
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
        💳 Pay For Parcel
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
          <CardElement className="bg-transparent focus:outline-none text-base text-gray-800 dark:text-white" />
        </div>

        <div>
          <button
            type="submit"
            disabled={!stripe}
            className="w-full text-black btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Pay ${price}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default PaymenForm;
