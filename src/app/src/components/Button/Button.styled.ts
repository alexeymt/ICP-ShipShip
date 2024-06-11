import styled from '@emotion/styled';

import {
  COLOR_GRAY,
  COLOR_PURPLE,
  COLOR_PURPLE_DARK,
  COLOR_TRANSPARENT,
  COLOR_WH,
  RADIUS_L,
  RADIUS_XXL,
} from '../../styles';

import { ButtonProps } from './Button';

export const ButtonStyled = styled('button')<{
  variant: ButtonProps['variant'];
  size?: ButtonProps['size'];
  disabled?: boolean;
}>(
  {
    alignItems: 'center',
    borderRadius: RADIUS_XXL,
    p: {
      textTransform: 'uppercase',
      color: COLOR_WH,
      width: '100%',
    },
    justifyContent: 'center',
  },
  ({ variant, size = 'md', disabled }) => {
    const styleObject = {
      background: variant === 'primary' ? COLOR_TRANSPARENT : COLOR_PURPLE,
      backdropFilter: variant === 'primary' ? 'blur(10px)' : 'none',

      '&:hover': {
        background: !disabled ? COLOR_PURPLE_DARK : COLOR_GRAY,
      },
    };

    if (size === 'sm') {
      return {
        ...styleObject,
        height: 32,
        padding: 8,
        p: {
          fontSize: '14px',
          lineHeight: '16px',
        },
      };
    }

    if (size === 'lg') {
      return {
        ...styleObject,
        height: 80,
        padding: '30px 83px',
      };
    }

    return {
      ...styleObject,
      ...(disabled && { background: COLOR_GRAY }),
      height: 56,
      padding: '16px 50px',
    };
  },
);

export const LinkButton = styled.a({
  background: 'transparent',
  border: '1px solid #000',
  padding: '2px 10px',
  borderRadius: RADIUS_L,
});
