import { MouseEventHandler, useCallback, useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { COLOR_COPYABLE, RADIUS_XL } from '../../styles';
import { flexHelper } from '../../utils';
import { Icon } from '../Icons';
import { Typography } from '../Typography';

import { COPY_TEXT_SHOW_TIME, copyText as copyTextHelpers } from './Copyable.helper';
import { CopyableProps } from './Copyable.types';

export const Copyable = ({ copyText, displayText, withIcon = false, onClick, popoverRef, sx }: CopyableProps) => {
  const [helperText, setHelperText] = useState(displayText);

  const handleCopyText: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      event.stopPropagation();
      setHelperText(copyTextHelpers.success);
    },
    [setHelperText],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setHelperText(displayText);
    }, COPY_TEXT_SHOW_TIME);
    return () => clearTimeout(timer);
  }, [displayText, helperText]);

  return (
    <div
      role="presentation"
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      css={{
        width: '100%',
        height: 54,
        padding: '16px 26px 16px 38px',
        borderRadius: RADIUS_XL,
        border: 'none',
        background: COLOR_COPYABLE,
        gap: 16,
        ...flexHelper({ justifyContent: 'space-between', alignItems: 'center' }),
        cursor: onClick ? 'pointer' : 'initial',
        ...sx,
      }}
    >
      <Typography variant="button" color="white">
        {helperText}
      </Typography>
      <CopyToClipboard text={copyText}>
        <button aria-label="copy" type="button" onClick={handleCopyText}>
          <Icon type="copy" width={28} />
        </button>
      </CopyToClipboard>
    </div>
  );
};
