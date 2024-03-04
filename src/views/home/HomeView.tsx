import React, { useState } from 'react';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import { Search } from 'src/components/searchBar/SearchBar';
import Button from '@boclips-ui/button';
import HomeSearchHero from 'src/resources/icons/home-illustration.svg';
import HomeSearchHeroClassroom from 'src/resources/icons/classroom/home-search-hero.svg';
import { useNavigate } from 'react-router-dom';
import NewNavbar from 'src/components/layout/Navbar';
import FeaturedPlaylists from 'src/components/featuredPlaylists/FeaturedPlaylists';
import FeaturedVideos from 'src/components/carousel/FeaturedVideos';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import { useEmailVerified } from 'src/hooks/useEmailVerified';
import useShowTrialWelcomeModal from 'src/hooks/useShowTrialWelcomeModal';
import WelcomeModal from 'src/components/welcome/WelcomeModal';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import FilmIcon from '../../resources/icons/film-icon.svg';
import YourLibraryIcon from '../../resources/icons/your-library.svg';
import s from './style.module.less';

const HomeView = () => {
  const navigate = useNavigate();
  const breakpoints = useMediaBreakPoint();
  const isMobileView =
    breakpoints.type === 'mobile' || breakpoints.type === 'tablet';
  const [showTrialPopUp, setShowTrialPopUp] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>();
  const [isClassroomUser, setIsClassroomUser] = useState<boolean>();

  useShowTrialWelcomeModal({
    showPopup: setShowTrialPopUp,
    setIsAdmin,
    setIsClassroomUser,
  });
  useEmailVerified();

  console.log(showTrialPopUp);
  return (
    <Layout rowsSetup="grid-rows-newHomepage" responsiveLayout>
      <NewNavbar showSearch={false} />
      {showTrialPopUp && (
        <WelcomeModal
          showPopup={setShowTrialPopUp}
          isAdmin={isAdmin}
          isClassroomUser={isClassroomUser}
        />
      )}
      <div
        data-qa="header-text"
        className="row-start-2 row-end-2 col-start-2 col-end-26 pb-3 lg:pb-0 lg:pt-0 lg:col-start-4 lg:col-end-13"
      >
        <h1 className={s.header}>
          Welcome to{' '}
          <FeatureGate
            product={Product.CLASSROOM}
            fallback={<span className={s.library}>Boclips Library</span>}
          >
            <span className={s.classroom}>Boclips Classroom</span>
          </FeatureGate>
        </h1>
        <Search showIconOnly={false} />
        <div className="mt-9 flex justify-between">
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
      {!isMobileView && (
        <div
          className="row-start-2 row-end-2 col-start-17 mt-14 w-96 h-96"
          data-qa="home-search-hero"
        >
          <FeatureGate
            product={Product.CLASSROOM}
            fallback={<HomeSearchHero />}
          >
            <div className={s.classroomHero}>
              <HomeSearchHeroClassroom />
            </div>
          </FeatureGate>
        </div>
      )}
      <div className="row-start-3 row-end-3 col-start-2 col-end-26">
        <FeaturedPlaylists />
      </div>
      <div className="row-start-4 row-end-4 col-start-2 col-end-26">
        <FeaturedVideos />
      </div>
      <Footer className="col-start-2 col-end-26" />
    </Layout>
  );
};

export default HomeView;
