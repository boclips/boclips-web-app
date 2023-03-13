import { OpenstaxBook } from 'src/types/OpenstaxBook';

import { convertApiTheme } from 'src/services/convertApiTheme';
import { ThemeFactory } from 'boclips-api-client/dist/test-support/ThemeFactory';
import { Theme } from 'boclips-api-client/dist/sub-clients/alignments/model/Theme';

export class OpenstaxBookFactory {
  static sample(theme?: Partial<Theme>): OpenstaxBook {
    return convertApiTheme(ThemeFactory.sample(theme));
  }
}
