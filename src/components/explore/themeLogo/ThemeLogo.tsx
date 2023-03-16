import React from 'react';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import c from 'classnames';
import { useAlignmentProvider } from 'src/components/common/providers/AlignmentContextProvider';
import s from './style.module.less';

interface Props {
  theme: OpenstaxBook;
  className?: string;
}

export const ThemeLogo = ({ theme, className }: Props) => {
  const provider = useAlignmentProvider();

  return (
    <div className={c(s.img, className)}>
      {theme.logoUrl.length > 0 ? (
        <img src={theme.logoUrl} alt={`${theme.title} cover`} />
      ) : (
        <img
          src={provider.themeDefaultLogoUrl}
          alt={`${theme.title} generic cover`}
        />
      )}
    </div>
  );
};
