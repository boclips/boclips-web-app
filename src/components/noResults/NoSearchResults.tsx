import React from 'react';
import NoResultsIcon from '../../resources/icons/no-search-results.svg';

interface Props {
  areFiltersApplied: boolean;
  query: string;
}

const NoResultsCopy = ({ header, copy }) => {
  return (
    <>
      <div className="font-medium">{header}</div>
      <div>{copy}</div>
    </>
  );
};

export const NoSearchResults = ({ areFiltersApplied, query }: Props) => {
  return (
    <main className="flex flex-col items-center col-start-8 col-end-26 text-lg text-gray-800 mt-10 ">
      <NoResultsIcon className="h-80 w-80 mb-6" />
      {areFiltersApplied ? (
        <NoResultsCopy
          header={`We couldn’t find any videos for “${query}” with your filter selection`}
          copy="Try again using different keywords or change the filters"
        />
      ) : (
        <NoResultsCopy
          header={`We couldn’t find any videos for “${query}”`}
          copy="Please check the spelling or try searching something else"
        />
      )}
    </main>
  );
};
