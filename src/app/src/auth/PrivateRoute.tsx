import { useNavigate } from 'react-router-dom';
import { useStore } from '../hooks';
import { routes } from '../containers/Router/routes';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useStore();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <>{children}</>;
  }

  navigate(routes.landing.root);
};
