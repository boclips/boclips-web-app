import React from 'react';
import PageHeader from '@src/components/pageTitle/PageHeader';
import Button from '@boclips-ui/button';
import OpenBookIcon from '@src/resources/icons/open-book.svg';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import { useThemeMobileMenuContext } from '@src/components/common/providers/ThemeMobileMenuProvider';
import { TextButton } from '@src/components/common/textButton/TextButton';
import BackArrow from '@src/resources/icons/back-arrow.svg';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@boclips-ui/typography';
import { useAlignmentProvider } from '@src/components/common/providers/AlignmentContextProvider';
import s from './style.module.less';

interface Props {
  themeTitle: string;
  topicTitle: string;
}

export const Header = ({ themeTitle, topicTitle }: Props) => {
  const breakpoint = useMediaBreakPoint();
  const providerPath = useAlignmentProvider().navigationPath;
  const isNotDesktop = breakpoint.type !== 'desktop';
  const { setIsOpen } = useThemeMobileMenuContext();
  const navigate = useNavigate();

  const goToExplorePage = () => {
    navigate(`/alignments/${providerPath}`);
  };

  return (
    <div className={s.themeHeader}>
      {isNotDesktop && (
        <TextButton
          onClick={goToExplorePage}
          text="Back"
          icon={<BackArrow />}
        />
      )}
      <PageHeader
        title={themeTitle}
        button={
          isNotDesktop && (
            <Button
              icon={<OpenBookIcon />}
              text="Course content"
              type="outline"
              onClick={() => setIsOpen(true)}
              width="190px"
              height="48px"
            />
          )
        }
      />
      <Typography.H2 size="sm" className="text-gray-700">
        {topicTitle}
      </Typography.H2>
    </div>
  );
};
