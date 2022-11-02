import React, { useEffect, useRef, useState } from 'react';
import Navbar from 'src/components/layout/Navbar';
import { Layout } from 'src/components/layout/Layout';
import { Typography } from '@boclips-ui/typography';
import Footer from 'src/components/layout/Footer';
import c from 'classnames';
import { useMagicPlaylistContext } from 'src/components/common/providers/MagicPlaylistProvider';
import DrawerVideoSearch from 'src/components/slidingDrawer/DrawerVideoSearch';
import SlidingDrawer from 'src/components/slidingDrawer/SlidingDrawer';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { MagicPlaylistVideoCard } from 'src/components/playlists/magic/MagicPlaylistVideoCard';
import DrawerVideoRecommendations from 'src/components/slidingDrawer/DrawerVideoRecommendations';
import { MagicCommentCard } from 'src/components/playlists/magic/MagicCommentCard';
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
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    if (panelRef.current) {
      const isOutViewport = isElementOutViewport(panelRef.current);
      setOutOfViewport(isOutViewport);
    }
  }, [isAddOpen]);

  const addSection = () => {
    dispatch({
      action: 'add-section',
      text: 'this is a section',
    });

    setIsAddOpen(false);
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
    dispatch({
      action: 'add-comment',
      text: 'this is not a long comment',
    });
    setIsAddOpen(false);
  };

  const videosAddedThusFar: () => Video[] = () => {
    return state
      .filter((it) => it.type === 'video')
      .map((it) => it.video as Video);
  };

  function allowDrop(ev) {
    ev.preventDefault();
  }

  const [dragged, setDragged] = useState();

  function drag(e) {
    // console.log(e);
    // console.log('drag', e.currentTarget, e.target);
    document.querySelectorAll(`.${s.item}`).forEach((it) => {
      it.classList.add(s.hide);
    });
    setDragged(e.target.id);
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
                    <Typography.H2>{it.text as string}</Typography.H2>
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
            type="button"
            onClick={() => {
              setIsAddOpen(!isAddOpen);
              setOutOfViewport(false);
            }}
          >
            +
          </button>
          {isAddOpen && (
            <ul
              className={c({
                [s.outOfViewport]: outOfViewport,
              })}
              ref={panelRef}
            >
              <button onClick={addSection} type="button">
                add section
              </button>
              <button onClick={addVideo} type="button">
                add video
              </button>
              <button onClick={addComment} type="button">
                add comment
              </button>
            </ul>
          )}
        </div>
      </main>
      <SlidingDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <DrawerVideoSearch onVideoAdded={videoAdded} />
        <DrawerVideoRecommendations videosAddedThusFar={videosAddedThusFar()} />
      </SlidingDrawer>
      <Footer columnPosition="col-start-2 col-end-26" />
    </Layout>
  );
};

export default PlaylistView;
