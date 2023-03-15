import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import {
  Theme,
  Topic,
  Target,
} from 'boclips-api-client/dist/sub-clients/alignments/model/Theme';

export interface OpenstaxBook extends Theme {
  videoCount: number;
  topics: OpenstaxChapter[];
}

export interface OpenstaxChapter extends Topic {
  videoCount: number;
  chapterOverview: OpenstaxChapterIntro;
  discussionPrompt: OpenstaxChapterIntro;
  targets: OpenstaxSection[];
}

export interface OpenstaxChapterIntro {
  title: string;
  videos: Video[];
}

export interface OpenstaxSection extends Target {
  videoCount: number;
}
