import { CSSProperties, FC } from 'react';
import { Theme } from '@emotion/react';

import icons from './icons';

export type IconType = keyof typeof icons;

interface IIconProps {
  type: IconType;
  width?: number;
  height?: number;
  color?: CSSProperties['color'];
  sx?: Theme;
}

export const Icon: FC<IIconProps> = ({ type, width = 24, height = 24, color, sx }) => {
  const IconComponent = icons[type];

  return <IconComponent width={width} height={height} style={{ color, minWidth: width, ...sx }} />;
};
