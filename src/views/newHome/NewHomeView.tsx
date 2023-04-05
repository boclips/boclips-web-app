import React from 'react';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import { Search } from 'src/components/searchBar/SearchBar';
import Button from '@boclips-ui/button';
import HomeSearchHero from 'src/resources/icons/home-illustration.svg';
import { useNavigate } from 'react-router-dom';
import NewNavbar from 'src/components/layout/NewNavbar';
import FilmIcon from '../../resources/icons/film-icon.svg';
import YourLibraryIcon from '../../resources/icons/your-library.svg';
import s from './style.module.less';

const NewHomeView = () => {
  const navigate = useNavigate();

  const videoIds = [
    '5c9e4945cbe6e54027116f7c',
    '5c9e4870cbe6e54027116ee0',
    '5c9e483dcbe6e54027116eb0',
    '5c9e4824cbe6e54027116e9b',
    '5c9e4874cbe6e54027116ee4',
    '5c9e4b63cbe6e54027117040',
    '5c9e4947cbe6e54027116f7e',
    '5c9e4934cbe6e54027116f6b',
    '5c9e493acbe6e54027116f71',
    '5c9e4948cbe6e54027116f7f',
    '5c9e4907cbe6e54027116f3f',
    '5c9e4940cbe6e54027116f77',
    '5c9e488ecbe6e54027116efd',
    '5c9e4817cbe6e54027116e8e',
    '5c9e47e8cbe6e54027116e60',
    '5c9e4826cbe6e54027116e9d',
    '5c9e490bcbe6e54027116f43',
    '5c9e4871cbe6e54027116ee1',
    '5c9e4b55cbe6e5402711703c',
    '5c9e4b54cbe6e5402711703b',
    '5c9e493ccbe6e54027116f73',
    '5c9e4955cbe6e54027116f8c',
    '5c9e4886cbe6e54027116ef5',
    '5c9e488dcbe6e54027116efc',
    '5c9e491acbe6e54027116f52',
    '5c9e4964cbe6e54027116f9a',
    '5c9e47f0cbe6e54027116e68',
    '5c9e4959cbe6e54027116f90',
    '5c9e485bcbe6e54027116ecd',
    '5c9e4855cbe6e54027116ec7',
    '5c9e492dcbe6e54027116f65',
    '5c9e4915cbe6e54027116f4d',
    '5c9e4805cbe6e54027116e7c',
    '5c9e4832cbe6e54027116ea6',
    '5c9e4816cbe6e54027116e8d',
    '5c9e486fcbe6e54027116edf',
    '5c9e4899cbe6e54027116f07',
    '5c9e3f16cbe6e54027116cf1',
    '5c9e4864cbe6e54027116ed5',
    '5c9e4917cbe6e54027116f4f',
    '5c9e47facbe6e54027116e71',
    '5c9e494acbe6e54027116f81',
    '5c9e4835cbe6e54027116ea9',
    '5c9e4878cbe6e54027116ee8',
    '5c9e485ecbe6e54027116ed0',
    '5c9e47dacbe6e54027116e52',
    '5c9e575bcbe6e5402711706c',
    '5c9e487ecbe6e54027116eee',
    '5c9e482acbe6e54027116ea1',
    '5c9e47d4cbe6e54027116e4c',
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
      <Footer className="col-start-2 col-end-26" />
    </Layout>
  );
};

export default NewHomeView;
