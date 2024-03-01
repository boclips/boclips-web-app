import { Duration } from 'dayjs/plugin/duration';
import { BASE_DURATION } from './DurationInput';

interface Trim {
  to?: string;
  from?: string;
}

export const isTrimFromValid = (trim: Trim, duration: Duration): boolean => {
  const { to, from } = trim;

  if (!from) {
    return false;
  }

  if (!isMatchingTimeFormat(from)) {
    return false;
  }

  if (from === to) {
    return false;
  }

  if (!!to && durationInSeconds(from) > durationInSeconds(to)) {
    return false;
  }

  if (isFullDuration(trim, duration)) {
    return false;
  }

  return true;
};

export const isTrimToValid = (trim: Trim, duration: Duration) => {
  const { from, to } = trim;

  if (!to) {
    return false;
  }

  if (!isMatchingTimeFormat(to)) {
    return false;
  }

  if (from === to) {
    return false;
  }

  if (!!from && durationInSeconds(from) > durationInSeconds(to)) {
    return false;
  }

  if (isFullDuration(trim, duration)) {
    return false;
  }

  if (durationInSeconds(trim.to) > duration.asSeconds()) {
    return false;
  }

  return true;
};

const isMatchingTimeFormat = (time: string) => time.match(/(^\d+:[0-5]\d$)/);

const isFullDuration = (trim: Trim, duration: Duration) =>
  isBaseDuration(trim.from) &&
  durationInSeconds(trim.to) === duration.asSeconds();

export const durationInSeconds = (time: string): number => {
  const minutesAndSeconds = time.split(':');
  return +minutesAndSeconds[0] * 60 + +minutesAndSeconds[1];
};

const isBaseDuration = (value: string) => BASE_DURATION === value;
