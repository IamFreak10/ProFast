import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const SendParcel = ({ userName = 'Mahfuj Freak' }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: 'document',
      senderName: userName,
    },
  });

  const parcelType = useWatch({ control, name: 'type' });
  const [locations, setLocations] = useState([]);
  const [senderDistricts, setSenderDistricts] = useState([]);
  const [senderCenters, setSenderCenters] = useState([]);
  const [receiverDistricts, setReceiverDistricts] = useState([]);
  const [receiverCenters, setReceiverCenters] = useState([]);

  useEffect(() => {
    fetch('/branchLocations.json')
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) =>
        console.error('Failed to load branchLocations.json', err)
      );
  }, []);

  const senderRegion = watch('senderRegion');
  const senderDistrict = watch('senderDistrict');

  useEffect(() => {
    if (!senderRegion) {
      setSenderDistricts([]);
      setValue('senderDistrict', '');
      setSenderCenters([]);
      setValue('senderServiceCenter', '');
      return;
    }
    const districts = Array.from(
      new Set(
        locations
          .filter((loc) => loc.region === senderRegion)
          .map((loc) => loc.district)
      )
    );
    setSenderDistricts(districts);
    setValue('senderDistrict', '');
    setSenderCenters([]);
    setValue('senderServiceCenter', '');
  }, [senderRegion, locations, setValue]);

  useEffect(() => {
    if (!senderDistrict) {
      setSenderCenters([]);
      setValue('senderServiceCenter', '');
      return;
    }
    const areas =
      locations.find(
        (loc) => loc.region === senderRegion && loc.district === senderDistrict
      )?.covered_area || [];
    setSenderCenters(areas);
    setValue('senderServiceCenter', '');
  }, [senderDistrict, senderRegion, locations, setValue]);

  const receiverRegion = watch('receiverRegion');
  const receiverDistrict = watch('receiverDistrict');

  useEffect(() => {
    if (!receiverRegion) {
      setReceiverDistricts([]);
      setValue('receiverDistrict', '');
      setReceiverCenters([]);
      setValue('receiverServiceCenter', '');
      return;
    }
    const districts = Array.from(
      new Set(
        locations
          .filter((loc) => loc.region === receiverRegion)
          .map((loc) => loc.district)
      )
    );
    setReceiverDistricts(districts);
    setValue('receiverDistrict', '');
    setReceiverCenters([]);
    setValue('receiverServiceCenter', '');
  }, [receiverRegion, locations, setValue]);

  useEffect(() => {
    if (!receiverDistrict) {
      setReceiverCenters([]);
      setValue('receiverServiceCenter', '');
      return;
    }
    const areas =
      locations.find(
        (loc) =>
          loc.region === receiverRegion && loc.district === receiverDistrict
      )?.covered_area || [];
    setReceiverCenters(areas);
    setValue('receiverServiceCenter', '');
  }, [receiverDistrict, receiverRegion, locations, setValue]);

  const calculateCost = (data) => {
    const sameDistrict = data.senderDistrict === data.receiverDistrict;
    const isDocument = data.type === 'document';

    if (isDocument) {
      return sameDistrict ? 60 : 80;
    }

    const weight = parseFloat(data.weight) || 0;

    if (weight <= 3) {
      return sameDistrict ? 110 : 150;
    }

    // Weight > 3kg
    const extraWeight = weight - 3;
    const extraCost = extraWeight * 40;

    return sameDistrict ? 110 + extraCost : 150 + extraCost + 40; // 40 extra for outside district
  };

  const onSubmit = async (data) => {
    const cost = calculateCost(data);

    const result = await Swal.fire({
      title: `Delivery Cost: ৳${cost}`,
      text: 'Do you want to confirm and save?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
    });

    if (result.isConfirmed) {
      const payload = {
        ...data,
        cost,
        creation_date: new Date().toISOString(),
      };

      try {
        console.log(payload);
        // await fetch call here
      } catch (err) {
        Swal.fire('Error', 'Failed to save parcel info.', 'error');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-xl rounded-xl mt-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          📦 Parcel Delivery Form
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Enter parcel, sender & receiver info to calculate cost and submit.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <fieldset className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
          <legend className="text-lg font-semibold text-gray-700 dark:text-gray-200 px-2">
            Parcel Info
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Parcel Type
              </label>
              <select
                {...register('type', { required: true })}
                className="select select-bordered w-full"
              >
                <option value="document">Document</option>
                <option value="non-document">Non-document</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Parcel Title
              </label>
              <input
                {...register('title', { required: true })}
                type="text"
                className="input input-bordered w-full"
              />
            </div>
            {parcelType === 'non-document' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Parcel Weight (kg)
                </label>
                <input
                  {...register('weight')}
                  type="number"
                  className="input input-bordered w-full"
                />
              </div>
            )}
          </div>
        </fieldset>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sender */}
          <fieldset className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
            <legend className="text-lg font-semibold text-gray-700 dark:text-gray-200 px-2">
              Sender Info
            </legend>
            <div className="grid grid-cols-1 gap-4 mt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Name
                </label>
                <input
                  {...register('receiverName', { required: true })}
                  type="text"
                  className="input input-bordered w-full"
                />
              </div>
              <input type="hidden" {...register('senderName')} />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Contact
                </label>
                <input
                  {...register('senderContact', { required: true })}
                  type="text"
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Region
                </label>
                <select
                  {...register('senderRegion', { required: true })}
                  className="select select-bordered w-full"
                >
                  <option value="">-- Choose Region --</option>
                  {Array.from(new Set(locations.map((loc) => loc.region))).map(
                    (region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  District
                </label>
                <select
                  {...register('senderDistrict', { required: true })}
                  className="select select-bordered w-full"
                >
                  <option value="">-- Choose District --</option>
                  {senderDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Service Center
                </label>
                <select
                  {...register('senderServiceCenter', { required: true })}
                  className="select select-bordered w-full"
                >
                  <option value="">-- Choose Service Center --</option>
                  {senderCenters.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Address
                </label>
                <input
                  {...register('senderAddress', { required: true })}
                  type="text"
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Pickup Instruction
                </label>
                <textarea
                  {...register('pickupInstruction', { required: true })}
                  className="textarea textarea-bordered w-full"
                  rows={2}
                ></textarea>
              </div>
            </div>
          </fieldset>

          {/* Receiver */}
          <fieldset className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
            <legend className="text-lg font-semibold text-gray-700 dark:text-gray-200 px-2">
              Receiver Info
            </legend>
            <div className="grid grid-cols-1 gap-4 mt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Name
                </label>
                <input
                  {...register('receiverName', { required: true })}
                  type="text"
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Contact
                </label>
                <input
                  {...register('receiverContact', { required: true })}
                  type="text"
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Region
                </label>
                <select
                  {...register('receiverRegion', { required: true })}
                  className="select select-bordered w-full"
                >
                  <option value="">-- Choose Region --</option>
                  {Array.from(new Set(locations.map((loc) => loc.region))).map(
                    (region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  District
                </label>
                <select
                  {...register('receiverDistrict', { required: true })}
                  className="select select-bordered w-full"
                >
                  <option value="">-- Choose District --</option>
                  {receiverDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Service Center
                </label>
                <select
                  {...register('receiverServiceCenter', { required: true })}
                  className="select select-bordered w-full"
                >
                  <option value="">-- Choose Service Center --</option>
                  {receiverCenters.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Address
                </label>
                <input
                  {...register('receiverAddress', { required: true })}
                  type="text"
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Delivery Instruction
                </label>
                <textarea
                  {...register('deliveryInstruction', { required: true })}
                  className="textarea textarea-bordered w-full"
                  rows={2}
                ></textarea>
              </div>
            </div>
          </fieldset>
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary px-8">
            Submit Parcel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendParcel;
