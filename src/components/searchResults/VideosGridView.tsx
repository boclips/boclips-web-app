import { Video } from 'boclips-api-client/dist/types';
import { PAGE_SIZE } from '@src/views/search/SearchResultsView';
import React from 'react';
import Pagination, { useMediaBreakPoint } from 'boclips-ui';
import c from 'classnames';
import { HotjarEvents } from '@src/services/analytics/hotjar/Events';
import List from 'antd/lib/list';
import AnalyticsFactory from '@src/services/analytics/AnalyticsFactory';
import { FilterKey } from '@src/types/search/FilterKey';
import VideoGridCard from '@src/components/videoCard/VideoGridCard';
import s from './styles.module.less';
import paginationStyles from '../common/pagination/pagination.module.less';
import { VideoCardButtons } from '../videoCard/buttons/VideoCardButtons';

interface Props {
  videos: Video[];
  totalSearchResults: number;
  handlePageChange: (page: number) => void;
  handleFilterChange?: (filterKey: FilterKey, values: string[]) => void;
  currentPage: number;
}

export const VideosGridView = ({
  videos,
  totalSearchResults,
  handlePageChange,
  currentPage,
  handleFilterChange,
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
      className={s.gridView}
      pagination={{
        total: totalSearchResults,
        className: c(paginationStyles.pagination, {
          [paginationStyles.paginationEmpty]: !videos.length,
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
        <li data-qa="video-card-wrapper" key={video.id}>
          <VideoGridCard
            video={video}
            handleFilterChange={handleFilterChange}
            buttonsRow={
              <VideoCardButtons
                video={video}
                iconOnly
                onAddToCart={() => {
                  AnalyticsFactory.hotjar().event(
                    HotjarEvents.AddToCartFromPlaylistPage,
                  );
                }}
              />
            }
          />
        </li>
      )}
    />
  );
};
