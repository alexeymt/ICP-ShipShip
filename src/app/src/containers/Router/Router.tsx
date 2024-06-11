import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Ceremony, Certificate, Connect, Landing, Version } from '../../pages';

import { routes } from './routes';

export const LayoutRoutes: FC = () => {
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/" />} />
      <Route path={routes.landing.root} element={<Landing />} />
      <Route path={routes.connect.root} element={<Connect />} />
      <Route path={routes.ceremony.root} element={<Ceremony />} />
      <Route path={routes.certificate.root} element={<Certificate />} />
      <Route path={routes.version.root} element={<Version />} />
    </Routes>
  );
};
