import {
  OpenstaxBook,
  OpenstaxChapter,
  OpenstaxSection,
} from 'src/types/OpenstaxBook';
import {
  Target,
  Theme,
  Topic,
} from 'boclips-api-client/dist/sub-clients/alignments/model/Theme';

export const convertApiTheme = (apiTheme: Theme): OpenstaxBook => {
  const openstaxBook = {
    id: apiTheme.id,
    videoCount: 0,
    type: apiTheme.type,
    title: apiTheme.title,
    topics: apiTheme.topics.map((topic) => convertApiTopic(topic)),
    logoUrl: apiTheme.logoUrl,
    provider: apiTheme.provider,
    links: apiTheme.links,
  };

  let videoCount = 0;
  openstaxBook.topics.forEach((chapter) => {
    videoCount += chapter.videoCount;
  });

  return {
    ...openstaxBook,
    videoCount,
  };
};

export const convertApiTarget = (apiTarget: Target): OpenstaxSection => {
  return {
    index: apiTarget.index,
    title: apiTarget.title,
    videoCount: apiTarget.videoIds.length,
    videoIds: apiTarget.videoIds,
    videos: apiTarget.videos,
  };
};

export const convertApiTopic = (apiTopic: Topic): OpenstaxChapter => {
  let videoCount = 0;
  apiTopic.targets.forEach((target) => {
    videoCount += target.videoIds?.length || 0;
  });

  return {
    index: apiTopic.index,
    targets: apiTopic.targets.map((target) => convertApiTarget(target)),
    title: apiTopic.title,
    videoCount,
  };
};
