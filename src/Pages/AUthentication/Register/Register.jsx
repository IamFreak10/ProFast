import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../Hooks/useAuth';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import useAxios from '../../../Hooks/useAxios';

const Register = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createUser, updateUser, logOut } = useAuth();
  const axiosInstance = useAxios();
  const onSubmit = (data) => {
    console.log(data);
    createUser(data.email, data.password)
      .then(async () => {
        // Update User In Database
        const userInfo = {
          email: data.email,
          role: 'user', //default user role
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };
        const userRes = await axiosInstance.post('/users', userInfo);
        console.log(userRes.data);
        // Update User Profile In Firebase
        const userprofile = {
          displayName: data.name,
          photoURL: image,
        };
        updateUser(userprofile).then(logOut());
      })
      .then(() => {
        navigate('/login');


      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const handleImageUpload = async (event) => {
    const image = event.target.files[0];

    const formData = new FormData();
    formData.append('image', image);

    const imgUploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_IMGBB_KEY
    }`;
    const res = await axios.post(imgUploadUrl, formData);
    setImage(res.data.data.url);
  };
  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-5xl font-bold"> Create An Account!</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            {/* Name */}
            <label className="label">Name</label>
            <input
              type="text"
              {...register('name', { required: true })}
              className="input"
              placeholder="Name"
            />
            {errors.name?.type === 'required' && (
              <span className="text-red-600">Name field is required</span>
            )}
            {/* Photo */}
            <label className="label">Photo</label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="file input"
              placeholder="Photo"
            />

            {/* Email */}
            <label className="label">Email</label>
            <input
              type="email"
              {...register('email', { required: true })}
              className="input"
              placeholder="Email"
            />
            {errors.email?.type === 'required' && (
              <span className="text-red-600">Email field is required</span>
            )}
            {/* Password  */}
            <label className="label">Password</label>
            <input
              type="password"
              {...register('password', {
                required: true,
                minLength: 6,
              })}
              className="input"
              placeholder="Password"
            />
            {errors.password?.type === 'required' && (
              <span className="text-red-600">Password field is required</span>
            )}
            {errors.password?.type === 'minLength' && (
              <span className="text-red-600">
                Password must be at least 6 characters
              </span>
            )}

            <button className="btn btn-primary mt-4 text-black">
              Register
            </button>
          </fieldset>
          <p>
            <small>
              Already Have An Account?
              <Link className=" btn-link" to="/login">
                Login
              </Link>
            </small>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
