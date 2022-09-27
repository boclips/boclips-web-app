import { Typography } from '@boclips-ui/typography';
import React from 'react';

interface Props {
  count: number;
  query: string;
}

export const SearchResultsSummary = ({ count, query }: Props) => {
  return (
    <Typography.Body className="text-gray-800 ml-1 pt-1" role="status">
      Showing <span data-qa="search-hits">{count}</span> videos
      {query?.length > 0 && ` for "${query}"`}
    </Typography.Body>
  );
};
