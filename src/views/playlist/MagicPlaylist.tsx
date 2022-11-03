import React, { useEffect, useRef, useState } from 'react';
import Navbar from 'src/components/layout/Navbar';
import { Layout } from 'src/components/layout/Layout';
import Footer from 'src/components/layout/Footer';
import { DrawerManageComment } from 'src/components/slidingDrawer/DrawerManageComment';
import c from 'classnames';
import { useMagicPlaylistContext } from 'src/components/common/providers/MagicPlaylistProvider';
import DrawerVideoSearch from 'src/components/slidingDrawer/DrawerVideoSearch';
import SlidingDrawer from 'src/components/slidingDrawer/SlidingDrawer';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { MagicPlaylistVideoCard } from 'src/components/playlists/magic/MagicPlaylistVideoCard';
import DrawerVideoRecommendations from 'src/components/slidingDrawer/DrawerVideoRecommendations';
import { MagicCommentCard } from 'src/components/playlists/magic/MagicCommentCard';
import { MagicSectionCard } from 'src/components/playlists/magic/MagicSectionCard';
import { DrawerManageSection } from 'src/components/slidingDrawer/DrawerManageSection';
import PlusSVG from 'resources/icons/plus-sign.svg';
import s from './style.module.less';

function isElementOutViewport(el) {
  const rect = el.getBoundingClientRect();
  const main = document.querySelector('main').getBoundingClientRect();

  return rect.right > main.right;
}

const PlaylistView = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [outOfViewport, setOutOfViewport] = useState(false);
  const panelRef = useRef();
  const { state, dispatch } = useMagicPlaylistContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddSectionDrawerOpen, setIsAddSectionDrawerOpen] = useState(false);
  const [isAddCommentDrawerOpen, setIsAddCommentDrawerOpen] = useState(false);

  useEffect(() => {
    if (panelRef.current) {
      const isOutViewport = isElementOutViewport(panelRef.current);
      setOutOfViewport(isOutViewport);
    }
  }, [isAddOpen]);

  const addSection = () => {
    setIsAddOpen(false);
    setIsAddSectionDrawerOpen(true);
  };

  const addVideo = () => {
    setIsAddOpen(false);
    setIsDrawerOpen(true);
  };

  const videoAdded = (video: Video) => {
    dispatch({
      action: 'add-video',
      video,
    });
    setIsDrawerOpen(false);
  };

  const addComment = () => {
    setIsAddOpen(false);
    setIsAddCommentDrawerOpen(true);
  };

  const videosAddedThusFar: () => Video[] = () => {
    return state
      .filter((it) => it.type === 'video')
      .map((it) => it.video as Video);
  };

  function allowDrop(ev) {
    ev.preventDefault();
  }

  function drag(e) {
    // console.log(e);
    // console.log('drag', e.currentTarget, e.target);
    document.querySelectorAll(`.${s.item}`).forEach((it) => {
      it.classList.add(s.hide);
    });
    e.dataTransfer.setData('from', e.target.id);
  }

  function drop(e) {
    e.preventDefault();
    // console.log('drag other', e.target);
    const data = e.dataTransfer.getData('from');

    // console.log(e.target);

    dispatch({
      action: 'reorder',
      from: data,
      to: e.target.id,
    });

    document.querySelectorAll(`.${s.item}`).forEach((it) => {
      it.classList.remove(s.hide);
    });

    // ev.target.appendChild(document.getElementById(data));
  }

  return (
    <Layout rowsSetup="grid-rows-playlist-view" responsiveLayout>
      <Navbar />
      <main className={s.gridWrapper}>
        {state.map((it) => {
          switch (it.type) {
            case 'section': {
              console.log(it);
              return (
                <div
                  className={c(s.fullWidth, s.item, s.section)}
                  onDrop={drop}
                  onDragOver={allowDrop}
                  className={s.fullWidth}
                >
                  <div
                    onDragStart={drag}
                    className={c(s.item, s.section)}
                    draggable
                    id={it.uuid}
                  >
                    <MagicSectionCard
                      text={it.text as string}
                      visualComponentId={it.uuid as string}
                    />
                  </div>
                </div>
              );
            }
            case 'comment': {
              return (
                <div onDrop={drop} onDragOver={allowDrop}>
                  <div
                    draggable
                    id={it.uuid}
                    onDragStart={drag}
                    className={c(s.item, s.box)}
                  >
                    <MagicCommentCard
                      text={it.text as string}
                      visualComponentId={it.uuid as string}
                    />
                  </div>
                </div>
              );
            }
            case 'video': {
              return (
                <div onDrop={drop} onDragOver={allowDrop}>
                  <div
                    onDragStart={drag}
                    draggable
                    id={it.uuid}
                    className={c(s.item, s.box)}
                  >
                    <MagicPlaylistVideoCard
                      id={it.uuid}
                      video={it.video as Video}
                    />
                  </div>
                </div>
              );
            }
            default:
              return null;
          }
        })}
        <div className={c(s.add)}>
          <button
            className={s.button}
            type="button"
            onClick={() => {
              setIsAddOpen(!isAddOpen);
              setOutOfViewport(false);
            }}
          >
            <PlusSVG />
          </button>
          {isAddOpen && (
            <ul
              className={c({
                [s.outOfViewport]: outOfViewport,
              })}
              ref={panelRef}
            >
              <li>
                <button onClick={addSection} type="button">
                  <PlusSVG />
                  section
                </button>
              </li>
              <li>
                <button onClick={addVideo} type="button">
                  <PlusSVG />
                  video
                </button>
              </li>
              <li>
                <button onClick={addComment} type="button">
                  <PlusSVG />
                  comment
                </button>
              </li>
            </ul>
          )}
        </div>
      </main>
      <SlidingDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <DrawerVideoSearch onVideoAdded={videoAdded} />
        <DrawerVideoRecommendations
          videosAddedThusFar={videosAddedThusFar()}
          onVideoAdded={videoAdded}
        />
      </SlidingDrawer>

      <SlidingDrawer
        isOpen={isAddSectionDrawerOpen}
        onClose={() => setIsAddSectionDrawerOpen(false)}
      >
        <DrawerManageSection
          onSectionCreated={() => setIsAddSectionDrawerOpen(false)}
        />
      </SlidingDrawer>

      <SlidingDrawer
        isOpen={isAddCommentDrawerOpen}
        onClose={() => setIsAddCommentDrawerOpen(false)}
      >
        <DrawerManageComment
          onSectionCreated={() => setIsAddCommentDrawerOpen(false)}
        />
      </SlidingDrawer>
      <Footer columnPosition="col-start-2 col-end-26" />
    </Layout>
  );
};

export default PlaylistView;
