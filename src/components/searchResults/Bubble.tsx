import c from 'classnames';
import React from 'react';
import { Facet } from 'boclips-api-client/dist/sub-clients/videos/model/VideoFacets';

interface Props {
  topic: Facet;
  handleClick: () => void;
  selected: boolean;
}

export const Bubble = ({ handleClick, selected, topic }: Props) => {
  return (
    <button
      type="button"
      data-qa="search-topic"
      onClick={() => handleClick()}
      className={c(
        'rounded-full active:rounded-full focus:rounded-full inline-block py-1 px-4 mx-1 mt-1 border-2 border-gray-400 px-3 hover:cursor-pointer',
        { 'bg-gray-600 border-gray-600': selected },
      )}
    >
      {topic.name}
    </button>
  );
};
