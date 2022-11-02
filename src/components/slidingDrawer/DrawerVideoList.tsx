import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import c from 'classnames';
import s from 'src/components/slidingDrawer/DrawerVideoList.module.less';
import DrawerVideo from 'src/components/slidingDrawer/DrawerVideo';

interface Props {
  videos: Video[];
  onVideoAdded: (video: Video) => void;
}

const DrawerVideoList = ({ videos, onVideoAdded }: Props) => {
  return (
    <div className={c(s.drawerSearchResults)}>
      {videos.map((video, index) => (
        <span className="flex flex-col" key={index}>
          <DrawerVideo video={video} onAddPressed={onVideoAdded} />
        </span>
      ))}
    </div>
  );
};

export default DrawerVideoList;
