import axios from 'axios';

interface Response {
  'suggested videos': string[];
}

export class RecommendationService {
  public static async fromCurrentVideos(
    videoIds: string[],
    // handler: (recommendations: string[]) => void,
  ): Promise<string[]> {
    if (videoIds.length === 0) {
      return [];
    }
    return axios
      .post<Response>(
        'http://localhost:8010/proxy/recommendations-from-playlist',
        {
          video_ids: videoIds,
        },
      )
      .then((response) => response.data['suggested videos']);
  }
}
