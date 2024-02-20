import React from 'react';
import List from 'antd/lib/list';
import LicensedContentCard from 'src/components/LicensedContentCard/LicensedContentCard';
import { LicensedContent } from 'boclips-api-client/dist/sub-clients/licenses/model/LicensedContent';
import Pagination from '@boclips-ui/pagination';
import s from 'src/components/common/pagination/pagination.module.less';
import Pageable from 'boclips-api-client/dist/sub-clients/common/model/Pageable';

interface Props {
  licensedContentPage: Pageable<LicensedContent>;
  onPageChange: (newPage: number) => void;
}

const MyContentArea = ({ licensedContentPage, onPageChange }: Props) => {
  const itemRender = React.useCallback(
    (page, type) => {
      return (
        <Pagination
          buttonType={type}
          mobileView={false}
          page={page}
          currentPage={licensedContentPage.pageSpec.number + 1}
          totalItems={licensedContentPage?.pageSpec.totalPages}
        />
      );
    },
    [licensedContentPage],
  );

  return (
    <main
      tabIndex={-1}
      className="col-start-2 col-end-26 row-start-3 row-end-4 flex items-start"
    >
      {licensedContentPage?.page && (
        <List
          className="w-full"
          itemLayout="vertical"
          size="large"
          dataSource={licensedContentPage.page}
          renderItem={(licensedContentItem: LicensedContent) => (
            <LicensedContentCard licensedContent={licensedContentItem} />
          )}
          pagination={{
            total: licensedContentPage.pageSpec.totalElements,
            className: s.pagination,
            hideOnSinglePage: true,
            pageSize: licensedContentPage.pageSpec.size,
            showSizeChanger: false,
            onChange: (page) => onPageChange(page - 1),
            current: licensedContentPage.pageSpec.number + 1,
            showLessItems: false,
            prefixCls: 'bo-pagination',
            itemRender,
          }}
        />
      )}
    </main>
  );
};

export default MyContentArea;
