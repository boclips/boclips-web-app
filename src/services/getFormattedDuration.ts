import { Duration } from 'dayjs/plugin/duration';

const getFormattedDuration = (duration: Duration) =>
  duration.asMinutes() > 60
    ? duration.format('H:mm:ss')
    : duration.format('mm:ss');

export default getFormattedDuration;
