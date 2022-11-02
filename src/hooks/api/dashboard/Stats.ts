export interface Stats {
  totalNumberOfVideos: number;
  totalMinutesWatched: number;
  numberOfVideosOrdered: number;
  mostPopularVideos: Video[];
}

export interface Video {
  videoId: string;
  videoTitle: string;
  views: number;
}
