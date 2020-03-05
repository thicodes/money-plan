import { useCallback } from 'react';
import { useHistory } from '../../routing/useHistory';

export const TOKEN_KEY = 'money-plan-token';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const updateToken = (token = '') => {
  if (!token || token === '' || token === null) {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const useLogout = () => {
  const history = useHistory();

  const logout = useCallback(() => {
    updateToken('');

    history.push('/auth/login');
  }, [history]);

  return [logout];
};
