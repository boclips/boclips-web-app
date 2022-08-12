import React from 'react';
import PageHeader from 'src/components/pageTitle/PageHeader';
import Button from '@boclips-ui/button';
import OpenBookIcon from 'src/resources/icons/open-book.svg';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import s from './style.module.less';

interface Props {
  bookTitle: string;
  openCourseContent: () => void;
}

export const OpenstaxBookHeader = ({ bookTitle, openCourseContent }: Props) => {
  const breakpoint = useMediaBreakPoint();
  const isNotDesktop = breakpoint.type !== 'desktop';

  return (
    <div className={s.bookHeader}>
      <PageHeader
        title={bookTitle}
        button={
          isNotDesktop && (
            <Button
              icon={<OpenBookIcon />}
              text="Course content"
              type="outline"
              onClick={openCourseContent}
              width="180px"
              height="48px"
            />
          )
        }
      />
    </div>
  );
};
