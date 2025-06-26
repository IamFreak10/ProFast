import React from 'react';
import png from '../../../assets/customer-top.png';
const WocsSection = () => {
  return (
    <>
      <div className='bg-blue-100 flex flex-col justify-center items-center gap-4 rounded-2xl'>
        <img src={png} alt="" />
      <div className="text-center flex flex-col justify-center gap-4">
        <h1 className="text-3xl text-primary font-bold">
          What our customers are sayings
        </h1>
        <p className="text-gray-600 text-xl">
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce pain, and strengthen your body
          with ease!
        </p>
      </div>
      </div>
    </>
  );
};

export default WocsSection;
