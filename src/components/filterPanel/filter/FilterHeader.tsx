import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { handleEnterKeyEvent } from 'src/services/handleKeyEvent';
import FilterArrow from '../../../resources/icons/blue-arrow.svg';

interface Props {
  text: string;
  filterIsOpen: boolean;
  toggleFilter: () => void;
}

export const FilterHeader = ({ text, filterIsOpen, toggleFilter }: Props) => {
  return (
    <button
      type="button"
      className="px-4 text-gray-800 flex items-center cursor-pointer active:border-none justify-between w-full"
      aria-expanded={filterIsOpen}
      aria-controls={`${text.replace(' ', '')}-filter`}
      aria-label={`${text} filter panel`}
      onClick={toggleFilter}
      onKeyPress={(event) => handleEnterKeyEvent(event, toggleFilter)}
    >
      <Typography.Body weight="medium">{text}</Typography.Body>
      <FilterArrow
        className={`${filterIsOpen ? 'transform rotate-180' : ''}`}
      />
    </button>
  );
};
