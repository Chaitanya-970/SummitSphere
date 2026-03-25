import { createContext, useReducer, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload };
    case 'LOGOUT':
      return { user: null };
    case 'UPDATE_USER':
      return { user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) dispatch({ type: 'LOGIN', payload: user });
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setAuthReady(true);
    }
  }, []);

  useEffect(() => {
    if (authReady && state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else if (authReady && !state.user) {
      localStorage.removeItem('user');
    }
  }, [state.user, authReady]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch, authReady }}>
      {children}
    </AuthContext.Provider>
  );
};
