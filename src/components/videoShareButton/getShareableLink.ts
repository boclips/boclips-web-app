import queryString from 'querystring';
import { Constants } from 'src/AppConstants';

export const getShareableVideoLink = (
  videoId: string,
  userId: string,
  start: number = null,
  end: number = null,
): string => {
  const params: { [key: string]: any } = {
    referer: userId,
  };

  if (start) {
    params.segmentStart = start;
  }

  if (end) {
    params.segmentEnd = end;
  }

  const queryParams = queryString.stringify(params);

  return `${Constants.HOST}/videos/shared/${videoId}?${queryParams}`;
};

export const getShareablePlaylistLink = (
  playlistId: string,
  userId: string,
): string => {
  const params: { [key: string]: any } = {
    referer: userId,
  };

  const queryParams = queryString.stringify(params);

  return `${Constants.HOST}/playlists/shared/${playlistId}?${queryParams}`;
};
