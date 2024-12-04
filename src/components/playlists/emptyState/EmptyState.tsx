import React, { ReactElement } from 'react';
import { useGetUserQuery } from '@src/hooks/api/userQuery';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import EmptyStateClassroomSVG from '@resources/icons/emptyPlaylistClassroom.svg';
import EmptyStateLibrarySVG from '@resources/icons/emptyPlaylistLibrary.svg';
import { Button, Typography } from 'boclips-ui';
import c from 'classnames';
import CreateNewPlaylistButton from '@src/components/playlists/buttons/createPlaylist/CreateNewPlaylistButton';
import PlusSign from '@resources/icons/plus-sign.svg';
import { useNavigate } from 'react-router-dom';
import s from './style.module.less';

interface EmptyStateProps {
  text: string;
  description?: string;
  button?: ReactElement;
  dataQa?: string;
}

const EmptyState = ({ text, description, button, dataQa }: EmptyStateProps) => {
  const { data: user } = useGetUserQuery();

  return (
    <main
      tabIndex={-1}
      className={`${s.heroWrapper} text-blue-800 flex flex-row justify-center`}
      data-qa={dataQa}
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
          {text}
        </Typography.H1>
        <Typography.Body as="p" className="text-gray-800" data-qa="description">
          {description}
        </Typography.Body>

        <div className="mt-8 flex flex-row items-center">{button}</div>
      </section>
    </main>
  );
};

interface PlaylistEmptyStateProps {
  playlistType: 'mine' | 'shared' | 'boclips';
}

const PlaylistEmptyState = ({ playlistType }: PlaylistEmptyStateProps) => {
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
    <EmptyState
      text="No playlists here yet."
      description={getPlaylistCopy[playlistType]?.description}
      button={getPlaylistCopy[playlistType]?.button}
    />
  );
};

const PlaylistBodyEmptyState = () => {
  const navigate = useNavigate();

  return (
    <EmptyState
      dataQa="playlist-empty-state"
      text="No videos here yet."
      description="You can see videos here once you add some."
      button={
        <Button
          icon={<PlusSign />}
          text="Add videos"
          onClick={() => navigate('/videos')}
          height="48px"
          className="max-w-max"
        />
      }
    />
  );
};

export { PlaylistEmptyState, PlaylistBodyEmptyState };
