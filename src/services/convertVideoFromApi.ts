import { Video as ClientVideo } from 'boclips-api-client/dist/types';
import { Video as UiVideo } from '@boclips-ui/video';
import { convertFromApiClientLink } from '@boclips-ui/link';

export const convertVideoFromApi = (video: ClientVideo): UiVideo => {
  const {
    id,
    title,
    description,
    additionalDescription,
    releasedOn,
    playback,
    subjects,
    badges,
    legalRestrictions,
    rating,
    yourRating,
    bestFor,
    createdBy,
    promoted,
    language,
    attachments,
    links,
  } = video;

  return {
    id,
    title,
    description,
    additionalDescription,
    releasedOn,
    playback,
    subjects,
    badges,
    legalRestrictions,
    ageRange: null,
    rating,
    yourRating,
    bestFor,
    createdBy,
    promoted,
    language,
    attachments,
    links: {
      self: convertFromApiClientLink(links.self),
      rate: convertFromApiClientLink(links.rate),
      tag: convertFromApiClientLink(links.tag),
      captions: convertFromApiClientLink(links.captions),
      logInteraction: convertFromApiClientLink(links.logInteraction),
      addAttachment: convertFromApiClientLink(links.addAttachment),
      assets: convertFromApiClientLink(links.assets),
      transcript: convertFromApiClientLink(links.transcript),
      update: convertFromApiClientLink(links.update),
    },
  };
};
