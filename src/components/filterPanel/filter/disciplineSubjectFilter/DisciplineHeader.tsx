import FilterArrow from '@resources/icons/blue-arrow.svg?react';
import React from 'react';
import Bubble from '@components/playlists/comments/Bubble';

interface Props {
  name: string;
  onClick: () => void;
  isOpen: boolean;
  selectedSubjects?: number;
}

export const DisciplineHeader = ({
  name,
  onClick,
  isOpen,
  selectedSubjects,
}: Props) => {
  const subjectLabel = selectedSubjects > 1 ? 'subjects' : 'subject';

  return (
    <button
      type="button"
      key={name}
      className="pl-4 pr-4 mt-2 text-sm font-medium text-gray-700 flex items-center justify-between w-full"
      onClick={onClick}
      aria-label={name}
      aria-expanded={isOpen}
    >
      <div className="flex">
        {name}
        {selectedSubjects > 0 && (
          <Bubble
            inline
            number={selectedSubjects}
            ariaLabel={`${selectedSubjects} ${subjectLabel} selected under ${name}`}
          />
        )}
      </div>
      <FilterArrow className={`${isOpen ? 'transform rotate-180' : ''}`} />
    </button>
  );
};
