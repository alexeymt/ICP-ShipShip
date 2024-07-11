import { Copyable, Typography } from '../../components';
import { FontFamily } from '../../components/Typography/Typography.types';
import { GRADIENT_YELLOW, RADIUS_S } from '../../styles';
import { shortenPhrase } from '../../utils';

interface ShareLinkProps {
  title: string;
  link: string;
  disabled: boolean;
  description?: string;
}

export const ShareLink = ({ title, description, link, disabled = true }: ShareLinkProps) => {
  return (
    <div css={{ padding: 16, borderRadius: RADIUS_S, background: GRADIENT_YELLOW, marginTop: 24 }}>
      <Typography color="white" variant="body" css={{ fontWeight: 600, marginBottom: 13 }}>
        {title}
      </Typography>

      {description && (
        <Typography
          variant="label"
          family={FontFamily.Poppins}
          color="white"
          css={{ fontWeight: 400, marginBottom: 8 }}
        >
          {description}
        </Typography>
      )}

      <Copyable
        copyText={`${window.location.host}${link}`}
        displayText={shortenPhrase(`${window.location.host}${link}`, 26, 26)}
        sx={{
          padding: '8px 16px',
          p: { fontSize: 14, fontWeight: 400, fontFamily: FontFamily.Poppins },
          borderRadius: RADIUS_S,
        }}
        disabled={disabled}
      />
    </div>
  );
};
