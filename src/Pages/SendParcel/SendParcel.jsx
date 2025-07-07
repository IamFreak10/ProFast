import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import useAuth from '../../Hooks/useAuth';
import axios from 'axios';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useNavigate } from 'react-router';

const SendParcel = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  function generateTrackingId() {
    const date = new Date();
    const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `TRK-${yyyymmdd}-${randomPart}`;
  }

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
    },
  });

  const parcelType = useWatch({ control, name: 'type' });
  const [locations, setLocations] = useState([]);
  const [senderDistricts, setSenderDistricts] = useState([]);
  const [senderCenters, setSenderCenters] = useState([]);
  const [receiverDistricts, setReceiverDistricts] = useState([]);
  const [receiverCenters, setReceiverCenters] = useState([]);
  const navigate = useNavigate();

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
    const weight = parseFloat(data.weight) || 0;

    let baseCost = 0;
    let weightCharge = 0;
    let outsideCharge = 0;
    let description = '';

    if (isDocument) {
      baseCost = sameDistrict ? 60 : 80;
      description = `Document Parcel: ${
        sameDistrict ? 'Within District (৳60)' : 'Outside District (৳80)'
      }`;
    } else {
      if (weight <= 3) {
        baseCost = sameDistrict ? 110 : 150;
        description = `Non-Document Parcel ≤ 3kg: ${
          sameDistrict ? 'Within District (৳110)' : 'Outside District (৳150)'
        }`;
      } else {
        baseCost = sameDistrict ? 110 : 150;
        const extraKg = weight - 3;
        weightCharge = extraKg * 40;
        outsideCharge = sameDistrict ? 0 : 40;
        description = `Non-Document Parcel > 3kg:
- Base: ${sameDistrict ? 'Within District (৳110)' : 'Outside District (৳150)'}
- Extra Weight: ${extraKg}kg × ৳40 = ৳${weightCharge}
${!sameDistrict ? '- Outside District Charge: ৳40' : ''}
`;
      }
    }

    const total = baseCost + weightCharge + outsideCharge;

    return {
      total,
      breakdown: { baseCost, weightCharge, outsideCharge, description },
    };
  };
  const onSubmit = async (data) => {
    const { total, breakdown } = calculateCost(data);

    const isSameDistrict = data.senderDistrict === data.receiverDistrict;
    const deliveryZone = isSameDistrict
      ? 'Within District'
      : 'Outside District';
    const weightDisplay =
      data.type === 'document' ? 'N/A' : `${parseFloat(data.weight || 0)} kg`;

    const pricingRules = `
    <ul style="padding-left: 18px; line-height: 1.6;">
      <li><strong>📄 Document:</strong> ৳60 (within), ৳80 (outside)</li>
      <li><strong>📦 Non-Document ≤ 3kg:</strong> ৳110 (within), ৳150 (outside)</li>
      <li><strong>📦 Non-Document > 3kg:</strong> Base + ৳40/kg (extra) + ৳40 (if outside)</li>
    </ul>
  `;

    const details = `
    <div style="text-align: left; font-size: 14px;">
      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">📦 Delivery Summary</h3>
      <ul style="padding-left: 18px; margin-bottom: 12px; line-height: 1.6;">
        <li><strong>Parcel Type:</strong> ${
          data.type === 'document' ? 'Document' : 'Non-Document'
        }</li>
        <li><strong>Weight:</strong> ${weightDisplay}</li>
        <li><strong>Delivery Zone:</strong> ${deliveryZone}</li>
        <li><strong>Base Charge:</strong> ৳${breakdown.baseCost}</li>
        ${
          breakdown.weightCharge > 0
            ? `<li><strong>Extra Weight Charge:</strong> ৳${breakdown.weightCharge}</li>`
            : ''
        }
        ${
          breakdown.outsideCharge > 0
            ? `<li><strong>Outside District Charge:</strong> ৳${breakdown.outsideCharge}</li>`
            : ''
        }
      </ul>
      <div style="
        background: #f3f4f6;
        border-left: 4px solid #2563eb;
        padding: 10px;
        font-weight: bold;
        font-size: 15px;
        border-radius: 4px;
        margin-bottom: 16px;
      ">
        🚚 Total Delivery Cost: ৳${total}
      </div>

      <h4 style="font-weight: bold; font-size: 15px; margin-bottom: 6px;">📘 Pricing Rules</h4>
      ${pricingRules}
    </div>
  `;

    const result = await Swal.fire({
      title: '<span style="font-size: 18px;">Delivery Cost Summary</span>',
      html: details,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: '#6b7280',
      confirmButtonText: '💳 Proceed to Payment ',
      cancelButtonText: 'Continue Editing 📝',
      customClass: {
        popup: 'rounded-xl p-6',
        title: 'text-gray-800',
      },
      backdrop: `
      rgba(0,0,123,0.3)
      left top
      no-repeat
    `,
    });

    if (result.isConfirmed) {
      const payload = {
        ...data,
        cost: total,
        created_by: user.email,
        payment_status: 'unpaid',
        delivery_status: 'not_collected',

        creation_date: new Date().toISOString(),
        tracking_id: generateTrackingId(),
      };

      try {
        axiosSecure.post('/parcels', payload).then((res) => {
          if (res.data.insertedId) {
            navigate('/dashboard/myParcels');
            Swal.fire({
              title: 'Redirecting...',
              text: 'Redirecting to payment page...',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });
          }
        });
      } catch {
        Swal.fire('❌ Error', 'Failed to save parcel info.', 'error');
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
                  {...register('senderName', { required: true })}
                  type="text"
                  className="input input-bordered w-full"
                />
              </div>

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
