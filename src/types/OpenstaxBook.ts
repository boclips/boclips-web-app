import {
  Book,
  Chapter,
  Section,
} from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';

export interface OpenstaxBook extends Book {
  videoCount: number;
  chapters: OpenstaxChapter[];
}

export interface OpenstaxChapter extends Chapter {
  videoCount: number;
  chapterOverview: OpenstaxChapterIntro;
  discussionPrompt: OpenstaxChapterIntro;
  sections: OpenstaxSection[];
}

export interface OpenstaxChapterIntro {
  title: string;
  videos: Video[];
}

export interface OpenstaxSection extends Section {
  videoCount: number;
}
