import { OpenstaxChapter } from 'src/types/OpenstaxBook';
import { ChapterFactory } from 'boclips-api-client/dist/test-support/BookFactory';
import { convertApiChapterToOpenstaxChapter } from 'src/services/convertApiBookToOpenstaxBook';
import { Chapter } from 'boclips-api-client/dist/sub-clients/openstax/model/Books';

export class OpenstaxChapterFactory {
  static sample(chapter?: Partial<Chapter>): OpenstaxChapter {
    return convertApiChapterToOpenstaxChapter(ChapterFactory.sample(chapter));
  }
}
