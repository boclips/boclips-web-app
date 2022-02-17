import React from 'react';
import { handleEnterKeyDown } from 'src/services/handleEnterKeyDown';
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
      className="text-base px-4 text-blue-800 font-medium flex items-center cursor-pointer active:border-none justify-between w-full"
      aria-expanded={filterIsOpen}
      aria-controls={`${text}-filter`}
      onClick={toggleFilter}
      onKeyPress={(event) => handleEnterKeyDown(event, toggleFilter)}
    >
      <span>{text}</span>
      <FilterArrow
        className={`${filterIsOpen ? 'transform rotate-180' : ''}`}
      />
    </button>
  );
};
