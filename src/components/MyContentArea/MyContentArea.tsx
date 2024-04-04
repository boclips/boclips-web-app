import React from 'react';
import List from 'antd/lib/list';
import LicensedContentCard from 'src/components/LicensedContentCard/LicensedContentCard';
import { LicensedContent } from 'boclips-api-client/dist/sub-clients/licenses/model/LicensedContent';
import Pagination from '@boclips-ui/pagination';
import s from 'src/components/common/pagination/pagination.module.less';
import Pageable from 'boclips-api-client/dist/sub-clients/common/model/Pageable';
import VideoCardPlaceholder from '@boclips-ui/video-card-placeholder';

interface Props {
  licensedContentPage: Pageable<LicensedContent>;
  onPageChange: (newPage: number) => void;
  isLoading: boolean;
}

const MyContentArea = ({
  licensedContentPage,
  onPageChange,
  isLoading,
}: Props) => {
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

  const placeholderView = Array.from(Array(6)).map((value) => (
    <div
      className="mb-8 w-full"
      style={{ maxHeight: '265px' }}
      key={`licensed-content-placeholder-${value}`}
      data-qa="licensed-content-card-placeholder"
    >
      <VideoCardPlaceholder displayHeader={false} />
    </div>
  ));

  return (
    <main
      tabIndex={-1}
      className="col-start-2 col-end-26 row-start-3 row-end-4 flex flex-col items-start"
    >
      {isLoading && placeholderView}
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
