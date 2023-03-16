import React from 'react';
import TypeMenuItem from 'src/components/explore/menu/TypeMenuItem';
import TypeMenuItemSkeleton from 'src/components/explore/menu/TypeMenuItemSkeleton';
import s from './style.module.less';

export interface TypesMenuProps {
  types: string[];
  currentType: string;
  onClick: (subject: string) => void;
  isLoading: boolean;
}

export const TypesMenu = ({
  types,
  currentType,
  onClick,
  isLoading,
}: TypesMenuProps) => {
  return (
    <main
      tabIndex={-1}
      className="col-start-2 col-end-26 grid-row-start-4 grid-row-end-4 mt-2"
    >
      <nav className={s.typeList}>
        <ul className="flex shrink-0">
          {isLoading ? (
            <TypeMenuItemSkeleton />
          ) : (
            <TypeMenuItem
              types={types}
              currentType={currentType}
              onClick={onClick}
            />
          )}
        </ul>
      </nav>
    </main>
  );
};
