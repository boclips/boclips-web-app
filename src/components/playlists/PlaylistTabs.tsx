import React from 'react';
import { Typography } from '@boclips-ui/typography';
import {
  useBoclipsPlaylistsQuery,
  useOwnPlaylistsQuery,
  useSavedPlaylistsQuery,
} from 'src/hooks/api/playlistsQuery';
import { List, Root, Trigger } from '@radix-ui/react-tabs';
import { PlaylistTab } from 'src/components/playlists/PlaylistTab';
import s from './style.module.less';

interface PlaylistTabsProps {
  query?: string;
}

export const PlaylistTabs: React.FC<PlaylistTabsProps> = ({ query }) => {
  return (
    <Root
      defaultValue="my-playlists"
      orientation="horizontal"
      className={s.playlistTabs}
    >
      <List aria-label="tabs playlists" className={s.tabNavBar}>
        <Trigger value="my-playlists" className={s.tabHeader}>
          <Typography.H5>My Playlists</Typography.H5>
        </Trigger>
        <Trigger value="shared-playlists" className={s.tabHeader}>
          <Typography.H5>Shared with you</Typography.H5>
        </Trigger>
        <Trigger value="boclips-playlists" className={s.tabHeader}>
          <Typography.H5>Boclips Featured</Typography.H5>
        </Trigger>
      </List>
      <PlaylistTab
        value="my-playlists"
        query={query}
        getPlaylistsQuery={useOwnPlaylistsQuery}
        type="mine"
      />
      <PlaylistTab
        value="shared-playlists"
        query={query}
        getPlaylistsQuery={useSavedPlaylistsQuery}
        type="shared"
      />
      <PlaylistTab
        query={query}
        value="boclips-playlists"
        getPlaylistsQuery={useBoclipsPlaylistsQuery}
        type="boclips"
      />
    </Root>
  );
};
