import styled from '@emotion/styled';

import { speaker } from '../../assets/images';
import { flexHelper } from '../../utils';
import { Icon } from '../Icons';
import { Modal, ModalProps } from '../Modal';
import { FontFamily, Typography } from '../Typography';

const BottomContent = styled.div({
  position: 'absolute',
  left: 10,
  bottom: 10,
  ...flexHelper({ alignItems: 'center' }),
  gap: 14,
});

const ModalContent = styled.div({
  maxHeight: 700,
  position: 'relative',
  display: 'flex',
  aspectRatio: 0.55,
});

interface StoryModalProps extends ModalProps {
  image: string;
}

export const StoryModal = ({ image, visible, onClose }: StoryModalProps) => {
  return (
    <Modal visible={visible} onClose={onClose}>
      <ModalContent>
        <img src={image} alt="Story" width="100%" />
        <button aria-label="close button" type="button" onClick={onClose}>
          <Icon type="close" width={56} height={56} sx={{ position: 'absolute', right: 10, top: 10 }} />
        </button>

        <BottomContent>
          <img alt="speaker" src={speaker} width={58} height={56} />
          <Typography
            variant="label"
            color="white"
            family={FontFamily.Poppins}
            css={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.28px' }}
          >
            Manifesto
          </Typography>
        </BottomContent>
      </ModalContent>
    </Modal>
  );
};
