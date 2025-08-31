import { useEffect } from 'react';

export default function OAuthCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.location.replace('/dashboard');
    } else {
      window.location.replace('/signin');
    }
  }, []);
  return <div className="p-6 text-center">Signing you in...</div>
}