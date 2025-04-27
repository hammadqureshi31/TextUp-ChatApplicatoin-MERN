import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { backendPortURL } from "../config";
import { Spinner } from 'flowbite-react';
import toast, { Toaster } from 'react-hot-toast';

const SignupSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is Required"),
  password: Yup.string().required("Strong password is Required").min(6).max(10),
  name: Yup.string().required("Username is Required"),
});

const Signup = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    const { name, email, password } = values;

    try {
      const formData = {
        username: name,
        email,
        password,
      };

      await axios.post(`${backendPortURL}/user/signup`, formData);
      toast.success('Signup successful! Redirecting to login...');
      setTimeout(() => navigate(`/user/login`), 1500);
    } catch (error) {
      console.error("Signup error:", error);
      toast.error('Signup failed. Please try again.');
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
          Create your account
        </p>

        <Formik
          initialValues={{ email: "", password: "", name: "" }}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <div>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-lg focus:ring-2 focus:ring-[#7C4EE4] focus:bg-white outline-none"
                />
                <ErrorMessage name="name" component="div" className="text-sm text-red-500 mt-1" />
              </div>

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

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 mt-2 text-lg font-semibold text-white rounded-lg transition 
                  ${isSubmitting ? 'bg-[#9f7aea]' : 'bg-[#7C4EE4] hover:bg-[#6B46C1]'} 
                  focus:outline-none active:scale-95`}
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" color="white" /> Signing up...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>
            </Form>
          )}
        </Formik>

        <Toaster position="top-center" reverseOrder={false} />

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            className="text-[#7C4EE4] font-medium hover:underline cursor-pointer"
            onClick={() => navigate(`/user/login`)}
          >
            Log In
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
