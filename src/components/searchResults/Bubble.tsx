import c from 'classnames';
import React from 'react';
import { Facet } from 'boclips-api-client/dist/sub-clients/videos/model/VideoFacets';
import { Typography } from '@boclips-ui/typography';
import s from './styles.module.less';

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
      className={c(s.bubble, { [s.bubbleSelected]: selected })}
    >
      <Typography.Body>{topic.name}</Typography.Body>
    </button>
  );
};
