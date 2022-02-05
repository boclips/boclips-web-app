import React, { useState } from 'react';
import { FilterHeader } from 'src/components/filterPanel/filter/FilterHeader';

interface Props {
  title: string;
  children: React.ReactNode;
  handleFilterToggle?: (isOpen: boolean) => void;
}

export const CollapsableFilter = ({
  title,
  children,
  handleFilterToggle,
}: Props) => {
  const [open, setOpen] = useState<boolean>(true);

  const toggleFilter = () => {
    setOpen(!open);
    if (handleFilterToggle) {
      handleFilterToggle(!open);
    }
  };

  return (
    <div className="bg-blue-100 mt-6 py-4 border-solid border border-blue-300 rounded">
      <FilterHeader
        text={title}
        filterIsOpen={open}
        toggleFilter={toggleFilter}
      />
      {open && <>{children}</>}
    </div>
  );
};
