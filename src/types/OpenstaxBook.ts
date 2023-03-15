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
  targets: OpenstaxSection[];
}

export interface OpenstaxSection extends Target {
  videoCount: number;
}
