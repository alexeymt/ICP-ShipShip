import { sphere } from '../../../assets/images';

export const Sphere = () => {
  return (
    <div
      css={{
        position: 'absolute',
        top: '15%',
        left: '-7%',
        zIndex: -1,
        maxWidth: 496,
        maxHeight: 696,
        opacity: 0.7,
        transform: 'translateZ(-1px)',
      }}
    >
      <img src={sphere} alt="landing glow sphere background" loading="lazy" />
    </div>
  );
};
