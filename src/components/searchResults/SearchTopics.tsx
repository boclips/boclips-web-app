import React from 'react';
import { Facet } from 'boclips-api-client/dist/sub-clients/videos/model/VideoFacets';
import { useSearchQueryLocationParams } from '@src/hooks/useLocationParams';
import { Bubble } from '@src/components/searchResults/Bubble';
import { FilterKey } from '@src/types/search/FilterKey';

interface Props {
  topics: Facet[];
  handleFilterChange: (key: FilterKey, value: string[]) => void;
  maxVisibleTopics?: number;
}

interface TopicWithSelection {
  topic: Facet;
  selected: boolean;
}

export const SearchTopics = ({
  topics,
  handleFilterChange,
  maxVisibleTopics = 12,
}: Props) => {
  const [searchLocation] = useSearchQueryLocationParams();

  const handleClick = (topic: string) => {
    if (searchLocation.filters.topics.indexOf(topic) > -1) {
      handleFilterChange(
        'topics',
        searchLocation.filters.topics.filter((it) => it !== topic),
      );
    } else {
      handleFilterChange('topics', [...searchLocation.filters.topics, topic]);
    }
  };

  const topicsToDisplay = (): TopicWithSelection[] => {
    const selectedTopics = searchLocation.filters.topics.map(
      (selectedTopicId) => {
        return {
          selected: true,
          topic: topics.find((topic) => topic.id === selectedTopicId) ?? {
            name: atob(selectedTopicId),
            id: selectedTopicId,
            hits: 0,
          },
        };
      },
    );

    const notSelectedTopics = topics
      .filter((topic) => !isTopicSelected(topic.id))
      .sort((topicA, topicB) => topicB.score - topicA.score)
      .map((topic) => {
        return { selected: false, topic };
      });

    return [...selectedTopics, ...notSelectedTopics].slice(0, maxVisibleTopics);
  };

  const isTopicSelected = (topicId: string) =>
    searchLocation.filters.topics.indexOf(topicId) > -1;

  return (
    topics.length > 0 && (
      <div className="col-start-8 col-end-26 row-start-2 row-end-3">
        {topicsToDisplay().map((it) => {
          return (
            <Bubble
              key={it.topic.id}
              topic={it.topic}
              handleClick={() => handleClick(it.topic.id)}
              selected={it.selected}
            />
          );
        })}
      </div>
    )
  );
};
