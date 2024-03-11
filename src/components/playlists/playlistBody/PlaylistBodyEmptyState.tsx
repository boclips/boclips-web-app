import React from 'react';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import EmptyStateClassroomSVG from 'resources/icons/emptyPlaylistClassroom.svg';
import EmptyStateLibrarySVG from 'resources/icons/emptyPlaylistLibrary.svg';
import { Typography } from '@boclips-ui/typography';
import c from 'classnames';
import Button from '@boclips-ui/button';
import PlusSign from 'src/resources/icons/plus-sign.svg';
import { useNavigate } from 'react-router-dom';
import s from './style.module.less';

const PlaylistBodyEmptyState = () => {
  const { data: user } = useGetUserQuery();
  const navigate = useNavigate();

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
          No Videos here yet.
        </Typography.H1>
        <Typography.Body as="p" className="text-gray-800" data-qa="description">
          You can see videos here once you add some.
        </Typography.Body>

        <div className="mt-8 flex flex-row items-center fill-white">
          <Button
            icon={<PlusSign />}
            text="Add some videos"
            onClick={() => navigate('/videos')}
            height="48px"
            className="max-w-max"
          />
        </div>
      </section>
    </main>
  );
};
export default PlaylistBodyEmptyState;
