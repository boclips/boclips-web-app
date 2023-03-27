import React from 'react';
import c from 'classnames';
import { Theme } from 'boclips-api-client/dist/sub-clients/alignments/model/theme/Theme';
import s from './style.module.less';
import { ThemeCard } from './ThemeCard';

interface Props {
  themes: Theme[];
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

export const ThemeList = ({ themes }: Props) => {
  return (
    <section
      className={c(
        s.themeList,
        'col-start-2 col-end-26 grid-row-start-5 grid-row-end-5',
      )}
    >
      <ThemeCards themes={themes} />
    </section>
  );
};
