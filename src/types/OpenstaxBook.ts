import {
  Book,
  Chapter,
  Section,
} from 'boclips-api-client/dist/sub-clients/openstax/model/Books';

export interface OpenstaxBook extends Book {
  videoCount: number;
  chapters: OpenstaxChapter[];
}

export interface OpenstaxChapter extends Chapter {
  videoCount: number;
  sections: OpenstaxSection[];
}

export interface OpenstaxSection extends Section {
  videoCount: number;
}
