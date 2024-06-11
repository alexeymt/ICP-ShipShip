import { Theme } from '@emotion/react';
import styled from '@emotion/styled';

import { COLOR_GRAY, COLOR_WH, RADIUS_S } from '../../styles';
import { Typography } from '../Typography';
import { FontFamily } from '../Typography/Typography.types';

export type InputProps = {
  id?: string;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  value?: string;
  onChange: (value: any) => void;
  onBlur?: (e: any) => void;
  name?: string;
  title?: string;
  sx?: Theme;
};

const StyledInput = styled.input({
  width: '100%',
  padding: 16,
  background: COLOR_WH,
  borderRadius: RADIUS_S,
  border: 'none',

  '&::placeholder': {
    fontFamily: 'Poppins',
    fontSize: 14,
    lineHeight: '20px',
    color: COLOR_GRAY,
  },
});

export const Input = ({
  title,
  id,
  name,
  onBlur,
  value,
  disabled,
  onChange,
  placeholder,
  readonly,
  sx,
}: InputProps) => {
  return (
    <div css={{ ...sx }}>
      {title && (
        <Typography variant="label" family={FontFamily.Poppins} css={{ fontWeight: 400, marginBottom: 8 }}>
          {title}
        </Typography>
      )}

      <StyledInput
        id={id}
        name={name}
        autoComplete="off"
        readOnly={readonly}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
      />
    </div>
  );
};
