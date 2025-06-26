import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, Outlet } from 'react-router';
import SocialLogin from '../socialLogin/socialLogin';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onsubmit = (data) => {
    console.log(data);
  };
  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <form onSubmit={handleSubmit(onsubmit)}>
          <fieldset className="fieldset">
            <label className="label">Email</label>
            <input
              type="email"
              {...register('email')}
              className="input"
              placeholder="Email"
            />

            <label className="label">Password</label>
            <input
              type="password"
              {...register('password', {
                required: true,
                minLength: 6,
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
              })}
              className="input"
              placeholder="Password"
            />
            {errors.password?.type === 'required' && (
              <span className="text-red-600">This field is required</span>
            )}
            {errors.password?.type === 'minLength' && (
              <span className="text-red-600">
                Password must be at least 6 characters
              </span>
            )}
            {errors.password?.type === 'pattern' && (
              <span className="text-red-600">
                Password must contain at least one letter and one number
              </span>
            )}

            <div>
              <a className="link link-hover">Forgot password?</a>
            </div>

            <button className="btn btn-primary mt-4 text-black">Login</button>
          </fieldset>
        </form>
      
      
        <p>
          <small>
           New To This WebSite??
            <Link className=" btn-link" to="/register">
             Register
            </Link>
          </small>
        </p>
         <SocialLogin></SocialLogin>
      </div>
    </div>
    
  );
};

export default Login;
