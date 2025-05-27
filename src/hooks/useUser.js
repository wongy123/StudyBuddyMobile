import { useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '@context/authContext';

export const useUser = () => {
  const { token } = useAuth();

  const user = useMemo(() => {
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return {
        id: decoded.id,
        role: decoded.role,
        displayName: decoded.displayName,
      };
    } catch {
      return { id: null, role: null, displayName: null };
    }
  }, [token]);

  return { token, user, displayName: user?.displayName };
};
