import { FC, PropsWithChildren } from 'react';
import Dialog from 'rc-dialog';

import s from './Modal.scss';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
}
export const Modal: FC<PropsWithChildren<ModalProps>> = ({ visible, onClose, children }) => {
  return (
    <Dialog
      prefixCls="modal"
      zIndex={1000}
      destroyOnClose
      closable={false}
      visible={visible}
      maskClosable
      onClose={onClose}
      classNames={{ wrapper: s }}
      style={{
        position: 'relative',
        borderRadius: '20px',
        padding: 23,
      }}
    >
      {children}
    </Dialog>
  );
};
