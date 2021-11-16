import { Video } from 'boclips-api-client/dist/types';
import List from 'antd/lib/list';
import { PAGE_SIZE } from 'src/views/search/SearchResultsView';
import React from 'react';
import { VideoCardWrapper } from 'src/components/videoCard/VideoCardWrapper';
import { PaginationButtons } from 'src/components/common/PaginationButtons';
import s from '../common/pagination.module.less';

interface Props {
  videos: Video[];
  totalSearchResults: number;
  handlePageChange: (page: number) => void;
  currentPage: number;
}

export const VideoCardList = ({
  videos,
  totalSearchResults,
  handlePageChange,
  currentPage,
}: Props) => {
  return (
    <List
      itemLayout="vertical"
      size="large"
      pagination={{
        total: totalSearchResults,
        pageSize: PAGE_SIZE,
        showSizeChanger: false,
        onChange: handlePageChange,
        current: currentPage,
        className: s.pagination,
        itemRender: PaginationButtons,
      }}
      dataSource={videos}
      renderItem={(video: Video) => (
        <div className="mb-4" data-qa="video-card-wrapper">
          <VideoCardWrapper video={video} />
        </div>
      )}
    />
  );
};
