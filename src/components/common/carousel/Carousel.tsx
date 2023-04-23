import { Typography } from '@boclips-ui/typography';
import {
  ButtonBack,
  ButtonNext,
  CarouselProvider,
  Slide,
  Slider,
} from 'pure-react-carousel';
import ChevronSVG from 'src/resources/icons/chevron.svg';
import React, { ReactElement } from 'react';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';

interface Props {
  slides: ReactElement[];
  title: string;
}

export const Carousel = ({ slides, title }: Props) => {
  const breakpoints = useMediaBreakPoint();
  const isMobileView =
    breakpoints.type === 'mobile' || breakpoints.type === 'tablet';

  return (
    <div className="px-4 py-6 rounded-xl">
      <Typography.H3 className="mb-6 px-7">{title}</Typography.H3>
      {slides.length > 0 && (
        <CarouselProvider
          totalSlides={slides?.length}
          naturalSlideWidth={10}
          naturalSlideHeight={20}
          visibleSlides={isMobileView ? 2 : 4}
        >
          <div className="relative px-4">
            <Slider className="h-72 m-auto">
              {slides.map((slide: ReactElement, key: number) => (
                <Slide index={key}>{slide}</Slide>
              ))}
            </Slider>
            <ButtonBack className="absolute top-1/2 left-0 w-9 h-9">
              <ChevronSVG />
            </ButtonBack>
            <ButtonNext className="absolute top-1/2 right-0 transform rotate-180 w-9 h-9">
              <ChevronSVG />
            </ButtonNext>
          </div>
        </CarouselProvider>
      )}
    </div>
  );
};
