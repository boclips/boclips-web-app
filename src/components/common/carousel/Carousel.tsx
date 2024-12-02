import {
  ButtonBack,
  ButtonNext,
  CarouselProvider,
  Slide,
  Slider,
} from 'pure-react-carousel';
import ChevronSVG from '@src/resources/icons/chevron.svg';
import React, { ReactElement } from 'react';
import { useMediaBreakPoint, Typography } from 'boclips-ui';

interface Props {
  slides: ReactElement[];
  title: string;
}

export const Carousel = ({ slides, title }: Props) => {
  const breakpoints = useMediaBreakPoint();
  const isMobileView =
    breakpoints.type === 'mobile' || breakpoints.type === 'tablet';

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <>
      <Typography.H3 className="mb-6">{title}</Typography.H3>
      <CarouselProvider
        totalSlides={slides.length}
        naturalSlideWidth={10}
        naturalSlideHeight={20}
        visibleSlides={isMobileView ? 2 : 4}
      >
        <Slider>
          {slides.map((slide, key) => (
            <Slide key={key} index={key}>
              {slide}
            </Slide>
          ))}
        </Slider>
        <ButtonBack className="absolute top-1/2 left-0 w-9 h-9">
          <ChevronSVG />
        </ButtonBack>
        <ButtonNext className="absolute top-1/2 right-0 transform rotate-180 w-9 h-9">
          <ChevronSVG />
        </ButtonNext>
      </CarouselProvider>
    </>
  );
};
