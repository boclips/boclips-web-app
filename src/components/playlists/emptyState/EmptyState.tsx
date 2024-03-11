import React from 'react';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import EmptyStateClassroomSVG from 'resources/icons/emptyPlaylistClassroom.svg';
import EmptyStateLibrarySVG from 'resources/icons/emptyPlaylistLibrary.svg';
import { Typography } from '@boclips-ui/typography';
import c from 'classnames';
import CreateNewPlaylistButton from 'src/components/playlists/buttons/CreateNewPlaylistButton';
import s from './style.module.less';

interface Props {
  playlistType: 'mine' | 'shared' | 'boclips';
}

const EmptyStatePlaylist = ({ playlistType }: Props) => {
  const { data: user } = useGetUserQuery();
  const getPlaylistCopy = {
    mine: {
      description: 'You can see playlists here once you create some.',
      button: <CreateNewPlaylistButton />,
    },
    shared: {
      description:
        'You will see playlists here once they have been shared with you.',
      button: null,
    },
  };

  return (
    <main
      tabIndex={-1}
      className={`${s.heroWrapper} text-blue-800 flex flex-row justify-center`}
    >
      <section className={`${s.svgWrapper} flex justify-center items-center`}>
        {user?.account?.products?.includes(Product.CLASSROOM) ? (
          <EmptyStateClassroomSVG />
        ) : (
          <EmptyStateLibrarySVG />
        )}
      </section>
      <section className={c(s.heroCopyWrapper, 'flex flex-col justify-center')}>
        <Typography.H1 size="lg" className="text-gray-900 mb-6">
          No Playlists here yet.
        </Typography.H1>
        <Typography.Body as="p" className="text-gray-800" data-qa="description">
          {getPlaylistCopy[playlistType]?.description}
        </Typography.Body>

        <div className="mt-8 flex flex-row items-center">
          {getPlaylistCopy[playlistType]?.button}
        </div>
      </section>
    </main>
  );
};
export default EmptyStatePlaylist;
