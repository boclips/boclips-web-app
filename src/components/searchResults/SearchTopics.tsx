import React from 'react';
import { Facet } from 'boclips-api-client/dist/sub-clients/videos/model/VideoFacets';

interface Props {
  topics: Facet[];
}
export const SearchTopics = ({ topics }: Props) => (
  <div className="overflow-hidden h-20 mb-2">
    {topics
      .sort((topicA, topicB) => topicB.score - topicA.score)
      .map((topic) => (
        <span
          data-qa="search-topic"
          className="rounded-full inline-block py-1 px-4 mx-1 mt-1 border-2 border-gray-400 px-3 hover:cursor-pointer"
        >
          {topic.name}
        </span>
      ))}
  </div>
);
