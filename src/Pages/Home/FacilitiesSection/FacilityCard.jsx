import React from 'react';

const FacilityCard = ({ icon, title, description }) => {
  return (
    <div className="flex  gap-4 items-center  bg-white shadow-md p-9 rounded-xl  hover:shadow-xl transition-shadow duration-300">
      <img src={icon} alt={title} className="w-42 h-42 object-contain" />
      <div className="p-4 mb:p-10  border-l-2 border-dashed border-black">
        <h3 className="text-xl font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default FacilityCard;
