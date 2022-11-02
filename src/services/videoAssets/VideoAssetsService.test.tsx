import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { VideoAssetsService } from '~/services/videoAssets/VideoAssetsService';
import eventually from '../../../test_support/eventually';

describe('Video Asset Service', () => {
  const videoTitle = 'Some video title';
  const videoAssetsLink = 'https://video-service/video/1/assets';
  const downloadVideoTriggered = () => document.body.appendChild;
  let axiosMock: MockAdapter;

  beforeEach(async () => {
    axiosMock = new MockAdapter(axios);
  });

  it('triggers downloading video when no captions link', async () => {
    axiosMock.onGet(videoAssetsLink).reply(
      200,
      JSON.stringify({
        downloadVideoUrl: '/download-video-link',
      }),
    );
    jest.spyOn(document.body, 'appendChild');

    VideoAssetsService.downlaodVideoAsset(videoAssetsLink);

    await eventually(() => {
      expect(downloadVideoTriggered()).toHaveBeenCalledTimes(1);
    });
  });

  it('download captions', async () => {
    const mockSuccessResponse = new Blob(['this is a blob']);
    const mockBlobPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      blob: () => mockBlobPromise,
    });

    // @ts-ignore
    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);
    // @ts-ignore
    window.XMLHttpRequest = jest.fn();

    axiosMock.onGet(videoAssetsLink).reply(
      200,
      JSON.stringify({
        downloadVideoUrl:
          'https://cfvod.kaltura.com/pd/p/1776261/sp/1234/serveFlavor/entryId/0_w42xjdj2/v/11/' +
          'ev/4/flavorId/1_udjhpma1/fileName/' +
          'That_is_a_video_name_(SD_Large_-_WEB_MBL_(H264_1500)).mp4' +
          '/name/a.mp4',
        downloadCaptionUrl: '/caption-download-link',
        captionFileExtension: 'vtt',
      }),
    );

    jest.spyOn(VideoAssetsService, 'downloadBlob');

    VideoAssetsService.downloadCaptionsAsset(videoTitle, videoAssetsLink);

    await eventually(() => {
      expect(VideoAssetsService.downloadBlob).toHaveBeenCalledTimes(1);
      expect(VideoAssetsService.downloadBlob).toBeCalledWith(
        mockSuccessResponse,
        'That_is_a_video_name_(SD_Large_-_WEB_MBL_(H264_1500)).vtt',
      );
    });
  });
});
