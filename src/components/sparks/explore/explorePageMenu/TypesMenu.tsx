import React from 'react';
import TypeMenuItem from 'src/components/sparks/explore/explorePageMenu/TypeMenuItem';
import s from './style.module.less';

export interface TypesMenuProps {
  types: string[];
  currentType: string;
  onClick: (subject: string) => void;
}

export const TypesMenu = ({ types, currentType, onClick }: TypesMenuProps) => {
  return (
    <main
      tabIndex={-1}
      className="col-start-2 col-end-26 grid-row-start-4 grid-row-end-4 mt-2"
    >
      <nav className={s.typeList}>
        <ul className="flex shrink-0">
          <TypeMenuItem
            types={types}
            currentType={currentType}
            onClick={onClick}
          />
        </ul>
      </nav>
    </main>
  );
};
