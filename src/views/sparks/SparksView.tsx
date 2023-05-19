import React, { useEffect, useState } from 'react';
import Navbar from 'src/components/layout/Navbar';
import { Layout } from 'src/components/layout/Layout';
import Footer from 'src/components/layout/Footer';
import { SparksWidget } from 'src/components/sparks/widget/SparksWidget';
import { Typography } from '@boclips-ui/typography';
import SearchBar from '@boclips-ui/search-bar';
import Badge from '@boclips-ui/badge';
import GridCard from 'src/components/common/gridCard/GridCard';
import c from 'classnames';
import Button from '@boclips-ui/button';
import Arrow from 'resources/icons/blue-arrow.svg';
import Thumbnail from 'src/components/playlists/thumbnails/Thumbnail';
import s from './style.module.less';

const getData = (query: string) =>
  fetch(`http://localhost:3000/search?query=${query}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

const getVideos = (ids: string[]) =>
  fetch(`http://localhost:3000/videos?id=${ids}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

const Pocket = ({ bucket }) => {
  const isPocket = bucket.videos.length > 4; // true
  const [open, setOpen] = useState(false); // false

  return (
    <div
      className={c(s.pocketWrapper, {
        [s.open]: open,
        [s.isPocket]: isPocket,
      })}
    >
      <div className={s.pocketHeader}>
        <Typography.H3>{bucket.target.name}</Typography.H3>
      </div>
      <div className={s.pocketBreadCrumbs}>
        <Badge label={bucket.provider} />
        <Badge label={bucket.title.name} />
        <Badge label={bucket.type} />
        <Badge label={bucket.topic.name} />
      </div>
      <div className={c(s.pocketVideosWrapper, { [s.open]: open })}>
        <PocketVideos videosIds={bucket.videos} />
      </div>
      {isPocket && (
        <Button
          tabIndex={-1}
          className={s.pocketButton}
          onClick={() => setOpen(!open)}
          text={open ? 'show less' : 'show more'}
          suffix={open ? <Arrow className="rotate-180" /> : <Arrow />}
          height="auto"
        />
      )}
    </div>
  );
};

const PocketVideos = ({ videosIds }: any) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const tokenBB = async () => {
      const tokenResp = await getVideos(videosIds);
      const response = await tokenResp.json();
      setVideos(response.videos);
    };

    tokenBB();
  }, [videosIds]);

  return (
    <div className={s.pocketVideos}>
      {videos?.map((video) => {
        return (
          <GridCard
            key={video.id}
            link={`/videos/${video.id}`}
            name={video.title}
            header={<Thumbnail video={video} />}
          />
        );
      })}
    </div>
  );
};

const SparksView = () => {
  const [buckets, setBuckets] = useState<any>([]);
  const getBuckets = async (query) => {
    const hits = await getData(query);
    const response = await hits.json();
    setBuckets(response);
  };

  return (
    <Layout rowsSetup="grid-rows-sparks" responsiveLayout>
      <Navbar showSearch={false} />
      <SparksWidget />
      <div className="col-start-2 col-end-26 row-start-3 row-end-3">
        <div className={s.sparksSearchHeader}>
          <Typography.Body>
            ...or search though the sparks to find what you need!
          </Typography.Body>
        </div>
      </div>
      <div className="col-start-8 col-end-20 row-start-4 row-end-4">
        <div className="w-100">
          <SearchBar
            placeholder="pythagoras equation K-12"
            onSearch={getBuckets}
            iconOnlyButton={false}
            buttonText="Search"
          />
        </div>
      </div>
      <div className="col-start-2 col-end-26 row-start-5 row-end-5">
        {buckets?.map((it) => {
          return <Pocket key={it.id} bucket={it} />;
        })}
      </div>
      <Footer className="col-start-2 col-end-26" />;
    </Layout>
  );
};

export default SparksView;
