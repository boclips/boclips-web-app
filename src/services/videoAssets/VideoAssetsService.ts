import axios, { AxiosResponse } from 'axios';
import download from 'downloadjs';
import { isBoclipsApiError } from 'boclips-api-client/dist/types';
import { notification } from 'antd';

export class VideoAssetsService {
  public static downlaodVideoAsset(fetchVideoUrlAssetsLink: string) {
    axios
      .get(fetchVideoUrlAssetsLink)
      .then((response: AxiosResponse) => {
        const videoUrl = response.data.downloadVideoUrl;

        if (videoUrl) {
          this.downloadFileFromUrl(videoUrl);
        }
      })
      .catch((e) => {
        if (isBoclipsApiError(e)) {
          notification.error({
            message: e.error,
            description: e.message,
            placement: 'bottomRight',
          });
        } else {
          notification.error({
            message: e.response.data.error,
            description: e.response.data.message,
            placement: 'bottomRight',
          });
        }
      });
  }

  public static downloadCaptionsAsset(
    videoTitle: string,
    fetchVideoUrlAssetsLink: string,
  ) {
    axios
      .get(fetchVideoUrlAssetsLink)
      .then((response: AxiosResponse) => {
        const captionFileExtension = response.data.captionFileExtension;
        if (response.data.downloadCaptionUrl) {
          const fileName = this.buildCaptionsFileName(
            response.data.downloadVideoUrl,
            captionFileExtension,
            videoTitle,
          );
          this.downloadContentFromUrl(
            response.data.downloadCaptionUrl,
            fileName,
          );
        }
      })
      .catch((e) => {
        if (isBoclipsApiError(e)) {
          notification.error({
            message: e.error,
            description: e.message,
            placement: 'bottomRight',
          });
        } else {
          notification.error({
            message: e.response.data.error,
            description: e.response.data.message,
            placement: 'bottomRight',
          });
        }
      });
  }

  private static buildCaptionsFileName(
    videoUrl: string,
    captionFileExtension: string,
    videoTitle: string,
  ) {
    return videoUrl
      ? this.extractFilenameAndAppendExtension(videoUrl, captionFileExtension)
      : this.buildFileNameBasedOnVideoTitle(videoTitle, captionFileExtension);
  }

  private static extractFilenameAndAppendExtension(
    videoUrl: string,
    captionFileExtension: string,
  ) {
    return `${this.extractFilenameFromUrl(videoUrl)}.${captionFileExtension}`;
  }

  private static downloadFileFromUrl(urlToFile: string, filename?: string) {
    const link = document.createElement('a');
    link.href = urlToFile;
    if (filename) {
      link.setAttribute('download', filename);
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private static async downloadContentFromUrl(
    urlToContent: string,
    filename: string,
  ) {
    const contentResponse = await fetch(urlToContent);
    const blobResponse = await contentResponse.blob();
    this.downloadBlob(blobResponse, filename);
  }

  public static downloadBlob(blob: Blob, filename: string) {
    download(blob, filename, 'text/html');
  }

  private static extractFilenameFromUrl(url: string) {
    const regex = /fileName\/(.*?)\//;
    const matches = regex.exec(url);
    const matchedFilename = matches?.[1];

    return `${
      matchedFilename?.substr(0, matchedFilename.lastIndexOf('.')) ||
      url.substring(url.lastIndexOf('/'))
    }`;
  }

  private static buildFileNameBasedOnVideoTitle(
    videoTitle: string,
    extension: string,
  ) {
    const nameWithoutExtension = videoTitle.replace(/ /g, '_');
    return `${nameWithoutExtension}.${extension}`;
  }
}
