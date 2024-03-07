import React, { useState } from 'react';
import { useOwnAndSharedPlaylistsQuery } from 'src/hooks/api/playlistsQuery';
import SkeletonTiles from 'src/components/skeleton/Skeleton';
import Thumbnails from 'src/components/playlists/thumbnails/Thumbnails';
import { CopyButton } from 'src/components/common/copyLinkButton/CopyButton';
import { Constants } from 'src/AppConstants';
import { Link } from 'react-router-dom';
import { HotjarEvents } from 'src/services/analytics/hotjar/Events';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { ListViewCollection } from 'boclips-api-client/dist/sub-clients/collections/model/ListViewCollection';
import PlaylistOwnerBadge from 'src/components/playlists/playlistHeader/PlaylistOwnerBadge';
import SearchIcon from 'resources/icons/search-icon.svg';
import { InputText } from '@boclips-ui/input';
import { useDebounce } from 'src/hooks/useDebounce';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import List from 'antd/lib/list';
import Pageable from 'boclips-api-client/dist/sub-clients/common/model/Pageable';
import { Typography } from '@boclips-ui/typography';
import * as Tabs from '@radix-ui/react-tabs';
import { getMediaBreakpoint } from '@boclips-ui/use-media-breakpoints';
import Pagination from '@boclips-ui/pagination';
import c from 'classnames';
import s from './style.module.less';
import GridCard from '../common/gridCard/GridCard';
import paginationStyles from '../common/pagination/pagination.module.less';

export const PLAYLISTS_PAGE_SIZE = 20;

const Playlists = () => {
  const currentBreakpoint = getMediaBreakpoint();
  const mobileView = currentBreakpoint.type === 'mobile';
  const [query, setQuery] = useState<string | undefined>(undefined);
  const debouncedQuery = useDebounce(query, 1000);
  const [page, setPage] = useState<number>(1);

  const linkCopiedHotjarEvent = () =>
    AnalyticsFactory.hotjar().event(HotjarEvents.PlaylistLinkCopied);

  const { data: playlists, isInitialLoading } = useOwnAndSharedPlaylistsQuery(
    page,
    debouncedQuery,
  );

  const handlePageChange = (newPage: number) => {
    window.scrollTo({ top: 0 });
    setPage(newPage);
  };

  function renderPagination(type, pageNumber, totalElements) {
    return (
      <Pagination
        buttonType={type}
        page={pageNumber}
        mobileView={mobileView}
        currentPage={page}
        totalItems={Math.ceil(totalElements / PLAYLISTS_PAGE_SIZE)}
      />
    );
  }

  const itemRender = React.useCallback(
    (pageNb, type) => {
      return renderPagination(type, pageNb, playlists.pageSpec.totalElements);
    },
    [mobileView, page, playlists?.pageSpec.totalPages],
  );

  const renderPlaylistList = (
    playlistsToRender: Pageable<ListViewCollection>,
    filter: (playlist: ListViewCollection) => boolean = () => true,
  ) => {
    const filteredPlaylists = playlistsToRender.page.filter(filter);
    return (
      filteredPlaylists.length > 0 && (
        <List
          data-qa="playlist-grid-container"
          className={s.gridView}
          dataSource={filteredPlaylists}
          renderItem={(playlist: ListViewCollection) => (
            <li data-qa="playlist-card">
              <GridCard
                key={playlist.id}
                link={`/playlists/${playlist.id}`}
                name={playlist.title}
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
                  <FeatureGate product={Product.B2B}>
                    <div className="p-2 items-end flex">
                      <CopyButton
                        ariaLabel="Copy playlist link"
                        textToCopy={`${Constants.HOST}/playlists/${playlist.id}`}
                        dataQa={`share-playlist-button-${playlist.id}`}
                        onCopy={linkCopiedHotjarEvent}
                      />
                    </div>
                  </FeatureGate>
                }
              />
            </li>
          )}
        />
      )
    );
  };

  function isCreatedByBoclips(playlist: ListViewCollection) {
    return playlist.createdBy === 'Boclips';
  }

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
      <FeatureGate
        feature="BO_WEB_APP_DEV"
        fallback={
          isInitialLoading ? (
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
                        <FeatureGate product={Product.B2B}>
                          <div className="p-2 items-end flex">
                            <CopyButton
                              ariaLabel="Copy playlist link"
                              textToCopy={`${Constants.HOST}/playlists/${playlist.id}`}
                              dataQa={`share-playlist-button-${playlist.id}`}
                              onCopy={linkCopiedHotjarEvent}
                            />
                          </div>
                        </FeatureGate>
                      }
                    />
                  </li>
                )}
              />
            )
          )
        }
      >
        <Tabs.Root
          defaultValue="my-playlists"
          orientation="horizontal"
          className={s.playlistTabs}
        >
          <Tabs.List aria-label="tabs playlists" className={s.tabNavBar}>
            <Tabs.Trigger value="my-playlists" className={s.tabHeader}>
              <Typography.H5>My Playlists</Typography.H5>
            </Tabs.Trigger>
            <Tabs.Trigger value="shared-playlists" className={s.tabHeader}>
              <Typography.H5>Shared Playlists</Typography.H5>
            </Tabs.Trigger>
            <Tabs.Trigger value="boclips-playlists" className={s.tabHeader}>
              <Typography.H5>Boclips Playlists</Typography.H5>
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="my-playlists" className={s.tabContent}>
            {isInitialLoading ? (
              <SkeletonTiles className={s.skeletonCard} rows={3} cols={4} />
            ) : (
              renderPlaylistList(playlists, (playlist) => playlist.mine)
            )}
          </Tabs.Content>
          <Tabs.Content value="shared-playlists" className={s.tabContent}>
            {isInitialLoading ? (
              <SkeletonTiles className={s.skeletonCard} rows={3} cols={4} />
            ) : (
              renderPlaylistList(
                playlists,
                (playlist) => !playlist.mine && !isCreatedByBoclips(playlist),
              )
            )}
          </Tabs.Content>
          <Tabs.Content value="boclips-playlists" className={s.tabContent}>
            {isInitialLoading ? (
              <SkeletonTiles className={s.skeletonCard} rows={3} cols={4} />
            ) : (
              renderPlaylistList(
                playlists,
                (playlist) => !playlist.mine && isCreatedByBoclips(playlist),
              )
            )}
          </Tabs.Content>
        </Tabs.Root>
      </FeatureGate>
    </main>
  );
};

export default Playlists;
