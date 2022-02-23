import { Typography } from '@boclips-ui/typography';
import React from 'react';

interface Props {
  count: number;
  query: string;
}

export const SearchResultsSummary = ({ count, query }: Props) => {
  return (
    <Typography.H4 className="text-lg text-gray-800 mb-4">
      Showing{' '}
      <span data-qa="search-hits" className="font-extrabold">
        {count}
      </span>{' '}
      videos for &quot;
      {query}
      &quot;
    </Typography.H4>
  );
};
