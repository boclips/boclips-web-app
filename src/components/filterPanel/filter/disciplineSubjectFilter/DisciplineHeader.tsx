import FilterArrow from 'src/resources/icons/blue-arrow.svg';
import React from 'react';

interface Props {
  name: string;
  onClick: () => void;
  isOpen: boolean;
}

export const DisciplineHeader = ({ name, onClick, isOpen }: Props) => {
  return (
    <button
      type="button"
      key={name}
      className="pl-4 pr-4 mt-2 text-sm font-medium text-gray-700 flex items-center justify-between w-full"
      onClick={onClick}
      aria-label={name}
      aria-expanded={isOpen}
    >
      {name}
      <FilterArrow className={`${isOpen ? 'transform rotate-180' : ''}`} />
    </button>
  );
};
