import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { useGetBooksQuery } from 'src/hooks/api/bookQuery';

export const ExploreView = () => {
  const { data: books } = useGetBooksQuery();
  const subjects = new Set(books?.map((book) => book.subject));
  return (
    <div>
      <Typography.H1>
        Our best content aligned to OpenStax courses
      </Typography.H1>
      <Typography.H2>
        Review videos hand-picked by our curators and decide if they are right
        for your course
      </Typography.H2>
      {Array.from(subjects).map((subject) => {
        return <div> {subject} </div>;
      })}
    </div>
  );
};
