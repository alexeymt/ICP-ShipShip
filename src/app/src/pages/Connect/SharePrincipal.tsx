import { Copyable, Typography } from '../../components';
import { FontFamily } from '../../components/Typography/Typography.types';
import { GRADIENT_YELLOW, RADIUS_S } from '../../styles';
import { shortenPhrase } from '../../utils';

export type SharePrincipalProps = {
  principal: string;
};

export const SharePrincipal = ({ principal }: SharePrincipalProps) => {
  return (
    <div css={{ padding: 16, borderRadius: RADIUS_S, background: GRADIENT_YELLOW, marginTop: 24 }}>
      <Typography color="white" variant="body" css={{ fontWeight: 600, marginBottom: 13 }}>
        Share your Principal ID with your Partner
      </Typography>

      <Typography variant="label" family={FontFamily.Poppins} color="white" css={{ fontWeight: 400, marginBottom: 8 }}>
        Your Principal ID:
      </Typography>

      <Copyable
        copyText={principal}
        displayText={shortenPhrase(principal, 26, 26)}
        sx={{
          padding: '8px 16px',
          p: { fontSize: 14, fontWeight: 400, fontFamily: FontFamily.Poppins },
          borderRadius: RADIUS_S,
        }}
      />
    </div>
  );
};
