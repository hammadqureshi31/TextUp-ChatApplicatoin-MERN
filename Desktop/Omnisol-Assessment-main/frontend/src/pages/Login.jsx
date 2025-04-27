import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { backendPortURL } from "../config";
import toast, { Toaster } from 'react-hot-toast';
import { Spinner } from 'flowbite-react';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required").min(6).max(10)
});

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    const { email, password } = values;

    try {
      const resp = await axios.post(`${backendPortURL}/user/login`, { email, password }, { withCredentials: true });
      toast.success("Login Successful! Redirecting...");
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center mb-4 text-[#7C4EE4] font-raleway">
          Notes Management App
        </h1>
        <p className="text-lg text-center mb-6 text-gray-500 font-roboto">
          Welcome back! Please login
        </p>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <div>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-lg focus:ring-2 focus:ring-[#7C4EE4] focus:bg-white outline-none"
                />
                <ErrorMessage name="email" component="div" className="text-sm text-red-500 mt-1" />
              </div>

              <div>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-lg focus:ring-2 focus:ring-[#7C4EE4] focus:bg-white outline-none"
                />
                <ErrorMessage name="password" component="div" className="text-sm text-red-500 mt-1" />
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded focus:ring-[#7C4EE4]" />
                  Remember Me
                </label>
                {/* <span
                  className="text-[#7C4EE4] hover:underline cursor-pointer"
                  onClick={() => navigate('/Resp/forgot-password')}
                >
                  Forgot Password?
                </span> */}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 mt-2 text-lg font-semibold text-white rounded-lg transition 
                  ${isSubmitting ? 'bg-[#9f7aea]' : 'bg-[#7C4EE4] hover:bg-[#6B46C1]'} 
                  focus:outline-none active:scale-95`}
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" color="white" /> Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </Form>
          )}
        </Formik>

        <Toaster position="top-center" reverseOrder={false} />

        <div className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            className="text-[#7C4EE4] font-medium hover:underline cursor-pointer"
            onClick={() => navigate("/user/signup")}
          >
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
