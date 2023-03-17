import React, { useEffect, useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { Typography } from '@boclips-ui/typography';
import ChevronDownIcon from 'src/resources/icons/chevron-down.svg';
import { getVideoCountLabel } from 'src/services/getVideoCountLabel';
import { HashLink } from 'react-router-hash-link';
import c from 'classnames';
import { useThemeMobileMenuContext } from 'src/components/common/providers/ThemeMobileMenuProvider';
import { useLocation } from 'react-router-dom';
import {
  firstTargetInfo,
  getSelectedTopic,
  targetInfo,
} from 'src/components/sparks/themePage/helpers/themeNavigationHelpers';
import { useAlignmentProvider } from 'src/components/common/providers/AlignmentContextProvider';
import {
  Theme,
  Topic,
} from 'boclips-api-client/dist/sub-clients/alignments/model/Theme';
import s from './style.module.less';

interface Props {
  theme: Theme;
}

const NavigationPanelBody = ({ theme }: Props) => {
  const location = useLocation();
  const provider = useAlignmentProvider();
  const [currentTargetLink, setCurrentTargetLink] = useState<string>('topic-0');

  const isSelectedTarget = (targetLink: string) =>
    currentTargetLink === targetLink;

  const [expandedTopics, setExpandedTopics] = useState(['topic-0']);

  const { setIsOpen } = useThemeMobileMenuContext();

  useEffect(() => {
    const newTargetLink = location.hash.replace('#', '');

    updateTableOfContent(newTargetLink);

    if (linksOnlyToTopic(newTargetLink)) {
      const firstTarget = firstTargetInfo(theme, newTargetLink);
      if (firstTarget !== undefined) {
        setCurrentTargetLink(firstTarget.id);
      }
    } else {
      setCurrentTargetLink(newTargetLink);
    }
  }, [location.hash]);

  const renderTargetLevelLabel = (label: string, targetLink: string) => (
    <HashLink
      key={targetLink}
      className={s.targetAnchor}
      onClick={() => {
        setIsOpen(false);
      }}
      scroll={() => {
        window.scrollTo({ top: 0 });
      }}
      to={{
        pathname: `/explore/${provider.navigationPath}/${theme.id}`,
        hash: targetLink,
      }}
    >
      <Typography.H3
        className={c(s.courseTitle, {
          [s.selectedSection]: isSelectedTarget(targetLink),
        })}
      >
        {label}
      </Typography.H3>
    </HashLink>
  );

  const updateTableOfContent = (newSelection: string) => {
    const topicIndex = getSelectedTopic(theme, newSelection)?.index;
    const topicToExpand = `topic-${topicIndex}`;

    setExpandedTopics([topicToExpand]);
    handleScrollInTableOfContent(topicIndex);
  };

  const handleScrollInTableOfContent = (topicIndex: number) => {
    const nav = document.getElementById('topic-nav');

    const height = [];

    for (let i = 1; i < topicIndex; i++) {
      const scroll = document.getElementById(
        `topic-${i + 1}-nav`,
      )?.offsetHeight;

      height.push(scroll);
    }

    nav.scrollTo(
      0,
      height.reduce((acc, i) => acc + i, 0),
    );
  };

  const linksOnlyToTopic = (newTargetLink) =>
    newTargetLink.split('-').length <= 2;

  const getTotalVideoCount = (topic: Topic) =>
    topic.targets
      .map((target) => target.videoIds.length)
      .reduce((a, b) => a + b);

  return (
    <nav
      className={s.tocContent}
      aria-label={`Table of contents of ${theme.title}`}
      id="topic-nav"
    >
      <Accordion.Root
        type="multiple"
        value={expandedTopics}
        onValueChange={setExpandedTopics}
      >
        {theme.topics.map((topic) => (
          <Accordion.Item
            value={`topic-${topic.index}`}
            key={`topic-${topic.index}`}
            className={s.tocItemWrapper}
          >
            <Accordion.Header
              className="pt-4"
              asChild
              aria-label={topic.title}
              id={`topic-${topic.index}-nav`}
            >
              <Accordion.Trigger
                aria-label={topic.title}
                className={s.accordionTrigger}
              >
                <Typography.H2 size="xs" className={s.tocItem}>
                  <span className={s.label}>{topic.title}</span>
                  <span className={s.icon}>
                    <ChevronDownIcon aria-hidden />
                  </span>
                </Typography.H2>
                <div className="text-gray-700 text-sm">
                  {getVideoCountLabel(getTotalVideoCount(topic))}
                </div>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              {topic.targets.map((target) =>
                renderTargetLevelLabel(
                  target.title,
                  targetInfo(topic, target).id,
                ),
              )}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </nav>
  );
};

export default NavigationPanelBody;
