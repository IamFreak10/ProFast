import React from 'react';
import trackingIcon from '../../../assets/live-tracking.png';
import safeDeliveryIcon from '../../../assets/safe-delivery.png';
import FacilityCard from './FacilityCard';
const Facilities = () => {
  const features = [
    {
      title: 'Live Parcel Tracking',
      description:
        "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
      icon: trackingIcon,
    },
    {
      title: '100% Safe Delivery',
      description:
        'We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.',
      icon: safeDeliveryIcon,
    },
    {
      title: '24/7 Call Center Support',
      description:
        'Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.',
      icon: safeDeliveryIcon,
    },
  ];

  return (
    <div className="mt-5 flex flex-col gap-3">
      {features.map((feature, idx) => (
        <FacilityCard
          key={idx}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  );
};

export default Facilities;
