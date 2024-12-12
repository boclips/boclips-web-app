import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { buildVideoDetailsLink } from '@src/services/buildVideoDetailsLink';

describe('buildVideoDetailsLink', () => {
  it('adds referer user to the video page url', () => {
    const video = VideoFactory.sample({ id: 'myfavvideo' });
    const user = UserFactory.sample({ id: 'myuserid' });

    const url = buildVideoDetailsLink(video, user);

    expect(url).toMatch(/videos\/myfavvideo/);
    expect(url).toMatch(/referer=myuserid/);
  });
});
