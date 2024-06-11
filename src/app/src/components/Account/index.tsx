import { useRef } from 'react';

import { useOutsideClick } from '../../hooks';
import { Copyable } from '../Copyable';
import { CopyableProps } from '../Copyable/Copyable.types';
import { LogoutPopover } from '../LogoutPopover';

export type AccountProps = {
  visible: boolean;
  onLogout: () => void;
  onClose: () => void;
} & CopyableProps;

export const Account = ({ copyText, displayText, onClick, visible, onClose, onLogout }: AccountProps) => {
  const popoverRef = useRef(null);

  useOutsideClick({ ref: popoverRef, fn: onClose });

  return (
    <div role="presentation" ref={popoverRef} css={{ position: 'relative', width: '100%', maxWidth: 250 }}>
      <Copyable onClick={onClick} copyText={copyText} displayText={displayText} />
      {visible && <LogoutPopover onLogout={onLogout} visible={visible} />}
    </div>
  );
};
