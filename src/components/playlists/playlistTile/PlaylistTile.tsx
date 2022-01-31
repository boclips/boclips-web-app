import React from 'react';
import { Link } from 'react-router-dom';
import { usePlaylistQuery } from 'src/hooks/api/playlistsQuery';
import { useFindOrGetVideo } from 'src/hooks/api/videoQuery';
import s from '../style.module.less';

interface Props {
  name: string;
  id: string;
}

const Thumbnail = ({ className, video }) => {
  const thumbnailUrl = video?.playback?.links?.thumbnail?.getOriginalLink();

  return thumbnailUrl ? (
    <div
      className={className}
      key={video.id}
      role="img"
      aria-label={`Thumbnail of ${video?.title}`}
      style={{
        background: `url(${thumbnailUrl}) center center`,
        backgroundSize: 'cover',
      }}
    />
  ) : (
    <div className={className} />
  );
};

const PlaylistTile = ({ name, id }: Props) => {
  const { data } = usePlaylistQuery(id);
  const firstVideoId = data?.videos[0]?.id;
  const secondVideoId = data?.videos[1]?.id;
  const thirdVideoId = data?.videos[2]?.id;

  const { data: firstVideo } = useFindOrGetVideo(firstVideoId);
  const { data: secondVideo } = useFindOrGetVideo(secondVideoId);
  const { data: thirdVideo } = useFindOrGetVideo(thirdVideoId);

  return (
    <Link
      to={{
        pathname: `/library/${id}`,
        state: { name },
      }}
      aria-label={`${name} playlist`}
      className={s.playlistTile}
    >
      <div className={s.thumbnailsContainer}>
        <Thumbnail
          className={`${s.thumbnail} ${s.defaultThumbnail} row-span-2 grid-cols-1`}
          video={firstVideo}
        />
        <Thumbnail
          className={`${s.thumbnail} ${s.defaultThumbnail} grid-rows-1 grid-cols-2`}
          video={secondVideo}
        />
        <Thumbnail
          className={`${s.thumbnail} ${s.defaultThumbnail} grid-rows-2 grid-cols-2`}
          video={thirdVideo}
        />
      </div>
      <div className={s.header}>{name}</div>
    </Link>
  );
};

export default PlaylistTile;
