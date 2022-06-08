import c from 'classnames';
import React from 'react';
import { Facet } from 'boclips-api-client/dist/sub-clients/videos/model/VideoFacets';
import { Typography } from '@boclips-ui/typography';

interface Props {
  topic: Facet;
  handleClick: () => void;
  selected: boolean;
}

export const Bubble = ({ handleClick, selected, topic }: Props) => {
  return (
    <button
      type="button"
      name={topic.name}
      data-qa="search-topic"
      onClick={() => handleClick()}
      className={c(
        'rounded-full active:rounded-full focus:rounded-full inline-block border-solid py-1 px-4 mx-1 mt-1 border-2 border-gray-400 px-3',
        { 'bg-gray-600 border-gray-600 text-white': selected },
      )}
    >
      <Typography.Body>{topic.name}</Typography.Body>
    </button>
  );
};
