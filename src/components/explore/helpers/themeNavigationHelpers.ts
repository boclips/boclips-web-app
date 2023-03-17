import { TargetInfo } from 'src/components/explore/theme/TargetDetails';
import {
  Target,
  Theme,
  Topic,
} from 'boclips-api-client/dist/sub-clients/alignments/model/Theme';

const selectedTopicIndex = (locationHash: string): number => {
  const matchedTopicIndex = locationHash.match('topic-(\\d+)-*.*');
  return matchedTopicIndex ? Number(matchedTopicIndex[1]) : 0;
};

export const getSelectedTopic = (theme: Theme, targetLink: string): Topic => {
  const topicIndex = selectedTopicIndex(targetLink);
  const foundTopic = theme?.topics.find((topic) => topic.index === topicIndex);

  return foundTopic || theme.topics[0];
};

export const getSelectedTarget = (
  theme: Theme,
  targetLink: string,
): TargetInfo => {
  const topic = getSelectedTopic(theme, targetLink);
  if (topic === undefined) return undefined;

  const defaultTarget = defaultTargetInfo(topic);
  let matchingTarget;

  if (targetLink.match('topic-\\d+-target-\\d+$')) {
    const targetIndex = Number(targetLink.split('-')[3]);
    const foundTarget = topic.targets.find(
      (target) => target.index === targetIndex,
    );

    matchingTarget = targetInfo(topic, foundTarget);
  }

  return matchingTarget !== undefined ? matchingTarget : defaultTarget;
};

const defaultTargetInfo = (topic: Topic | null): TargetInfo => {
  if (topic?.targets && topic.targets.length !== 0) {
    return targetInfo(topic, topic.targets[0]);
  }

  return undefined;
};

export const firstTargetInfo = (
  theme: Theme,
  targetLink: string,
): TargetInfo => {
  const topic = getSelectedTopic(theme, targetLink);
  return defaultTargetInfo(topic);
};

export const targetInfo = (
  topic: Topic,
  target: Target | undefined,
): TargetInfo => {
  if (target === undefined) return undefined;

  return {
    id: `topic-${topic.index}-target-${target.index}`,
    title: target.title,
    videos: target.videos,
  };
};

export const getPreviousTargetInfo = (
  theme: Theme,
  targetLink: string,
): TargetInfo => getTargetInfo(theme, targetLink, -1);

export const getNextTargetInfo = (
  theme: Theme,
  targetLink: string,
): TargetInfo => getTargetInfo(theme, targetLink, +1);

const getTargetInfo = (theme: Theme, targetLink: string, offset: number) => {
  const selectedElement = getSelectedTarget(theme, targetLink);
  const allTargets = getAllTargetsInCurrentTopic(theme, targetLink);

  const index = allTargets.findIndex((it) => it.id === selectedElement.id);

  const effectiveIndex = ensureIndex(index + offset, allTargets);
  return allTargets[effectiveIndex];
};

const ensureIndex = (value: number, array: unknown[]) =>
  Math.min(Math.max(value, 0), array.length - 1);

export const getAllTargetsInTopic = (topic: Topic): TargetInfo[] => {
  if (!topic) return [];
  return topic.targets.map((it) => targetInfo(topic, it)).filter((it) => it);
};

export const getAllTargetsInCurrentTopic = (
  theme: Theme,
  targetLink: string,
): TargetInfo[] => {
  const topic = getSelectedTopic(theme, targetLink);
  if (topic === undefined) return [];

  return getAllTargetsInTopic(topic);
};

export const getNextTopicId = (theme: Theme, targetLink: string): string =>
  getTopicId(theme, targetLink, +1);

export const getPreviousTopicId = (theme: Theme, targetLink: string): string =>
  getTopicId(theme, targetLink, -1);

const getTopicId = (theme: Theme, targetLink: string, offset: number) => {
  const index = selectedTopicIndex(targetLink);
  const effectiveIndex = ensureIndex(index + offset, theme.topics);
  return `topic-${effectiveIndex}`;
};
