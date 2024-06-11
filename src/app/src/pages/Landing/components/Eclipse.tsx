import { eclipse } from '../../../assets/images';

export const Eclipse = () => {
  return (
    <div
      css={{
        position: 'absolute',
        top: '10%',
        left: '0%',
        zIndex: 0,
        maxWidth: 979,
        maxHeight: 979,
        transform: 'translateZ(-100px)',
        opacity: 0.7,
      }}
    >
      <img src={eclipse} alt="landing glow sphere background" />;
    </div>
  );
};
