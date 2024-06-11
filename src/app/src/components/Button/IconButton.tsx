import { FC, ReactElement } from 'react';
import { Theme } from '@emotion/react';
import styled from '@emotion/styled';

import { Button, ButtonProps } from './Button';

export interface IconButtonProps extends Pick<ButtonProps, 'onClick' | 'disabled'> {
  iconImg: ReactElement;
  variant?: ButtonProps['variant'];
  sx?: Theme;
}

export const IconButtonStyled = styled(Button)({
  width: 56,
  height: 56,
  padding: 8,
});

export const IconButton: FC<IconButtonProps> = ({ variant = 'primary', iconImg, onClick, disabled = false, sx }) => {
  return (
    <IconButtonStyled
      variant={variant}
      iconImg={iconImg}
      onClick={onClick}
      disabled={disabled}
      sx={{ padding: 9, width: 56, height: 56, ...sx }}
    />
  );
};
