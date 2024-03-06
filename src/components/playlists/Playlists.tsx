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
import { Tabs } from 'antd';
import List from 'antd/lib/list';
import Pageable from 'boclips-api-client/dist/sub-clients/common/model/Pageable';
import s from './style.module.less';
import GridCard from '../common/gridCard/GridCard';

const { TabPane } = Tabs;
export const PLAYLISTS_PAGE_SIZE = 1000;

const Playlists = () => {
  const [query, setQuery] = useState<string | undefined>(undefined);
  const debouncedQuery = useDebounce(query, 1000);

  const linkCopiedHotjarEvent = () =>
    AnalyticsFactory.hotjar().event(HotjarEvents.PlaylistLinkCopied);

  const { data: playlists, isInitialLoading } = useOwnAndSharedPlaylistsQuery(
    1,
    debouncedQuery,
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
      {isInitialLoading ? (
        <SkeletonTiles className={s.skeletonCard} rows={3} cols={4} />
      ) : (
        <Tabs defaultActiveKey="1">
          <TabPane tab="My Playlists" key="1">
            {renderPlaylistList(playlists, (playlist) => playlist.mine)}
          </TabPane>
          <TabPane tab="Shared Playlists" key="2">
            {renderPlaylistList(
              playlists,
              (playlist) => !playlist.mine && !isCreatedByBoclips(playlist),
            )}
          </TabPane>
          <TabPane tab="Boclips Playlists" key="3">
            {renderPlaylistList(
              playlists,
              (playlist) => !playlist.mine && isCreatedByBoclips(playlist),
            )}
          </TabPane>
        </Tabs>
      )}
    </main>
  );
};

export default Playlists;
