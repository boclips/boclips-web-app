import React from 'react';
import { NavigateToAssistantPrompt } from 'src/components/common/assistant/NavigateToAssistantPrompt';
import NoResultsIcon from '../../resources/icons/no-search-results.svg';
import s from './style.module.less';

interface Props {
  areFiltersApplied: boolean;
  query: string;
}

const NoResultsCopy = ({ header, copy }) => {
  return (
    <>
      <div className="font-medium">{header}</div>
      <div>
        <div className={s.noResultsCopy}>
          <NavigateToAssistantPrompt />
          <p>{copy}</p>
        </div>
      </div>
    </>
  );
};

export const NoSearchResults = ({ areFiltersApplied, query }: Props) => {
  return (
    <main
      tabIndex={-1}
      className="flex flex-col items-center col-start-8 col-end-26 text-lg text-gray-800 mt-10 "
    >
      <NoResultsIcon className="h-80 w-80 mb-6" />
      {areFiltersApplied ? (
        <NoResultsCopy
          header={`We couldn’t find any videos for “${query}” with your filter selection`}
          copy="Or try again using different keywords or change the filters"
        />
      ) : (
        <NoResultsCopy
          header={`We couldn’t find any videos for “${query}”`}
          copy="Or please check the spelling or try searching something else"
        />
      )}
    </main>
  );
};
