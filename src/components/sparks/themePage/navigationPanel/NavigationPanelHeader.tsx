import React from 'react';
import { TextButton } from 'src/components/common/textButton/TextButton';
import BackArrow from 'src/resources/icons/back-arrow.svg';
import { Typography } from '@boclips-ui/typography';
import Button from '@boclips-ui/button';
import CloseButtonIcon from 'src/resources/icons/cross-icon.svg';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import { useNavigate } from 'react-router-dom';
import { useThemeMobileMenuContext } from 'src/components/common/providers/ThemeMobileMenuProvider';
import { ThemeLogo } from 'src/components/sparks/themePage/themeLogo/ThemeLogo';
import { useAlignmentProvider } from 'src/components/common/providers/AlignmentContextProvider';
import { Theme } from 'boclips-api-client/dist/sub-clients/alignments/model/Theme';
import s from './style.module.less';

interface Props {
  theme: Theme;
}

const NavigationPanelHeader = ({ theme }: Props) => {
  const isNotDesktop = useMediaBreakPoint().type !== 'desktop';
  const navigate = useNavigate();
  const provider = useAlignmentProvider();

  const { setIsOpen } = useThemeMobileMenuContext();

  const goToExplorePage = () => {
    navigate(`/explore/${provider.navigationPath}`);
  };

  return (
    <section
      data-qa="table of contents panel"
      className={s.tocHeaderWrapper}
      aria-labelledby="navigation-header"
    >
      {!isNotDesktop && (
        <TextButton
          onClick={goToExplorePage}
          text="Back"
          icon={<BackArrow />}
        />
      )}
      <div className={s.tocHeader}>
        {!isNotDesktop && <ThemeLogo theme={theme} className="mr-4" />}
        <Typography.H1
          size="sm"
          className="text-gray-900"
          id="navigation-header"
          aria-label={`${theme?.title} navigation`}
        >
          {theme.title}
        </Typography.H1>
        {isNotDesktop && (
          <Button
            text="Close"
            type="label"
            iconOnly
            icon={<CloseButtonIcon />}
            aria-label="Close the Table of contents"
            className={s.closeButton}
            onClick={() => {
              setIsOpen(false);
              window.scrollTo({ top: 0 });
            }}
          />
        )}
      </div>
    </section>
  );
};

export default NavigationPanelHeader;
