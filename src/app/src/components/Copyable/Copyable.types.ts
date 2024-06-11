import { RefObject } from 'react';
import { Theme } from '@emotion/react';

export interface CopyableProps {
  copyText: string;
  displayText: string;
  withIcon?: boolean;
  sx?: Theme;
  popoverRef?: RefObject<any>;
  onClick?: () => void;
  disabled?: boolean;
}
