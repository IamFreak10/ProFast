import React from 'react';
import useAxiosSecure from './useAxiosSecure';

const useTrackingLogger = () => {
  const axiosSecure = useAxiosSecure();
  const logTracking = async ({
    tracking_id,
    status,
    details,

    updated_by,
  }) => {
    try {
      const payload = {
        tracking_id,
        status,
        details,
        updated_by,
        timestamp: new Date().toISOString(),
      };
      await axiosSecure.post('/parcels/track', payload);
    } catch (error) {
      console.error('Failed to log tracking:', error);
    }
  };

  return { logTracking };
};

export default useTrackingLogger;
