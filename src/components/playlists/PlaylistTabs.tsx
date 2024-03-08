import React from 'react';
import { ListViewCollection } from 'boclips-api-client/dist/sub-clients/collections/model/ListViewCollection';
import Pageable from 'boclips-api-client/dist/sub-clients/common/model/Pageable';
import * as Tabs from '@radix-ui/react-tabs';
import { Typography } from '@boclips-ui/typography';
import SkeletonTiles from 'src/components/skeleton/Skeleton';
import PlaylistList from 'src/components/playlists/PlaylistList';
import s from './style.module.less';

interface PlaylistTabsProps {
  playlists: Pageable<ListViewCollection>;
  isInitialLoading: boolean;
}

export const PlaylistTabs: React.FC<PlaylistTabsProps> = ({
  playlists,
  isInitialLoading,
}) => {
  const isCreatedByBoclips = (playlist: ListViewCollection) =>
    playlist.createdBy === 'Boclips';

  return (
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
          <PlaylistList
            playlists={playlists}
            filter={(playlist) => playlist.mine}
          />
        )}
      </Tabs.Content>
      <Tabs.Content value="shared-playlists" className={s.tabContent}>
        {isInitialLoading ? (
          <SkeletonTiles className={s.skeletonCard} rows={3} cols={4} />
        ) : (
          <PlaylistList
            playlists={playlists}
            filter={(playlist) =>
              !playlist.mine && !isCreatedByBoclips(playlist)
            }
          />
        )}
      </Tabs.Content>
      <Tabs.Content value="boclips-playlists" className={s.tabContent}>
        {isInitialLoading ? (
          <SkeletonTiles className={s.skeletonCard} rows={3} cols={4} />
        ) : (
          <PlaylistList
            playlists={playlists}
            filter={(playlist) =>
              !playlist.mine && isCreatedByBoclips(playlist)
            }
          />
        )}
      </Tabs.Content>
    </Tabs.Root>
  );
};
