import React, { useState } from 'react';
import { useOwnAndSharedPlaylistsQuery } from 'src/hooks/api/playlistsQuery';
import SkeletonTiles from 'src/components/skeleton/Skeleton';
import Thumbnails from 'src/components/playlists/thumbnails/Thumbnails';
import { CopyButton } from 'src/components/common/copyLinkButton/CopyButton';
import { Constants } from 'src/AppConstants';
import { Link } from 'react-router-dom';
import { HotjarEvents } from 'src/services/analytics/hotjar/Events';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import List from 'antd/lib/list';
import Pagination from '@boclips-ui/pagination';
import c from 'classnames';
import { ListViewCollection } from 'boclips-api-client/dist/sub-clients/collections/model/ListViewCollection';
import { getMediaBreakpoint } from '@boclips-ui/use-media-breakpoints';
import PlaylistOwnerBadge from 'src/components/playlists/playlistHeader/PlaylistOwnerBadge';
import SearchIcon from 'resources/icons/search-icon.svg';
import { InputText } from '@boclips-ui/input';
import { useDebounce } from 'src/hooks/useDebounce';
import s from './style.module.less';
import GridCard from '../common/gridCard/GridCard';
import paginationStyles from '../common/pagination/pagination.module.less';

export const PLAYLISTS_PAGE_SIZE = 20;

const Playlists = () => {
  const currentBreakpoint = getMediaBreakpoint();
  const mobileView = currentBreakpoint.type === 'mobile';
  const [query, setQuery] = useState<string | undefined>(undefined);
  const debouncedQuery = useDebounce(query, 1000);

  const linkCopiedHotjarEvent = () =>
    AnalyticsFactory.hotjar().event(HotjarEvents.PlaylistLinkCopied);
  const [page, setPage] = useState<number>(1);

  const { data: playlists, isInitialLoading } = useOwnAndSharedPlaylistsQuery(
    page,
    debouncedQuery,
  );

  const handlePageChange = (newPage: number) => {
    window.scrollTo({ top: 0 });
    setPage(newPage);
  };

  const itemRender = React.useCallback(
    (pageNb, type) => {
      return (
        <Pagination
          buttonType={type}
          page={pageNb}
          mobileView={mobileView}
          currentPage={page}
          totalItems={Math.ceil(
            playlists.pageSpec.totalElements / PLAYLISTS_PAGE_SIZE,
          )}
        />
      );
    },
    [mobileView, page, playlists?.pageSpec.totalPages],
  );

  return (
    <main tabIndex={-1} className={s.playlistsWrapper}>
      <div className="mb-6 w-80">
        <InputText
          id="playlist-search"
          onChange={(text) => setQuery(text)}
          inputType="text"
          placeholder="Search for playlists"
          icon={<SearchIcon />}
          constraints={{ required: true }}
        />
      </div>
      {isInitialLoading ? (
        <SkeletonTiles className={s.skeletonCard} rows={3} cols={4} />
      ) : (
        playlists.page.length > 0 && (
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
              <li data-qa="playlist-card">
                <GridCard
                  key={playlist.id}
                  link={`/playlists/${playlist.id}`}
                  name={playlist.title}
                  overlay={
                    playlist.mine === false && (
                      <div className={s.sharedWithYouOverlay}>
                        Shared with you
                      </div>
                    )
                  }
                  header={
                    <Link
                      tabIndex={-1}
                      to={`/playlists/${playlist.id}`}
                      aria-hidden
                    >
                      <Thumbnails videos={playlist.videos} />
                    </Link>
                  }
                  subheader={
                    <div className={s.playlistSubheader}>
                      <PlaylistOwnerBadge playlist={playlist} />
                    </div>
                  }
                  footer={
                    <div className="w-fit	self-end p-1">
                      <CopyButton
                        ariaLabel="Copy playlist link"
                        textToCopy={`${Constants.HOST}/playlists/${playlist.id}`}
                        dataQa={`share-playlist-button-${playlist.id}`}
                        onCopy={linkCopiedHotjarEvent}
                      />
                    </div>
                  }
                />
              </li>
            )}
          />
        )
      )}
    </main>
  );
};

export default Playlists;
