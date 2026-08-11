import { GoogleClassroomUrlBuilder } from './GoogleClassroomUrlBuilder';

it('can build a valid url', () => {
  const url = new GoogleClassroomUrlBuilder()
    .setTitle('Matt and Alex')
    .setVideoUrl('/videos/123456789THEBESTVIDEO')
    .setBody('Use code ZXY to access.')
    .build();

  expect(url).toEqual(
    'https://classroom.google.com/u/0/share?url=%2Fvideos%2F123456789THEBESTVIDEO&title=Matt+and+Alex&body=Use+code+ZXY+to+access.',
  );
});
