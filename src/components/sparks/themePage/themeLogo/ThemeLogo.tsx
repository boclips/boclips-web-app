import React from 'react';
import c from 'classnames';
import { useAlignmentProvider } from 'src/components/common/providers/AlignmentContextProvider';
import { Theme } from 'boclips-api-client/dist/sub-clients/alignments/model/theme/Theme';
import s from './style.module.less';

interface Props {
  theme: Theme;
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
          src={provider.defaultThemeLogoUrl}
          alt={`${theme.title} generic cover`}
        />
      )}
    </div>
  );
};
