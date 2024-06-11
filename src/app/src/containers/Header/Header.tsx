import { useCallback, useState } from 'react';
import { Link, useMatch, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

import { Account, Button } from '../../components';
import { Icon } from '../../components/Icons';
import { useStore } from '../../hooks';
import { COLOR_WH, HeaderGutterTop } from '../../styles';
import { flexHelper, shortenPhrase } from '../../utils';
import { routes, Stories } from '..';

const HeaderContainer = styled.div({
  ...flexHelper({ flexDirection: 'row', justifyContent: 'space-between' }),
  width: '100%',
  paddingTop: `${HeaderGutterTop}`,
  position: 'relative',
});

export const Header = () => {
  const navigate = useNavigate();
  const isLanding = useMatch(routes.landing.root);
  const { isAuthenticated, login, logout, principal } = useStore();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleShowLogoutPopover = useCallback(() => {
    setIsPopoverOpen(true);
  }, [setIsPopoverOpen]);

  const handleLogin = useCallback(async () => {
    await login();
  }, [login]);

  const handleLogout = useCallback(async () => {
    await logout();
    setIsPopoverOpen(false);
    navigate(routes.landing.root);
  }, [logout, navigate]);

  return (
    <HeaderContainer>
      <Link to={routes.landing.root}>
        <Icon type="logo" width={78} height={85} color={COLOR_WH} />
      </Link>
      {isLanding ? <Stories /> : null}
      {isAuthenticated ? (
        <Account
          onLogout={handleLogout}
          visible={isPopoverOpen}
          onClose={() => setIsPopoverOpen(false)}
          onClick={handleShowLogoutPopover}
          displayText={shortenPhrase(principal.toText(), 5, 5)}
          copyText={principal.toText()}
        />
      ) : (
        <Button onClick={handleLogin} variant="primary" text="LOGIN" />
      )}
    </HeaderContainer>
  );
};
