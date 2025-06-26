import React from 'react';
import location from '../../../assets/location-merchant.png';
const BeMarchent = () => {
  return (
    <div
      data-aos="zoom-in-up"
      className="bg-[url('assets/be-a-merchant-bg.png')] bg-no-repeat bg-[#03373D] rounded-4xl p-5 md:p-20"
    >
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img src={location} className="w-full md:max-w-sm  rounded-lg " />
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-300">
            Merchant and Customer Satisfaction is Our First Priority
          </h1>
          <p className="py-6 text-gray-300 dark:text-gray-950">
            We offer the lowest delivery charge with the highest value along
            with 100% safety of your product. Pathao courier delivers your
            parcels in every corner of Bangladesh right on time.
          </p>
          <div className='flex flex-col md:flex-row gap-y-2'>
            <button className="btn btn-primary rounded-4xl text-black">
              Become A Merchant
            </button>
            <button className="btn btn-primary rounded-4xl btn-outline text-black md:ms-4">
              Become A Merchant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeMarchent;
