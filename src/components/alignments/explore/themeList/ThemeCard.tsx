import ArrowIconSVG from 'src/resources/icons/arrow-no-size.svg';
import React from 'react';
import { Typography } from '@boclips-ui/typography';
import { useNavigate } from 'react-router-dom';
import { getVideoCountLabel } from 'src/services/getVideoCountLabel';
import { ThemeLogo } from 'src/components/alignments/themePage/themeLogo/ThemeLogo';
import { handleEscapeKeyEvent } from 'src/services/handleKeyEvent';
import { useAlignmentProvider } from 'src/components/common/providers/AlignmentContextProvider';
import { Theme } from 'boclips-api-client/dist/sub-clients/alignments/model/theme/Theme';
import s from './style.module.less';

interface Props {
  theme: Theme;
}

export const ThemeCard = ({ theme }: Props) => {
  const navigate = useNavigate();
  const provider = useAlignmentProvider();

  const onKeyDown = () => {
    document.querySelector('main').focus();
  };

  const onCardClick = (themeId: string) => {
    navigate({
      pathname: `/alignments/${provider.navigationPath}/${themeId}`,
    });
  };

  const getTotalVideoCount = () => {
    return theme.topics
      .flatMap((topic) => topic.targets.map((target) => target.videoIds.length))
      .reduce((a, b) => a + b);
  };

  return (
    <button
      onClick={() => onCardClick(theme.id)}
      type="button"
      aria-label={`theme ${theme.title}`}
      className={s.themeCard}
      onKeyDown={(e) => handleEscapeKeyEvent(e, onKeyDown)}
    >
      <ThemeLogo theme={theme} />
      <div className={s.themeTitle}>
        <Typography.H2 size="xs" className="!text-base truncate">
          {theme.title}
        </Typography.H2>
        <span className="text-gray-700 text-sm">
          {getVideoCountLabel(getTotalVideoCount())}
        </span>
      </div>
      <div className={s.arrow}>
        <ArrowIconSVG aria-hidden className={s.arrowIcon} />
      </div>
    </button>
  );
};
