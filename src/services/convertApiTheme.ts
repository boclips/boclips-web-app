import {
  OpenstaxBook,
  OpenstaxChapter,
  OpenstaxChapterIntro,
  OpenstaxSection,
} from 'src/types/OpenstaxBook';
import {
  Target,
  Theme,
  Topic,
} from 'boclips-api-client/dist/sub-clients/alignments/model/Theme';

const CHAPTER_OVERVIEW = 'Chapter Overview';
const DISCUSSION_PROMPT = 'Discussion Prompt';

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
    chapterOverview: getChapterOverview(apiTopic),
    discussionPrompt: getDiscussionPrompt(apiTopic),
    targets: getNumberedSections(apiTopic).map((section) =>
      convertApiTarget(section),
    ),
    title: apiTopic.title,
    videoCount,
  };
};

function getNumberedSections(apiTopic: Topic) {
  const chapterIntros = [CHAPTER_OVERVIEW, DISCUSSION_PROMPT];
  return apiTopic.targets.filter(
    (target) => !chapterIntros.includes(target.title),
  );
}

const getChapterOverview = (apiTopic: Topic) =>
  getChapterIntro(apiTopic, CHAPTER_OVERVIEW);

const getDiscussionPrompt = (apiTopic: Topic) =>
  getChapterIntro(apiTopic, DISCUSSION_PROMPT);

function getChapterIntro(apiTopic: Topic, title: string) {
  let chapterIntro: OpenstaxChapterIntro;
  const section = apiTopic.targets.find((it) => it.title === title);
  if (section !== undefined) {
    chapterIntro = {
      title,
      videos: section.videos,
    };
  }
  return chapterIntro;
}
