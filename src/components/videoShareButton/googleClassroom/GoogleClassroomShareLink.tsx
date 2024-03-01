import React from 'react';
import GoogleClassroomIcon from 'src/resources/icons/classroom/google-classroom-logo.png';
import { Typography } from '@boclips-ui/typography';
import { GoogleClassroomUrlBuilder } from './GoogleClassroomUrlBuilder';
import s from './GoogleClassroomShareLink.module.less';

interface Props {
  link: string;
  postTitle: string;
  postBody?: string;
  onClick: () => void;
}

export const GoogleClassroomShareLink = ({
  link,
  onClick,
  postBody,
  postTitle,
}: Props) => {
  const url = new GoogleClassroomUrlBuilder()
    .setVideoUrl(link)
    .setTitle(postTitle)
    .setBody(postBody)
    .build();

  return (
    <Typography.Link type="inline-blue">
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        onClick={() => {
          onClick();
        }}
        data-qa="classroom-link"
        aria-label="Share to Google Classroom"
      >
        <div className="flex items-center">
          <img
            width="24"
            height="24"
            src={GoogleClassroomIcon}
            alt="Google Classroom logo"
          />
          <span className={s.googleClassroomLink}>
            Share to Google Classroom
          </span>
        </div>
      </a>
    </Typography.Link>
  );
};
