import { useMemo } from 'react';
import { useAuth } from '@context/authContext';
import { getUserFromToken } from '@utils/getUserFromToken';

export const useUser = () => {
  const { token } = useAuth();
  const user = useMemo(() => getUserFromToken(token), [token]);
  return { token, user };
};