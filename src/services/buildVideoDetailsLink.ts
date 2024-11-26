import { Video } from 'boclips-api-client/dist/types';
import { Constants } from '@src/AppConstants';
import { User } from 'boclips-api-client/dist/sub-clients/users/model/User';

export const buildVideoDetailsLink = (video: Video, referer: User): string => {
  return `${Constants.HOST}/videos/${video.id}?referer=${referer.id}`;
};
