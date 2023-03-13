import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { BookFactory } from 'boclips-api-client/dist/test-support/BookFactory';
import { Book } from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import { convertApiTheme } from 'src/services/convertApiTheme';

export class OpenstaxBookFactory {
  static sample(book?: Partial<Book>): OpenstaxBook {
    return convertApiTheme(BookFactory.sample(book));
  }
}
