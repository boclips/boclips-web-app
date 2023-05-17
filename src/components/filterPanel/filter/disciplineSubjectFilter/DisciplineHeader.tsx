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
      className="pl-4 mt-2 text-sm font-medium text-gray-700 flex items-center"
      onClick={onClick}
      aria-label={name}
      aria-expanded={isOpen}
    >
      <FilterArrow className={`mr-2 ${isOpen ? 'transform rotate-180' : ''}`} />
      {name}
    </button>
  );
};
