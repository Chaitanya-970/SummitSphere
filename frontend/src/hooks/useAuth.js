import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, name) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password, name })
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.errors); // This uses our professional error handler from earlier!
    }
    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(json));
      dispatch({type: 'LOGIN', payload: json});
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};