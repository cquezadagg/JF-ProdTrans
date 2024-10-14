import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';

interface ProtectedRouteProps {
  requiredRole: string;
  element: React.ReactElement;
}

export function ProtectedRoute({ requiredRole, element }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { user } = useAppContext();

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) {
        navigate('/');
      } else {
        try {
          const idToken = await user.getIdTokenResult();
          const claims = idToken.claims;
          if (!claims[requiredRole]) {
            navigate('/');
          }
        } catch (error) {
          console.error('Error al verificar los roles:', error);
          navigate('/');
        }
      }
    };

    checkUserRole();
  }, [navigate, requiredRole, user]);

  return user ? element : null;
}
