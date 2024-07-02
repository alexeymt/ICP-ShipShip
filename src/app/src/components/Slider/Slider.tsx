import { MouseEvent, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import { ringsList } from './images';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import './styles.scss';

interface SliderProps {
  currentCollection: string;
  onSelect: (imageIndex: number) => void;
}

export const Slider = ({ onSelect, currentCollection }: SliderProps) => {
  const handleRingSelect = (index: number) => () => {
    console.log(index);
    onSelect(index);
  };

  return (
    <Swiper
      className="ring-swiper"
      effect={'coverflow'}
      initialSlide={3}
      centeredSlides={true}
      slidesPerView={3.225}
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 110,
        modifier: 3,
      }}
      loop={true}
      navigation={true}
      modules={[EffectCoverflow, Navigation]}
    >
      {ringsList[currentCollection].map(({ id, source }, index: number) => (
        <SwiperSlide key={id} className="swiper-no-swiping" onClick={handleRingSelect(index)}>
          <img src={source} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
