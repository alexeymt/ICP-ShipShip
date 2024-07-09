import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import { ringsList } from './images';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import './styles.scss';
import { useEffect, useRef, useState } from 'react';

interface SliderProps {
  currentCollection: string;
  onSelect: (imageIndex: number) => void;
}

export const Slider = ({ onSelect, currentCollection }: SliderProps) => {
  const [collection, setCollection] = useState([...ringsList[currentCollection]]);
  const swiperRef = useRef<SwiperRef | null>(null);

  useEffect(() => {
    setCollection([...ringsList[currentCollection]]);
  }, [currentCollection]);

  const handleRingSelect = (index: number) => {
    console.log(index);
    onSelect(index);
  };

  return (
    <Swiper
      ref={swiperRef}
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
      slideToClickedSlide={true}
    >
      {collection.map(({ id, source }, index: number) => (
        <SwiperSlide
          key={id}
          className="swiper-no-swiping"
          onClick={() => {
            swiperRef.current?.swiper.slideToLoop(index);
            handleRingSelect(index);
          }}
        >
          <img src={source} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
