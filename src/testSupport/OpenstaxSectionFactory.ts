import { OpenstaxSection } from 'src/types/OpenstaxBook';
import { SectionFactory } from 'boclips-api-client/dist/test-support/BookFactory';
import { Section } from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import { convertApiBookSectionToOpenstaxSection } from 'src/services/convertApiBookToOpenstaxBook';

export class OpenstaxSectionFactory {
  static sample(
    chapterNumber: number,
    section?: Partial<Section>,
  ): OpenstaxSection {
    const apiSection = SectionFactory.sample(section);
    return convertApiBookSectionToOpenstaxSection(chapterNumber, apiSection);
  }
}
