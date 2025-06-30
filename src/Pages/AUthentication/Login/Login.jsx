import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../socialLogin/socialLogin';
import useAuth from '../../../Hooks/useAuth';
import Swal from 'sweetalert2';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const from=location.state?.from|| '/'; 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {signIn} = useAuth();
  const onsubmit = (data) => {
    signIn(data.email, data.password)
      .then((res) => {
        console.log(res);
        navigate(from);

      })
      .catch((error) => {
    
      console.log(error);
      });
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
