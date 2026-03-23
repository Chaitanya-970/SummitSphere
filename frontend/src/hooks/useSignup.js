import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Changed null to false for safety
  const { dispatch } = useAuthContext();

  const signup = async (name, email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      // Changed endpoint from /api/auth to /api/user to match your userRoutes.js
      const response = await fetch('http://localhost:5000/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        const firstFieldError = json?.errors
          ? Object.values(json.errors).find(Boolean)
          : null;
        setError(firstFieldError || json.error || 'Signup failed');
        return;
      }

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(json));
        dispatch({ type: 'LOGIN', payload: json });
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setIsLoading(false);
      setError('Could not connect to the server. Is the backend running?');
    }
  };

  return { signup, isLoading, error };
};