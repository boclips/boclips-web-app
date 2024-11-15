import React, { useState } from 'react';
import { FilterHeader } from '@src/components/filterPanel/filter/FilterHeader';

interface Props {
  title: string;
  children: React.ReactNode;
  handleFilterToggle?: (isOpen: boolean) => void;
  showExplanation?: boolean;
}

export const CollapsableFilter = ({
  title,
  children,
  handleFilterToggle,
  showExplanation,
}: Props) => {
  const [open, setOpen] = useState<boolean>(true);

  const toggleFilter = () => {
    setOpen(!open);
    if (handleFilterToggle) {
      handleFilterToggle(!open);
    }
  };

  const ariaId = title.split(' ').join('-').toLowerCase();

  return (
    <div className="bg-blue-100 mt-6 py-4 rounded">
      <FilterHeader
        ariaId={ariaId}
        text={title}
        filterIsOpen={open}
        toggleFilter={toggleFilter}
        showExplanation={showExplanation}
      />
      {open && <div id={ariaId}>{children}</div>}
    </div>
  );
};
