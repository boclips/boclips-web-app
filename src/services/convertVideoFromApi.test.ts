import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { PlaybackFactory } from 'boclips-api-client/dist/test-support/PlaybackFactory';
import { Link } from 'boclips-api-client/dist/types';
import { convertVideoFromApi } from './convertVideoFromApi';

describe('Converting an API video', () => {
  it('converts an api video to a UI video', () => {
    const video = VideoFactory.sample({
      id: 'id',
      title: 'appa the flying bison',
      description: 'to unblock the 7th chakra, you must let go',
      ageRange: { min: 5, max: 18 },
      playback: PlaybackFactory.sample({
        links: {
          thumbnail: new Link({ href: 'hi' }),
          createPlayerInteractedWithEvent: new Link({ href: 'playbacklink' }),
        },
      }),
      links: {
        self: new Link({ href: '/v1/videos/id' }),
        rate: new Link({ href: '/v1/videos/id/rate/4' }),
        logInteraction: new Link({ href: '/v1/videos/id' }),
        addAttachment: new Link({ href: '/v1/videos/id' }),
        assets: new Link({ href: '/v1/videos/id' }),
        captions: new Link({ href: '/v1/videos/id' }),
        tag: new Link({ href: '/v1/videos/id' }),
        transcript: new Link({ href: '/v1/videos/id' }),
        update: new Link({ href: '/v1/videos/id' }),
      },
    });

    const convertedVideo = convertVideoFromApi(video);

    expect(convertedVideo.id).toEqual(video.id);
    expect(convertedVideo.title).toEqual(video.title);
    expect(convertedVideo.description).toEqual(video.description);
    expect(convertedVideo.additionalDescription).toEqual(
      video.additionalDescription,
    );
    expect(convertedVideo.releasedOn).toEqual(video.releasedOn);
    expect(convertedVideo.playback).toEqual(video.playback);
    expect(convertedVideo.subjects).toEqual(video.subjects);
    expect(convertedVideo.badges).toEqual(video.badges);
    expect(convertedVideo.legalRestrictions).toEqual(video.legalRestrictions);
    expect(convertedVideo.ageRange).toEqual(null);
    expect(convertedVideo.rating).toEqual(video.rating);
    expect(convertedVideo.yourRating).toEqual(video.yourRating);
    expect(convertedVideo.bestFor).toEqual(video.bestFor);
    expect(convertedVideo.createdBy).toEqual(video.createdBy);
    expect(convertedVideo.promoted).toEqual(video.promoted);
    expect(convertedVideo.language).toEqual(video.language);
    expect(convertedVideo.attachments).toEqual(video.attachments);
    expect(convertedVideo.links.self.getOriginalLink()).toEqual(
      video.links.self.getOriginalLink(),
    );
    expect(convertedVideo.links.self.getOriginalLink()).toEqual(
      video.links.self.getOriginalLink(),
    );
    expect(convertedVideo.links.addAttachment.getOriginalLink()).toEqual(
      video.links.addAttachment.getOriginalLink(),
    );
    expect(convertedVideo.links.assets.getOriginalLink()).toEqual(
      video.links.assets.getOriginalLink(),
    );
    expect(convertedVideo.links.captions.getOriginalLink()).toEqual(
      video.links.captions.getOriginalLink(),
    );
    expect(convertedVideo.links.logInteraction.getOriginalLink()).toEqual(
      video.links.logInteraction.getOriginalLink(),
    );
    expect(convertedVideo.links.rate.getOriginalLink()).toEqual(
      video.links.rate.getOriginalLink(),
    );
    expect(convertedVideo.links.tag.getOriginalLink()).toEqual(
      video.links.tag.getOriginalLink(),
    );
    expect(convertedVideo.links.transcript.getOriginalLink()).toEqual(
      video.links.transcript.getOriginalLink(),
    );
    expect(convertedVideo.links.update.getOriginalLink()).toEqual(
      video.links.update.getOriginalLink(),
    );
  });
});
