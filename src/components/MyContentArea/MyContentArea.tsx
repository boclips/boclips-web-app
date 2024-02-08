import React from 'react';
import List from 'antd/lib/list';
import LicensedContentCard from 'src/components/LicensedContentCard/LicensedContentCard';
import { LicensedContent } from 'boclips-api-client/dist/sub-clients/licenses/model/LicensedContent';

interface Props {
  licensedContent: LicensedContent[];
}
const MyContentArea = ({ licensedContent }: Props) => {
  return (
    <main
      tabIndex={-1}
      className="col-start-2 col-end-26 row-start-3 row-end-4 flex items-start"
    >
      <List
        className="w-full"
        itemLayout="vertical"
        size="large"
        dataSource={licensedContent}
        renderItem={(licensedContentItem: LicensedContent) => (
          <LicensedContentCard licensedContent={licensedContentItem} />
        )}
      />
    </main>
  );
};

export default MyContentArea;
