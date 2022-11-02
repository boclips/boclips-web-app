import React, { useContext, useEffect, useRef, useState } from 'react';
import Navbar from 'src/components/layout/Navbar';
import { Layout } from 'src/components/layout/Layout';
import { Typography } from '@boclips-ui/typography';
import { Player } from 'boclips-player-react';
import Footer from 'src/components/layout/Footer';
import c from 'classnames';
import s from './style.module.less';
import { useMagicPlaylistContext } from 'src/components/common/providers/MagicPlaylistProvider';

function isElementOutViewport(el) {
  const rect = el.getBoundingClientRect();
  const main = document.querySelector('main').getBoundingClientRect();

  console.log(rect.right, main.right);

  return rect.right > main.right;
}

const PlaylistView = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [outOfViewport, setOutOfViewport] = useState(false);
  const panelRef = useRef();
  const { state, dispatch } = useMagicPlaylistContext();

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
    dispatch({
      action: 'add-video',
      id: '62a6ff6573f2db722e7de4be',
    });
    setIsAddOpen(false);
  };

  const addComment = () => {
    dispatch({
      action: 'add-comment',
      text: 'this is not a long comment',
    });
    setIsAddOpen(false);
  };

  return (
    <Layout rowsSetup="grid-rows-playlist-view" responsiveLayout>
      <Navbar />
      <main className={s.gridWrapper}>
        {state.map((it) => {
          switch (it.type) {
            case 'section': {
              console.log(it);
              return (
                <div className={c(s.fullWidth, s.item, s.section)}>
                  <Typography.H2>{it.text}</Typography.H2>
                </div>
              );
            }
            case 'comment': {
              return <div className={c(s.item, s.comment)}>{it.text}</div>;
            }
            case 'video': {
              return (
                <div className={c(s.item, s.comment)}>
                  <Player video={it.videoId} />
                </div>
              );
            }
            default:
              return null;
          }
        })}
        <div className={c(s.item, s.add)}>
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
      <Footer columnPosition="col-start-2 col-end-26" />
    </Layout>
  );
};

export default PlaylistView;
