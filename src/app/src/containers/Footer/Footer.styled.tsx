import styled from '@emotion/styled';

import { flexHelper } from '../../utils';
import { Container } from '../Layout';

export const FooterContainer = styled(Container)({
  ...flexHelper({ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }),
  padding: '30px 94px 21px 124px',
  width: '100%',
});

export const Socials = styled.div({
  ...flexHelper({ flexDirection: 'column', alignItems: 'center' }),
});

export const SocialLinks = styled.div({
  ...flexHelper({ alignItems: 'center' }),
  gap: 16,
  marginBottom: 20,
});

export const Services = styled.div({
  ...flexHelper({}),
  gap: 14,
  '& > :last-child': {
    marginLeft: 20,
  },
});
