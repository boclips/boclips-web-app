import Pagination, { getMediaBreakpoint } from 'boclips-ui';
import List from 'antd/lib/list';
import Pageable from 'boclips-api-client/dist/sub-clients/common/model/Pageable';
import { ListViewCollection } from 'boclips-api-client/dist/sub-clients/collections/model/ListViewCollection';
import React from 'react';
import c from 'classnames';
import PlaylistCard from '@src/components/playlists/PlaylistCard';
import { PlaylistEmptyState } from '@src/components/playlists/emptyState/EmptyState';
import s from '../style.module.less';
import paginationStyles from '../../common/pagination/pagination.module.less';

interface PlaylistListProps {
  playlists: Pageable<ListViewCollection>;
  page?: number;
  handlePageChange?: (newPage: number) => void;
  playlistType?: 'mine' | 'shared' | 'boclips';
}

export const PLAYLISTS_PAGE_SIZE = 20;

const PlaylistList: React.FC<PlaylistListProps> = ({
  playlists,
  page = 1,
  handlePageChange = () => {},
  playlistType,
}) => {
  const currentBreakpoint = getMediaBreakpoint();
  const mobileView = currentBreakpoint.type === 'mobile';

  const itemRender = React.useCallback(
    (pageNumber: number, type: string) => (
      <Pagination
        buttonType={type}
        page={pageNumber}
        mobileView={mobileView}
        currentPage={page}
        totalItems={Math.ceil(
          playlists.pageSpec.totalElements / PLAYLISTS_PAGE_SIZE,
        )}
      />
    ),
    [mobileView, page, playlists?.pageSpec.totalPages],
  );

  return playlists?.page.length > 0 ? (
    <List
      data-qa="playlist-grid-container"
      className={s.gridView}
      pagination={{
        total: playlists.pageSpec.totalElements,
        className: c(paginationStyles.pagination, s.pagination, {
          [paginationStyles.paginationEmpty]: !playlists.page.length,
        }),
        hideOnSinglePage: true,
        pageSize: PLAYLISTS_PAGE_SIZE,
        showSizeChanger: false,
        onChange: handlePageChange,
        current: page,
        showLessItems: mobileView,
        prefixCls: 'bo-pagination',
        itemRender,
      }}
      dataSource={playlists.page}
      renderItem={(playlist: ListViewCollection) => (
        <PlaylistCard playlist={playlist} />
      )}
    />
  ) : (
    <PlaylistEmptyState playlistType={playlistType} />
  );
};

export default PlaylistList;
