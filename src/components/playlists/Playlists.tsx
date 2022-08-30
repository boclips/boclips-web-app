import React from 'react';
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
import { ListViewCollection } from 'boclips-api-client/dist/sub-clients/collections/model/ListViewCollection';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import s from './style.module.less';
import GridCard from '../common/gridCard/GridCard';

const Playlists = () => {
  const currentBreakpoint = useMediaBreakPoint();
  const mobileView = currentBreakpoint.type === 'mobile';

  const linkCopiedHotjarEvent = () =>
    AnalyticsFactory.hotjar().event(HotjarEvents.PlaylistLinkCopied);

  const { data: playlists, isLoading } = useOwnAndSharedPlaylistsQuery();

  const handlePageChange = (newPage: number) => {
    window.scrollTo({ top: 0 });
    paginationPage(newPage - 1);
  };

  const itemRender = React.useCallback(
    (page, type) => {
      return (
        <Pagination
          buttonType={type}
          page={page}
          mobileView={mobileView}
          currentPage={playlists.pageSpec.number + 1}
          totalItems={Math.ceil(playlists.pageSpec.totalPages)}
        />
      );
    },
    [mobileView, playlists.pageSpec.number, playlists.pageSpec.totalPages],
  );

  return (
    <main tabIndex={-1} className={s.playlistsWrapper}>
      {isLoading ? (
        <SkeletonTiles className={s.skeletonCard} />
      ) : (
        <List
          data-qa="library-pagination"
          className={s.gridView}
          pagination={{
            total: playlists.pageSpec.totalElements,
            // className: c(paginationStyles.pagination, {
            //   [paginationStyles.paginationEmpty]: !videos.length,
            // }),
            hideOnSinglePage: true,
            pageSize: 10,
            showSizeChanger: false,
            onChange: null,
            current: playlists.pageSpec.number + 1,
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
                  <Link tabIndex={-1} to={`/playlists/${playlist.id}`}>
                    <Thumbnails videos={playlist.videos} />
                  </Link>
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
      )}
    </main>
  );
};

export default Playlists;
