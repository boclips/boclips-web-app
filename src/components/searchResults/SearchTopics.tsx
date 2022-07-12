import React from 'react';
import { Facet } from 'boclips-api-client/dist/sub-clients/videos/model/VideoFacets';
import { useSearchQueryLocationParams } from 'src/hooks/useLocationParams';
import { Bubble } from 'src/components/searchResults/Bubble';
import { FilterKey } from 'src/types/search/FilterKey';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';

interface Props {
  topics: Facet[];
  handleFilterChange: (key: FilterKey, value: string[]) => void;
}
export const SearchTopics = ({ topics, handleFilterChange }: Props) => {
  const [searchLocation] = useSearchQueryLocationParams();

  const sendEvent = (topic: string) =>
    AnalyticsFactory.bucket().then((bucketService) =>
      bucketService.track('search_topic_selected', {
        topic: atob(topic),
      }),
    );

  const handleClick = (topic: string) => {
    if (searchLocation.filters.topics.indexOf(topic) > -1) {
      handleFilterChange(
        'topics',
        searchLocation.filters.topics.filter((it) => it !== topic),
      );
    } else {
      handleFilterChange('topics', [...searchLocation.filters.topics, topic]);
      sendEvent(topic);
    }
  };

  return (
    topics.length > 0 && (
      <div className="overflow-hidden h-20 mb-2">
        {searchLocation.filters.topics.map((selectedTopicId) => {
          const selectedTopic = topics.find(
            (topic) => topic.id === selectedTopicId,
          ) ?? { name: atob(selectedTopicId), id: selectedTopicId, hits: 0 };

          return (
            <Bubble
              selected
              handleClick={() => handleClick(selectedTopicId)}
              topic={selectedTopic}
            />
          );
        })}
        {topics
          .filter(
            (topic) => searchLocation.filters.topics.indexOf(topic.id) === -1,
          )
          .sort((topicA, topicB) => topicB.score - topicA.score)
          .map((topic) => (
            <Bubble
              topic={topic}
              handleClick={() => handleClick(topic.id)}
              selected={searchLocation.filters.topics.indexOf(topic.id) > -1}
            />
          ))}
      </div>
    )
  );
};
