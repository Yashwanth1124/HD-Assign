import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOtp = async () => {
    setError(''); setLoading(true);
    try {
      await axios.post(`${API}/api/auth/send-otp`, { email });
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

  const googleLogin = () => {
    window.location.href = `${API}/api/auth/google`;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6">
          <div>
            <div className="mb-6 flex items-center justify-center md:justify-start space-x-2">
            <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-500 rounded-full animate-spin" />
            <h1 className="text-lg md:text-xl font-bold text-gray-700">HD</h1>
          </div>
            <h2 className="text-2xl font-bold">Sign in</h2>
            <p className="text-gray-500 text-sm">Please login to continue to your account.</p>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input type="email" className="w-full border px-4 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" value={email} onChange={e=>setEmail(e.target.value)} disabled={step===2} />
            </div>

            {step===2 && (
              <div>
                <label className="text-sm font-medium text-gray-700">OTP</label>
                <input type="text" className="w-full border px-4 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" value={otp} onChange={e=>setOtp(e.target.value)} />
              </div>
            )}

            <button onClick={step===1 ? sendOtp : verifyOtp} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded" disabled={loading}>
              {loading ? 'Please wait...' : step===1 ? 'Send OTP' : 'Sign in'}
            </button>

            <button onClick={googleLogin} className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3" className="w-5 h-5" aria-hidden="true" focusable="false">
                <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.7-50.3H272v95.2h146.9c-6.4 34.6-25.9 63.9-55 83.6v69.4h88.9c52.1-48 80.7-118.6 80.7-197.9z"/>
                <path fill="#34A853" d="M272 544.3c73.7 0 135.6-24.4 180.8-66.2l-88.9-69.4c-24.7 16.6-56.4 26-91.9 26-70.6 0-130.5-47.7-151.9-112.1H29.2v70.5C73.9 486.7 166.2 544.3 272 544.3z"/>
                <path fill="#FBBC05" d="M120.1 322.6c-10.2-30.6-10.2-63.6 0-94.2v-70.5H29.2c-39.1 77.9-39.1 167.4 0 245.3l90.9-70.6z"/>
                <path fill="#EA4335" d="M272 107.7c38.6-.6 75.9 13.7 104.2 40.3l77.9-77.9C407.1 23.7 341.5 0 272 0 166.2 0 73.9 57.6 29.2 170.4l90.9 70.5C141.5 155.4 201.4 107.7 272 107.7z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <p className="text-sm text-gray-600 text-center">
              Need an account? <Link to="/signup" className="text-blue-600 hover:underline">Create one</Link>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden md:flex md:w-1/2 items-center justify-center p-6">
        <img src="/img.png" alt="cover" className="max-w-full max-h-full object-contain rounded-l-lg" />
      </div>
    </div>
  );
}