import React from 'react';
import { getFacetSorter } from '@src/services/sortFacets';
import { SortBy } from '@src/types/SortBy';
import { FilterOption } from '@src/types/FilterOption';

export const sortFilterOptions = (
  options: FilterOption[],
  sortBy: SortBy = 'SORT_BY_HITS_AND_NAME',
): FilterOption[] => options?.sort(getFacetSorter(sortBy));

export const searchFilterOptions = (
  options: FilterOption[],
  searchText?: string,
  sortBy: SortBy = 'SORT_BY_HITS_AND_NAME',
): FilterOption[] =>
  options.sort(getFacetSorter(sortBy)).reduce((acc, option) => {
    if (!searchText) {
      acc.push(option);
    } else if (option.name.toLowerCase().includes(searchText.toLowerCase())) {
      const filterOption: FilterOption = {
        ...option,
        label: boldMatchingText(option.name, searchText),
      };

      acc.push(filterOption);
    }
    return acc;
  }, []);

const boldMatchingText = (fullText, textToBold) => {
  const textArray = fullText.split(new RegExp(`(${textToBold})`, 'i'));

  const textArrayWithUniqueIds = textArray.map((arrayItem, index) => {
    return {
      id: index,
      text: arrayItem,
    };
  });
  return (
    <>
      {textArrayWithUniqueIds.map((item) => {
        return (
          <React.Fragment key={`${item.id}-${item.text}`}>
            {item.text.toLowerCase() === textToBold.toLowerCase() ? (
              <span className="font-medium">{item.text}</span>
            ) : (
              item.text
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};
