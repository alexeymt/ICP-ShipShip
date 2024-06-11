import { ButtonHTMLAttributes, FC, ReactElement } from 'react';
import { Theme } from '@emotion/react';

import { Spinner } from '../Spinner';
import { Typography } from '../Typography';

import { ButtonStyled, LinkButton } from './Button.styled';

export type ButtonProps = {
  type?: ButtonHTMLAttributes<any>['type'];
  variant: 'primary' | 'secondary' | 'icon';
  onClick?: (event: any) => void;
  iconImg?: ReactElement;
  loading?: boolean;
  size?: 'lg' | 'md' | 'sm';
  href?: string;
  disabled?: boolean;
  text?: string;
  sx?: Theme;
};

export const Button: FC<ButtonProps> = ({
  type = 'button',
  iconImg,
  href,
  size,
  disabled = false,
  variant,
  loading,
  onClick,
  text,
  sx,
}) => {
  if (href) {
    return (
      <LinkButton href={href} target="_blank" rel="noreferrer" css={{ ...sx }}>
        {text && (
          <Typography variant="subtitle2" family="Poppins" color="black">
            {text}
          </Typography>
        )}
      </LinkButton>
    );
  }

  return (
    <ButtonStyled disabled={disabled} variant={variant} size={size} type={type} onClick={onClick} css={{ ...sx }}>
      {loading ? (
        <Spinner sx={{ width: 30, height: 30 }} />
      ) : (
        <>
          {text && (
            <Typography variant="button" family="Poppins" color="white">
              {text}
            </Typography>
          )}

          {iconImg && iconImg}
        </>
      )}
    </ButtonStyled>
  );
};
