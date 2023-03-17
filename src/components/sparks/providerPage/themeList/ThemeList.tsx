import React from 'react';
import c from 'classnames';
import ThemeCardSkeleton from 'src/components/sparks/providerPage/themeList/ThemeCardSkeleton';
import { Theme } from 'boclips-api-client/dist/sub-clients/alignments/model/Theme';
import s from './style.module.less';
import { ThemeCard } from './ThemeCard';

interface Props {
  themes: Theme[];
  isLoading: boolean;
}

const ThemeCards = ({ themes }: Omit<Props, 'isLoading'>) => {
  const nonEmptyThemes = themes?.filter((it) => it.topics.length > 0);
  return (
    <>
      {nonEmptyThemes.map((it) => (
        <ThemeCard key={it.id} theme={it} />
      ))}
    </>
  );
};

export const ThemeList = ({ themes, isLoading }: Props) => {
  return (
    <section
      className={c(
        s.themeList,
        'col-start-2 col-end-26 grid-row-start-5 grid-row-end-5',
      )}
    >
      {isLoading ? <ThemeCardSkeleton /> : <ThemeCards themes={themes} />}
    </section>
  );
};
