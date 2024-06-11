import { PropsWithChildren } from 'react';
import { Theme } from '@emotion/react';

import { styles } from './Typography.styled';
import { FontFamilyTypes, FontWeights, TypographyColors, TypographyVariants } from './Typography.types';

interface TypographyProps {
  variant?: TypographyVariants;
  color?: TypographyColors;
  weight?: FontWeights;
  family?: FontFamilyTypes;
  style?: Theme;
  align?: 'auto' | 'left' | 'right' | 'center';
}

export const Typography = ({
  variant = 'label',
  color = 'black',
  family = 'Inter',
  weight,
  children,
  style,
  align,
  ...textProps
}: PropsWithChildren<TypographyProps>) => {
  return (
    <p
      {...textProps}
      css={{
        ...styles.font[family],
        ...styles[color],
        ...styles[variant],
        ...(align && { textAlign: align }),
      }}
    >
      {children}
    </p>
  );
};
