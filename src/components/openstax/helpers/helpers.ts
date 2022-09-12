import { Device } from '@boclips-ui/media-breakpoints';

const INITIAL_CHAPTER_NUMBER = 1;

export const selectedChapterNumber = (locationHash: string) =>
  locationHash.length > 0
    ? Number(locationHash.split('-')[1])
    : INITIAL_CHAPTER_NUMBER;

export const scrollToSelectedSection = (
  newSectionLink: string,
  currentBreakpoint: Device,
) => {
  const element = document.getElementById(newSectionLink);
  if (!element) return;
  const yCoordinate = element.getBoundingClientRect().top + window.scrollY;
  const navbarOffset = currentBreakpoint.type === 'desktop' ? -74 : -121;
  const padding = -16;
  window.scrollTo({
    top: yCoordinate + navbarOffset + padding,
    behavior: 'smooth',
  });
};
