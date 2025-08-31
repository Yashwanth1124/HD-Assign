import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOtp = async () => {
    setError(''); setLoading(true);
    try {
      await axios.post(`${API}/api/auth/send-otp`, { email, name, dob });
      setStep(2);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    setError(''); setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/auth/verify-otp`, { email, otp });
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (e: any) {
      setError(e.response?.data?.message || 'OTP verification failed');
    } finally { setLoading(false); }
  };

  const googleSignup = () => {
    window.location.href = `${API}/api/auth/google`;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-8 md:px-6 md:py-12 bg-white">
        <div className="w-full max-w-sm md:max-w-md">
          <div className="mb-6 flex items-center justify-center md:justify-start space-x-2">
            <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-500 rounded-full animate-spin" />
            <h1 className="text-lg md:text-xl font-bold text-gray-700">HD</h1>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center md:text-left">Sign up</h2>
          <p className="text-sm md:text-base text-gray-500 mb-6 text-center md:text-left">Sign up to enjoy the feature of HD</p>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          {step===1 && (
            <>
              <input type="text" placeholder="Your Name" className="w-full px-4 py-2 mb-4 border rounded-md text-sm md:text-base focus:outline-none focus:ring focus:border-blue-300" value={name} onChange={e=>setName(e.target.value)} />
              <input type="date" placeholder="Date of Birth" className="w-full px-4 py-2 mb-4 border rounded-md text-sm md:text-base focus:outline-none focus:ring focus:border-blue-300" value={dob} onChange={e=>setDob(e.target.value)} />
              <input type="email" placeholder="Email" className="w-full px-4 py-2 mb-4 border rounded-md text-sm md:text-base focus:outline-none focus:ring focus:border-blue-300" value={email} onChange={e=>setEmail(e.target.value)} />
              <button onClick={sendOtp} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-sm md:text-base">Get OTP</button>
              <button onClick={googleSignup} className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded mt-2 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3" className="w-5 h-5" aria-hidden="true" focusable="false">
                  <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.7-50.3H272v95.2h146.9c-6.4 34.6-25.9 63.9-55 83.6v69.4h88.9c52.1-48 80.7-118.6 80.7-197.9z"/>
                  <path fill="#34A853" d="M272 544.3c73.7 0 135.6-24.4 180.8-66.2l-88.9-69.4c-24.7 16.6-56.4 26-91.9 26-70.6 0-130.5-47.7-151.9-112.1H29.2v70.5C73.9 486.7 166.2 544.3 272 544.3z"/>
                  <path fill="#FBBC05" d="M120.1 322.6c-10.2-30.6-10.2-63.6 0-94.2v-70.5H29.2c-39.1 77.9-39.1 167.4 0 245.3l90.9-70.6z"/>
                  <path fill="#EA4335" d="M272 107.7c38.6-.6 75.9 13.7 104.2 40.3l77.9-77.9C407.1 23.7 341.5 0 272 0 166.2 0 73.9 57.6 29.2 170.4l90.9 70.5C141.5 155.4 201.4 107.7 272 107.7z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
              <p className="mt-4 text-xs md:text-sm text-center text-gray-600">Already have an account? <Link to="/signin" className="text-blue-600 hover:underline">Sign in</Link></p>
            </>
          )}

          {step===2 && (
            <>
              <input type="text" placeholder="Enter the OTP" className="w-full px-4 py-2 mb-4 border rounded-md text-sm md:text-base focus:outline-none focus:ring focus:border-blue-300" value={otp} onChange={e=>setOtp(e.target.value)} />
              <button onClick={verifyOtp} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded text-sm md:text-base">Verify OTP</button>
            </>
          )}
        </div>
      </div>

      <div className="hidden md:block md:w-1/2">
        <img src="/img.png" alt="Background" className="object-cover w-full h-full" />
      </div>
    </div>
  );
}