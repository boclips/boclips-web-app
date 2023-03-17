import React from 'react';
import c from 'classnames';
import { TypesMenuProps } from 'src/components/sparks/providerPage/providerPageMenu/TypesMenu';
import s from './style.module.less';

const TypeMenuItem = ({
  types,
  currentType,
  onClick,
}: Omit<TypesMenuProps, 'isLoading'>) => {
  return (
    <>
      {types?.map((type) => (
        <li key={type}>
          <button
            key={type}
            type="button"
            aria-label={`type ${type}`}
            onClick={() => onClick(type)}
            name={type}
            className={c(
              s.type,
              `text-base shrink-0 hover:text-blue-800 hover:font-medium focus:text-blue-800 focus:font-medium`,
              {
                [`${s.active} text-blue-800 font-medium`]: currentType === type,
              },
            )}
          >
            {type}
          </button>
        </li>
      ))}
    </>
  );
};

export default TypeMenuItem;
