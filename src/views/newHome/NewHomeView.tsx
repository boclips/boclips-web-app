import React from 'react';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import { Search } from 'src/components/searchBar/SearchBar';
import Button from '@boclips-ui/button';
import HomeSearchHero from 'src/resources/icons/home-illustration.svg';
import { useNavigate } from 'react-router-dom';
import NewNavbar from 'src/components/layout/NewNavbar';
import { FeaturedPlaylists } from 'src/components/playlists/PromotedPlaylists';
import { VideoCarousel } from 'src/components/carousel/VideoCarousel';
import FilmIcon from '../../resources/icons/film-icon.svg';
import YourLibraryIcon from '../../resources/icons/your-library.svg';
import s from './style.module.less';

const NewHomeView = () => {
  const navigate = useNavigate();

  const videoIds = [
    '5e145c0ebc67ab520cac9e91',
    '5c54d813d8eafeecae2114da',
    '5c54d80bd8eafeecae210fc7',
    '5d3055dde69e6810ae1141b3',
    '5c54d7b5d8eafeecae20e1a9',
    '5eeb5d12e18c7d5971253585',
    '5c54da74d8eafeecae22613f',
    '5e2726bbe78e114607caf371',
    '5eecb63353dd5552df7fb7ad',
    '5fec58c8a9043912467a0b8e',
    '627b42963f890d2245611a22',
    '63020b21d390ea774f8039d7',
    '5eecb5112041e37f2645a4f6',
    '6370f0124320c953bad79e60',
    '5f16b141e1b0492a380807aa',
    '61b22630c0410133751cc90e',
    '5c54da67d8eafeecae225aa7',
    '62bacd271c53ba2c2d0b5d62',
    '5c54da48d8eafeecae22496a',
    '5c54d5c7d8eafeecae1fe3b9',
  ];
  return (
    <Layout rowsSetup="grid-rows-newHomepage" responsiveLayout>
      <NewNavbar showSearch={false} />
      <div
        data-qa="header-text"
        className="row-start-2 row-end-2 col-start-2 col-end-26 pb-3 lg:pb-0 lg:pt-0 lg:col-start-4 lg:col-end-13"
      >
        <h1 className={s.header}>
          Welcome to <span className={s.coursespark}>CourseSpark!</span>
        </h1>
        <Search showIconOnly={false} />
        <div className="mt-12 flex justify-between">
          <Button
            width="48%"
            height="48px"
            onClick={() => navigate('/videos')}
            text="Browse All Videos"
            icon={<FilmIcon />}
          />
          <Button
            width="48%"
            height="48px"
            onClick={() => navigate('/playlists')}
            text="View My Playlists"
            icon={<YourLibraryIcon />}
          />
        </div>
      </div>
      <div className="row-start-2 row-end-2 col-start-17 mt-14 w-96 h-96">
        <HomeSearchHero />
      </div>
      <div className="row-start-3 row-end-3 col-start-2 col-end-26">
        <FeaturedPlaylists />
      </div>
      <div className="row-start-4 row-end-4 col-start-2 col-end-26">
        <VideoCarousel videoIds={videoIds} title="Featured Videos" />
      </div>
      <Footer className="col-start-2 col-end-26" />
    </Layout>
  );
};

export default NewHomeView;
