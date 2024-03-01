import * as queryString from 'querystring';

export class GoogleClassroomUrlBuilder {
  private readonly baseUrl: string = 'https://classroom.google.com/u/0/share';

  private videoUrl: string;

  private videoTitle: string;

  private body: string;

  public setTitle(title: string) {
    this.videoTitle = title;
    return this;
  }

  public setVideoUrl(url: string) {
    this.videoUrl = url;
    return this;
  }

  public setBody(body: string) {
    this.body = body;
    return this;
  }

  public build(): string {
    const paramsToEncode = {
      url: this.videoUrl,
      title: this.videoTitle,
      body: this.body,
    };

    const query = queryString.stringify(paramsToEncode);

    return `${this.baseUrl}?${query}`;
  }
}
