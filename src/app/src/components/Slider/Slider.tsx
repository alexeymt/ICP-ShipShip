import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import { ringsList } from './images';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import './styles.scss';

interface SliderProps {
  onChange: (index: number) => void;
}

export const Slider = ({ onChange }: SliderProps) => {
  // const [currentSlide, setCurrentSlide] = useState(3);
  // console.log(currentSlide);

  const handleSlideChange = (event: { realIndex: number }) => {
    onChange(event.realIndex);
  };

  return (
    <Swiper
      className="ring-swiper"
      effect={'coverflow'}
      initialSlide={3}
      centeredSlides={true}
      slidesPerView={3.225}
      // slidesPerGroup={5}
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 110,
        modifier: 3,
      }}
      loop={true}
      navigation={true}
      modules={[EffectCoverflow, Navigation]}
      onSlideChange={handleSlideChange}
    >
      {ringsList.map(({ id, source }) => (
        <SwiperSlide key={id} className="swiper-no-swiping">
          <img src={source} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
