export interface Stats {
  totalNumberOfVideos: number;
  totalNumberOfViews: number;
  totalMinutesWatched: number;
  numberOfVideosOrdered: number;
  mostPopularVideos: Video[];
}

export interface Video {
  videoId: string;
  videoTitle: string;
  views: number;
  ctrScore: number;
}

export interface Contract {
  contractId: string;
  contractName: string;
}
