import { COLOR_WH } from '../../styles';
import { flexHelper } from '../../utils';
import { Icon } from '../Icons';
import { Typography } from '../Typography';

export type LogoutPopoverProps = {
  visible: boolean;
  onLogout: () => void;
};

export const LogoutPopover = ({ visible, onLogout }: LogoutPopoverProps) => {
  return (
    <div
      css={{
        display: visible ? 'flex' : 'none',
        position: 'absolute',
        top: '66px',
        right: 0,
        background: COLOR_WH,
        padding: 24,
        borderRadius: 24,
        width: '100%',
        maxWidth: 157,
      }}
    >
      <button
        type="button"
        onClick={onLogout}
        css={{ gap: 12, ...flexHelper({ alignItems: 'center', justifyContent: 'space-between' }) }}
      >
        <Typography variant="button">Logout</Typography>
        <Icon type="logout" />
      </button>
    </div>
  );
};
