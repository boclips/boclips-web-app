import { Video } from 'boclips-api-client/dist/types';
import List from 'antd/lib/list';
import { PAGE_SIZE } from 'src/views/search/SearchResultsView';
import React from 'react';
import { VideoCardWrapper } from 'src/components/videoCard/VideoCardWrapper';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import Pagination from '@boclips-ui/pagination';
import c from 'classnames';
import s from '../common/pagination/pagination.module.less';

interface Props {
  videos: Video[];
  totalSearchResults: number;
  handlePageChange: (page: number) => void;
  currentPage: number;
}

export const VideosListView = ({
  videos,
  totalSearchResults,
  handlePageChange,
  currentPage,
}: Props) => {
  const currentBreakpoint = useMediaBreakPoint();
  const mobileView = currentBreakpoint.type === 'mobile';

  const itemRender = React.useCallback(
    (page, type) => {
      return (
        <Pagination
          buttonType={type}
          page={page}
          mobileView={mobileView}
          currentPage={currentPage}
          totalItems={Math.ceil(totalSearchResults / PAGE_SIZE)}
        />
      );
    },
    [currentPage, mobileView, totalSearchResults],
  );

  return (
    <List
      itemLayout="vertical"
      size="large"
      pagination={{
        total: totalSearchResults,
        className: c(s.pagination, {
          [s.paginationEmpty]: !videos.length,
        }),
        hideOnSinglePage: true,
        pageSize: PAGE_SIZE,
        showSizeChanger: false,
        onChange: handlePageChange,
        current: currentPage,
        showLessItems: mobileView,
        prefixCls: 'bo-pagination',
        itemRender,
      }}
      dataSource={videos}
      renderItem={(video: Video) => (
        <li className="mb-4" data-qa="video-card-wrapper">
          <VideoCardWrapper video={video} />
        </li>
      )}
    />
  );
};
