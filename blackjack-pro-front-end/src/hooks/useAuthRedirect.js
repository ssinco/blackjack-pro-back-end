import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthRedirect = (user) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);
};