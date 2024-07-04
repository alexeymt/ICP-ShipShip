import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import {
  Ceremony,
  Certificate,
  PublicCertificate,
  ChooseRing,
  Connect,
  Invitation,
  Landing,
  Payment,
  Reject,
  Version,
  Waiting,
} from '../../pages';
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
      <Route path={routes.choose.root} element={<ChooseRing />} />
      <Route path={routes.invitation.root} element={<Invitation />} />
      <Route path={routes.reject.root} element={<Reject />} />
      <Route path={routes.waiting.root} element={<Waiting />} />
      <Route path={routes.payment.root} element={<Payment />} />
      <Route path={routes.publicCertificate.root} element={<PublicCertificate />} />
    </Routes>
  );
};
